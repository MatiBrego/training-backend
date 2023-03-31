import {ChatRepository} from "@domains/chat/repository/chat.repository";
import {Socket} from "socket.io";
import {RoomDto} from "@domains/chat/dto";

export class ChatService{

    constructor(private readonly repository: ChatRepository){}

    async joinRoom(socket: Socket, userId: string, receiverId: string): Promise<RoomDto>{
        let room = await this.repository.getRoomByUserId(userId, receiverId);

        if(room)
            socket.join(room.id);
        else
            room = await this.repository.createRoom(userId, receiverId);
            socket.join(room.id);

        return room;
    }

    async saveMessage(userId: string, roomId: string, message: string){
        await this.repository.createMessage(userId, roomId, message);
    }

    async getPreviousMessages(roomId: string){
        return await this.repository.getMessagesByRoomId(roomId)
    }
}