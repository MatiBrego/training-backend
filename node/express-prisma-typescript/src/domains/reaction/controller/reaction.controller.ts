import {Router} from "express";
import {likeRouter} from "@domains/reaction/like";
import {retweetRouter} from "@domains/reaction/retweet/controller/retweet.controller";

export const reactionRouter = Router()

reactionRouter.use('/like', likeRouter)
reactionRouter.use('/retweet', retweetRouter)