import {LikeService} from "@domains/reaction/like/service";
import {LikeServiceImpl} from "@domains/reaction/like/service/like.service.impl";
import {LikeRepositoryImpl} from "@domains/reaction/like/repository/like.repository.impl";
import {db} from "@utils";
import {Router} from "express";
import HttpStatus from "http-status";


export const likeRouter = Router();

const service: LikeService = new LikeServiceImpl(new LikeRepositoryImpl(db))

likeRouter.post('/:postId', async (req, res) => {
    const { userId } = res.locals.context;
    const { postId } = req.params;

    const like = await service.likePost(userId, postId);
    res.status(HttpStatus.OK).json(like);
})

likeRouter.delete('/:postId', async (req, res) => {
    const { userId } = res.locals.context;
    const { postId } = req.params;

    await service.unlikePost(userId, postId);
    res.status(HttpStatus.OK).send("Deleted");
})

likeRouter.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    const likes = await service.getLikesByUser(userId);

    res.status(HttpStatus.OK).json(likes);
})
