import {Request, Response, Router} from "express";
import {FollowService, FollowServiceImpl} from "@domains/follow/service";
import {db} from "@utils";
import {FollowRepositoryImpl} from "@domains/follow/repository/follow.repository.impl";
import HttpStatus from "http-status";

export const followRouter = Router();

const service: FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db))

/**
 * @swagger
 * /api/follower/follow/{userId}:
 *   post:
 *     summary: Follow a user
 *     description: Makes the logged user follow the user with the provided Id
 *     parameters:
 *     - in: path
 *       name: userId
 *       required: true
 *       schema:
 *        type: string
 */
followRouter.post('follow/:user_id', async (req: Request, res: Response) => {
    const { userId } = res.locals.context;

    const { user_id } = req.params;

    await service.FollowUser(userId, user_id);

    return res.status(HttpStatus.OK).send();
})

/**
 * @swagger
 * /api/follower/unfollow/{userId}:
 *   post:
 *     summary: Unfollow a user
 *     description: Makes the logged user unfollow the user with the provided Id
 *     parameters:
 *     - in: path
 *       name: userId
 *       required: true
 *       schema:
 *        type: string
 */
followRouter.post('/:user_id', async (req: Request, res: Response) => {
    const { userId } = res.locals.context; //Follower

    const { user_id } = req.params; //Followed

    await service.UnfollowUser(userId, user_id);

    return res.status(HttpStatus.OK).send();

})