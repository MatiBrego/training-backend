import {LikeDto} from "@domains/reaction/like/dto";

export interface LikeRepository{
    create(likerId: string, postId: string): Promise<LikeDto>;
    delete(likerId: string, postId: string): Promise<void>;
}