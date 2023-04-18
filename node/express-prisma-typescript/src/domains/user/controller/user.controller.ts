import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

import { db } from '@utils';

import { UserRepositoryImpl } from '../repository';
import { UserService, UserServiceImpl } from '../service';

export const userRouter = Router();

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db));

userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { limit, skip } = req.query as Record<string, string>;

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) });

  return res.status(HttpStatus.OK).json(users);
});

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Returns information about the logged user
 *     description: Returns information about the logged user
 */
userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;

  const user = await service.getUser(userId);

  return res.status(HttpStatus.OK).json(user);
});

/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Returns information about a user by id
 *     description: Returns information about a user by id
 *     parameters:
 *     - in: path
 *       name: userId
 *       required: true
 *       schema:
 *        type: integer
 */
userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params;

  const user = await service.getUser(otherUserId);

  return res.status(HttpStatus.OK).json(user);
});

/**
 * @swagger
 * /api/user/:
 *   delete:
 *     summary: Deletes logged user
 *     description: Deletes logged user
 */
userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;

  await service.deleteUser(userId);

  return res.status(HttpStatus.OK);
});

userRouter.post("/private", async (req: Request, res: Response) => {
  const { userId } = res.locals.context;

  await service.makeUserPrivate(userId);

  return res.status(HttpStatus.OK).send();
});

userRouter.post("/public", async (req: Request, res: Response) => {
  const { userId } = res.locals.context;

  await service.makeUserPublic(userId);

  return res.status(HttpStatus.OK).send();
});

userRouter.post("/pic", async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const picUrl = await service.addProfilePic(userId)

  return res.status(HttpStatus.OK).send({url: picUrl})
})

userRouter.get("/pic/get", async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  console.log("hello")

  const picUrl = await service.getProfilePic(userId)

  return res.status(HttpStatus.OK).send({url: picUrl})
})