import {LikeRepository} from "./like.repository";
import {PrismaClient} from "@prisma/client";
import {LikeDto} from "@domains/reaction/like/dto";

export class LikeRepositoryImpl implements LikeRepository{
    constructor(private readonly db:PrismaClient) {
    }

    async create(likerId: string, postId: string): Promise<LikeDto> {
        const like = await this.db.like.create({
            data: {
                likerId: likerId,
                postId: postId
            }
        })
        return new LikeDto(like)
    }

    async delete(likerId: string, postId: string): Promise<void> {
        await this.db.like.deleteMany({
            where:{
                AND:{
                    likerId: likerId,
                    postId: postId
                }
            }
        })
    }

    async getLike(likerId: string, postId: string): Promise<LikeDto | null>{
        const like = await this.db.like.findFirst({
            where: {
                AND:{
                    likerId: likerId,
                    postId: postId
                }
            }
        })
        return like ? new LikeDto(like): null;
    }
}