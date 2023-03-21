import {RetweetDto} from "@domains/reaction/retweet/dto";

export interface RetweetRepository {
    create(retweeterId: string, postId: string): Promise<RetweetDto>;
    delete(retweeterId: string, postId: string): Promise<void>;
}