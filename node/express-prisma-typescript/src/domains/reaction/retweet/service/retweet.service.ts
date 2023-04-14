import {RetweetDto} from "@domains/reaction/retweet/dto";

export interface RetweetService {
    retweetPost(retweeterId: string, postId: string): Promise<RetweetDto>;
    unretweetPost(retweeterId: string, postId: string): Promise<void>;
    getRetweetsByUser(userId: string): Promise<RetweetDto[]>;
}