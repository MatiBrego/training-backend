import {FollowDto} from "@domains/follow/dto";

export interface FollowService{
    FollowUser(followerId: string, followedId: string): Promise<FollowDto>;
    UnfollowUser(followerId: string, followedId: string): Promise<void>;
}