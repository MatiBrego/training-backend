import {FollowDto} from "@domains/follow/dto";

export interface FollowRepository{
    create(followerId: string , followedId: string): Promise<FollowDto>;
    delete(followId: string): Promise<void>;
    getByUsersId(followerId: string , followedId: string): Promise<FollowDto| null>;
}