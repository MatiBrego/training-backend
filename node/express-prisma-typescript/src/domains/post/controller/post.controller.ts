import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

import { db, BodyValidation } from '@utils';

import { PostRepositoryImpl } from '../repository';
import { PostService, PostServiceImpl } from '../service';
import { CreatePostInputDTO } from '../dto';
import {UserRepositoryImpl} from "@domains/user/repository";
import {FollowRepositoryImpl} from "@domains/follow/repository/follow.repository.impl";


export const postRouter = Router();

// Use dependency injection
const service: PostService = new PostServiceImpl(
    new PostRepositoryImpl(db),
    new UserRepositoryImpl(db),
    new FollowRepositoryImpl(db));

/**
 * @swagger
 * /api/post:
 *   get:
 *     summary: Returns posts in feed
 *     description: Returns posts in feed (paginated). If any post author is private, their posts will be returned only if logged user follows this author
 *     parameters:
 *      - in: query
 *        name: limit
 *        required: true
 *        schema:
 *          type: integer
 *        description: The amount of records to return
 *      - in: query
 *        name: before
 *        required: true
 *        schema:
 *          type: string
 *        description: The id of the record after the last returned record
 *      - in: query
 *        name: after
 *        schema:
 *          type: string
 *        description: The id of the record before the first returned record
 */
postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { limit, before, after } = req.query as Record<string, string>;

  const posts = await service.getLatestPosts(userId, { limit: Number(limit), before, after });

  return res.status(HttpStatus.OK).json(posts);
});

/**
 * @swagger
 * /api/post/{postId}:
 *   get:
 *     summary: Returns a post by id
 *     description: Returns a post by id with 10 of its most reacted comments. If the post author is private, the post will be returned only if logged user follows the author.
 *     responses:
 *      404:
 *        description: Post Not Found
 *     parameters:
 *     - in: path
 *       name: postId
 *       required: true
 *       schema:
 *        type: string
 */
postRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { postId } = req.params;

  const post = await service.getPost(userId, postId);

  return res.status(HttpStatus.OK).json(post);
});

/**
 * @swagger
 * /api/post/by_user/{userId}:
 *   get:
 *     summary: Returns posts made by a user
 *     description: Given a user id, returns posts (paginated) by the user with that Id. If requested post author is private, their posts will be returned only if logged user follows this author
 *     responses:
 *      404:
 *        description: User Not Found
 *     parameters:
 *      - in: path
 *        name: UserId
 *        required: true
 *        schema:
 *        type: string
 *      - in: query
 *        name: limit
 *        required: true
 *        schema:
 *          type: integer
 *        description: The amount of records to return
 *      - in: query
 *        name: before
 *        required: true
 *        schema:
 *          type: string
 *        description: The id of the record after the last returned record
 *      - in: query
 *        name: after
 *        schema:
 *          type: string
 *        description: The id of the record before the first returned record
 */
postRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { userId: authorId } = req.params;
  const { limit, before, after } = req.query as Record<string, string>;


  const posts = await service.getPostsByAuthor(userId, authorId, {limit: Number(limit), before, after});
  return res.status(HttpStatus.OK).json(posts);
});

/**
 * @swagger
 * /api/post:
 *  post:
 *    summary: Create a post.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *                description: Content for post.
 *                example: Hello World!
 *                required: true
 *              images:
 *                type: string
 *                description: Images to add
 *                example: picture.jpg
 */
postRouter.post('/', BodyValidation(CreatePostInputDTO) ,async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const data = req.body;

  const post = await service.createPost(userId, data);

  return res.status(HttpStatus.CREATED).json(post);
});

postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { postId } = req.params;

  await service.deletePost(userId, postId);

  return res.status(HttpStatus.OK);
});

/**
 * @swagger
 * /api/post/comment/{postId}:
 *  post:
 *    summary: Create a comment in a post.
 *    parameters:
 *      - in: path
 *        name: PostId
 *        required: true
 *        schema:
 *        type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *                description: Content for post.
 *                example: Hello World!
 *                required: true
 *              images:
 *                type: string
 *                description: Images to add
 *                example: picture.jpg
 */
postRouter.post('/comment/:postId', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { postId } = req.params;
  const data = req.body;

  const comment = await service.commentPost(userId, postId, data)

  return res.status(HttpStatus.OK).json(comment)
})

/**
 * @swagger
 * /api/post/comment/{userId}:
 *   get:
 *     summary: Returns all comments by a user
 *     description: Given a user id, return all comments from that user.
 *     parameters:
 *     - in: path
 *       name: UserId
 *       required: true
 *       schema:
 *        type: string
 */
postRouter.get('/comment/:userId', async (req, res) => {
  const {userId} = req.params;

  const comments = await service.getCommentsByUser(userId);
  return res.status(HttpStatus.OK).json(comments)
})
