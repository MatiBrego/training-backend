import {IsNotEmpty, IsString} from "class-validator";

export class RoomDto{
    id: string;

    constructor(room: RoomDto) {
        this.id = room.id;
    }
}

export class RoomJoinRequestDto{

    @IsString()
    @IsNotEmpty()
    userId!: string;

    @IsString()
    @IsNotEmpty()
    receiverId!: string;
}

export class MessageRequestDto{

    @IsString()
    @IsNotEmpty()
    userId!: string;

    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsString()
    @IsNotEmpty()
    roomId!: string
}