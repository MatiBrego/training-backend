import {Server} from "socket.io";
import {ChatService} from "@domains/chat/service/chat.service";
import {ChatRepository} from "@domains/chat/repository/chat.repository";
import {db, SocketBodyValidation, ValidationException} from "@utils";
import {MessageRequestDto, RoomJoinRequestDto} from "@domains/chat/dto";


const service = new ChatService(new ChatRepository(db));

export function chatController(io: Server){

    //Listen to socket connections
    io.on('connection',(socket) => {
        console.log('User connected');

        //Handle socket room joining requests
        socket.on("joinRoom", async (body) => {
            try {
                //Validate room request body
                await SocketBodyValidation(body, RoomJoinRequestDto)
            }catch (validationError){
                io.to(socket.id).emit("roomJoined", {status: 400, err: (validationError as ValidationException).error })
                return
            }

            //Get room between logged user and the receiver, then return its id
            const room = await service.joinRoom(socket, socket.data.context.userId, body.receiverId);
            io.to(room.id).emit("roomJoined", {status: 200, roomId: room.id, userId: body.userId})

            //Get previous messages from that room, and send them to the requester socket
            const prevMessages = await service.getPreviousMessages(room.id)
            for (const msg of prevMessages) {
                //Chat user in message is named the same as user in chat user. Should be changed
                io.to(socket.id).emit("onMessage", msg.user.user.username + ': ' + msg.message)
            }
        })

        //Handle message emission request to a room
        socket.on('emitMessage', async (body) => {
            try {
                //Validate message request body
                await SocketBodyValidation(body, MessageRequestDto)
            }catch (validationError){
                io.to(socket.id).emit("onMessage", {status: 400, err: (validationError as ValidationException).error })
                return
            }

            //Emit message to the room
            io.to(body.roomId).emit('onMessage', 'message: ' + body.message)

            //Save message to database
            await service.saveMessage(socket.data.context.userId, body.roomId, body.message)
        });
    });
}