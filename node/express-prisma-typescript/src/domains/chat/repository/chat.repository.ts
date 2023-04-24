import {PrismaClient} from "@prisma/client";
import {RoomDto} from "@domains/chat/dto";


export class ChatRepository{
    constructor(private readonly db: PrismaClient) {}

    async getRoomByUserId(userId: string, receiverId: string): Promise<RoomDto| null>{
        const room = await this.db.chatRoom.findFirst({
            where: {
                users: {
                    every: {
                        //Get rooms where its users have ids that belong to this list
                        userId: {in: [userId, receiverId]}
                    }
                }
            }
        })
        return room? new RoomDto(room): null
    }

    async createRoom(userId: string, receiverId: string){
        return await this.db.chatRoom.create({
                data: {
                    users: {
                        //Connect users to this room if they exist, or create them
                        connectOrCreate: [
                            {
                            where: {id: userId},
                            create: {
                                user: {connect: {id: userId}}
                                }
                            },
                            {
                            where: {id: receiverId},
                            create: {
                                user: {connect: {id: receiverId}}
                                }
                            }
                        ]
                    }
                }
            })
    }

    async createMessage(userId: string, roomId: string, message: string){
        const chatUser = await this.db.chatUser.findFirst({
            where: {
                userId: userId
            },
            select: {
                user: true,
                id: true
            }
        })
        if(chatUser) {
            await this.db.chatMessage.create({
                data: {
                    message: message,
                    userId: chatUser.id,
                    chatRoomId: roomId
                }
            })
        }
        return chatUser
    }

    async getMessagesByRoomId(roomId: string){
        return await this.db.chatMessage.findMany({
            where: {
                chatRoomId: roomId
            },
            select: {
                message: true,
                user: {
                    select: {
                        user: true
                    }
                }
            }
        })
    }
}