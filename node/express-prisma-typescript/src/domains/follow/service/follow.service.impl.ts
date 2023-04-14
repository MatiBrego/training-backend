import {FollowService} from "@domains/follow/service/follow.service";
import {FollowDto} from "@domains/follow/dto";
import {FollowRepository} from "@domains/follow/repository/follow.repository";

import {NotFoundException} from "../../../utils";

export class FollowServiceImpl implements FollowService{

    constructor(private readonly repository: FollowRepository) {
    }

    async FollowUser(followerId: string, followedId: string): Promise<FollowDto> {
        // Check if followed is the same as follower
        if(followedId === followerId) {throw new Error("Follower id and followed id cannot be the same")}

        // Check if Follow already exists
        const exists = await this.repository.getByUsersId(followerId, followedId);
        if(exists) {throw new Error("Follower already follows that user")}

        return await this.repository.create(followerId, followedId)
    }

    async UnfollowUser(followerId: string, followedId: string): Promise<void> {
        const follow = await this.repository.getByUsersId(followerId, followedId);
        if(!follow) throw new NotFoundException("Follower");

        return this.repository.delete(follow.id);
    }
}