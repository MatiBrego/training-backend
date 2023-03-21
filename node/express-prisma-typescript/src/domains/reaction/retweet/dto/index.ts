export class RetweetDto{

    constructor(rtw: RetweetDto) {
        this.retweeterId = rtw.retweeterId;
        this.postId = rtw.postId;
    }

    retweeterId: string;
    postId: string
}