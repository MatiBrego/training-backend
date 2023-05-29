import {LikeService} from "@domains/reaction/like/service";
import {LikeServiceImpl} from "@domains/reaction/like/service/like.service.impl";
import {LikeRepositoryImpl} from "@domains/reaction/like/repository/like.repository.impl";
import {db} from "@utils";
import {Router} from "express";
import HttpStatus from "http-status";


export const likeRouter = Router();

const service: LikeService = new LikeServiceImpl(new LikeRepositoryImpl(db))

/**
 * @swagger
 * /api/reaction/like/{postId}:
 *   post:
 *    summary: Likes a post
 *    description: Given a post id, likes the post with that id
 *    parameters:
 *    - in: path
 *      name: postId
 *      required: true
 *      schema:
 *      type: string
 */
likeRouter.post('/:postId', async (req, res) => {
    const { userId } = res.locals.context;
    const { postId } = req.params;

    const like = await service.likePost(userId, postId);
    res.status(HttpStatus.OK).json(like);
})

/**
 * @swagger
 * /api/reaction/like/{postId}:
 *   delete:
 *     summary: Unlikes a post
 *     description: Given a post id, unlikes the post with that id
 *     parameters:
 *     - in: path
 *       name: postId
 *       required: true
 *       schema:
 *        type: string
 */
likeRouter.delete('/:postId', async (req, res) => {
    const { userId } = res.locals.context;
    const { postId } = req.params;

    await service.unlikePost(userId, postId);
    res.status(HttpStatus.OK).send("Deleted");
})

/**
 * @swagger
 * /api/reaction/like/{userId}:
 *   get:
 *     summary: Returns all likes by a user
 *     description: Given a user id, return all likes from that user.
 *     parameters:
 *     - in: path
 *       name: UserId
 *       required: true
 *       schema:
 *        type: string
 */
likeRouter.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    const likes = await service.getLikesByUser(userId);

    res.status(HttpStatus.OK).json(likes);
})
