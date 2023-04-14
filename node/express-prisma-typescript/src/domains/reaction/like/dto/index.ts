export class LikeDto{

    constructor(like: LikeDto) {
        this.likerId = like.likerId;
        this.postId = like.postId;
    }

    likerId: string;
    postId: string
}