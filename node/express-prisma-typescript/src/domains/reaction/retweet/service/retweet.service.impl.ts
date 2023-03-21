import {RetweetDto} from "@domains/reaction/retweet/dto";
import {RetweetRepository} from "@domains/reaction/retweet/repository/retweet.repository";
import {RetweetService} from "@domains/reaction/retweet/service/retweet.service";

export class RetweetServiceImpl implements RetweetService{
    constructor(private readonly repository: RetweetRepository) {
    }

    async retweetPost(retweetId: string, postId: string): Promise<RetweetDto> {
        return await this.repository.create(retweetId, postId)
    }

    async unretweetPost(retweetId: string, postId: string): Promise<void> {
        return await this.repository.delete(retweetId, postId);
    }
}