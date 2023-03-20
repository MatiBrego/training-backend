import { CreatePostInputDTO, PostDTO } from '../dto';
import {CursorPagination} from "@types";

export interface PostService {
  createPost(userId: string, body: CreatePostInputDTO): Promise<PostDTO>;
  deletePost(userId: string, postId: string): Promise<void>;
  getPost(userId: string, postId: string): Promise<PostDTO>;
  getLatestPosts(userId: string, options: { limit?: number; before?: string; after?: string }): Promise<PostDTO[]>;
  getPostsByAuthor(userId: any, authorId: string, options: CursorPagination): Promise<PostDTO[]>;
}
