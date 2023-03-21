import {db} from "@utils";
import {Router} from "express";
import HttpStatus from "http-status";
import {RetweetService, RetweetServiceImpl} from "@domains/reaction/retweet/service";
import {RetweetRepositoryImpl} from "@domains/reaction/retweet/repository/retweet.repository.impl";


export const retweetRouter = Router();

const service: RetweetService = new RetweetServiceImpl(new RetweetRepositoryImpl(db))

retweetRouter.post('/:postId', async (req, res) => {
    const { userId } = res.locals.context;
    const { postId } = req.params;

    const retweet = await service.retweetPost(userId, postId);
    res.status(HttpStatus.OK).json(retweet);
})

retweetRouter.delete('/:postId', async (req, res) => {
    const { userId } = res.locals.context;
    const { postId } = req.params;

    await service.unretweetPost(userId, postId);
    res.status(HttpStatus.OK).send("Deleted");
})
