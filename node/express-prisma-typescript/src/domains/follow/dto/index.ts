

export class FollowDto{

    id: string;
    followerId: string;
    followedId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    constructor(follow: FollowDto) {
        this.followerId = follow.followerId;
        this.followedId = follow.followedId;
        this.id = follow.id;
        this.createdAt = follow.createdAt;
        this.deletedAt = follow.deletedAt;
        this.updatedAt = follow.updatedAt;
    }
}