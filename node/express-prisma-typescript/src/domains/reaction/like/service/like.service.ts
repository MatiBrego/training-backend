import {LikeDto} from "@domains/reaction/like/dto";

export interface LikeService{
    likePost(likerId: string, postId: string): Promise<LikeDto>;
    unlikePost(likerId: string, postId: string): Promise<void>;
    getLikesByUser(userId: string): Promise<LikeDto[]>;
}