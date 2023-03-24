import {RetweetDto} from "@domains/reaction/retweet/dto";
import {RetweetRepository} from "@domains/reaction/retweet/repository/retweet.repository";
import {RetweetService} from "@domains/reaction/retweet/service/retweet.service";
import {ConflictException} from "@utils";

export class RetweetServiceImpl implements RetweetService{
    constructor(private readonly repository: RetweetRepository) {
    }

    async retweetPost(retweeterId: string, postId: string): Promise<RetweetDto> {
        if(!await this.repository.getRetweet(retweeterId, postId))
            return await this.repository.create(retweeterId, postId);

        throw new ConflictException();
    }

    async unretweetPost(retweeterId: string, postId: string): Promise<void> {
        return await this.repository.delete(retweeterId, postId);
    }
}