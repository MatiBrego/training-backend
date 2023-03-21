import {LikeService} from "./like.service";
import {LikeRepository} from "@domains/reaction/like/repository/like.repository";
import {LikeDto} from "@domains/reaction/like/dto";

export class LikeServiceImpl implements LikeService{
    constructor(private readonly repository: LikeRepository) {
    }

    async likePost(likerId: string, postId: string): Promise<LikeDto> {
        return await this.repository.create(likerId, postId)
    }

    async unlikePost(likerId: string, postId: string): Promise<void> {
        return await this.repository.delete(likerId, postId);
    }

}