import {LikeService} from "./like.service";
import {LikeRepository} from "@domains/reaction/like/repository/like.repository";
import {LikeDto} from "@domains/reaction/like/dto";
import {ConflictException} from "@utils";

export class LikeServiceImpl implements LikeService{
    constructor(private readonly repository: LikeRepository) {
    }

    async likePost(likerId: string, postId: string): Promise<LikeDto> {
        if (!await this.repository.getLike(likerId, postId))
            return await this.repository.create(likerId, postId);

        throw new ConflictException();
    }

    async unlikePost(likerId: string, postId: string): Promise<void> {
        return await this.repository.delete(likerId, postId);
    }

    async getLikesByUser(userId: string){
        return await this.repository.getLikesByUserId(userId);
    }
}