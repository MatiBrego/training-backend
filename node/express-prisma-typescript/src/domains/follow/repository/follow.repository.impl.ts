import { PrismaClient } from '@prisma/client';

import {FollowRepository} from './follow.repository';
import {FollowDto} from "../dto";



export class FollowRepositoryImpl implements FollowRepository{
    constructor(private readonly db: PrismaClient) {}

    async create(InputFollowerId: string, InputFollowedId: string): Promise<FollowDto> {
        const follow = await this.db.follow.create({
            data: {
                followerId: InputFollowerId,
                followedId: InputFollowedId
            }
        })

        return new FollowDto(follow);
    }

    async delete(followId: string): Promise<void>{
        await this.db.follow.delete({
            where: {
                id: followId
            }
        })
    }

    async getByUsersId(followerId: string, followedId: string): Promise<FollowDto| null>{
        const follow = await this.db.follow.findFirst({
            where:{
                followerId: followerId,
                followedId: followedId
            }
        })
        return follow? new FollowDto(follow): null;
    }
}