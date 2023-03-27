import {RetweetRepository} from "./retweet.repository";
import {PrismaClient} from "@prisma/client";
import {RetweetDto} from "@domains/reaction/retweet/dto";

export class RetweetRepositoryImpl implements RetweetRepository{
    constructor(private readonly db:PrismaClient) {
    }

    async create(retweeterId: string, postId: string): Promise<RetweetDto> {
        const retweet = await this.db.retweet.create({
            data: {
                retweeterId: retweeterId,
                postId: postId
            }
        })
        return new RetweetDto(retweet)
    }

    async delete(retweeterId: string, postId: string): Promise<void> {
        await this.db.retweet.deleteMany({
            where:{
                AND:{
                    retweeterId: retweeterId,
                    postId: postId
                }
            }
        })
    }

    async getRetweet(retweeterId: string, postId: string): Promise<RetweetDto | null> {
        const retweet = await this.db.retweet.findFirst({
            where:{
                AND:{
                    retweeterId: retweeterId,
                    postId: postId
                }
            }
        })

        return retweet ? new RetweetDto(retweet): null;
    }

    async getRetweetsByUserId(userId: string): Promise<RetweetDto[]>{
        const retweets = await this.db.retweet.findMany({
            where:{
                retweeterId: userId
            }
        })

        return retweets.map(retweet => new RetweetDto(retweet));
    }
}