import {RetweetDto} from "@domains/reaction/retweet/dto";

export interface RetweetService {
    retweetPost(retweetId: string, postId: string): Promise<RetweetDto>;
    unretweetPost(retweetId: string, postId: string): Promise<void>;
}