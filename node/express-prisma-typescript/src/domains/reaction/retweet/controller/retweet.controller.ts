import {db} from "@utils";
import {Router} from "express";
import HttpStatus from "http-status";
import {RetweetService, RetweetServiceImpl} from "@domains/reaction/retweet/service";
import {RetweetRepositoryImpl} from "@domains/reaction/retweet/repository/retweet.repository.impl";


export const retweetRouter = Router();

const service: RetweetService = new RetweetServiceImpl(new RetweetRepositoryImpl(db))

/**
 * @swagger
 * /api/reaction/retweet/{postId}:
 *   post:
 *     summary: Retweets a post
 *     description: Given a post id, retweets the post with that id
 *     parameters:
 *     - in: path
 *       name: postId
 *       required: true
 *       schema:
 *        type: string
 */
retweetRouter.post('/:postId', async (req, res) => {
    const { userId } = res.locals.context;
    const { postId } = req.params;

    const retweet = await service.retweetPost(userId, postId);
    res.status(HttpStatus.OK).json(retweet);
})

/**
 * @swagger
 * /api/reaction/retweet/{postId}:
 *   delete:
 *     summary: Unretweets a post
 *     description: Given a post id, unretweets the post with that id
 *     parameters:
 *     - in: path
 *       name: postId
 *       required: true
 *       schema:
 *        type: string
 */
retweetRouter.delete('/:postId', async (req, res) => {
    const { userId } = res.locals.context;
    const { postId } = req.params;

    await service.unretweetPost(userId, postId);
    res.status(HttpStatus.OK).send("Deleted");
})

/**
 * @swagger
 * /api/reaction/retweet/{userId}:
 *   get:
 *     summary: Returns all retweets by a user
 *     description: Given a user id, return all retweets from that user.
 *     parameters:
 *     - in: path
 *       name: UserId
 *       required: true
 *       schema:
 *        type: string
 */
retweetRouter.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    const retweets = await service.getRetweetsByUser(userId);

    res.status(HttpStatus.OK).json(retweets);
})