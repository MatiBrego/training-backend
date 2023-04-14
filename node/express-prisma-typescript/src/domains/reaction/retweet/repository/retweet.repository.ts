import {RetweetDto} from "@domains/reaction/retweet/dto";

export interface RetweetRepository {
    create(retweeterId: string, postId: string): Promise<RetweetDto>;
    delete(retweeterId: string, postId: string): Promise<void>;
    getRetweet(retweeterId: string, postId: string): Promise<RetweetDto | null>;
    getRetweetsByUserId(userId: string): Promise<RetweetDto[]>
}