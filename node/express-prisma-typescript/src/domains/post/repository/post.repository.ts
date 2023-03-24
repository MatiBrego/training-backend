import { CursorPagination } from '@types';
import { CreatePostInputDTO, PostDTO } from '../dto';

export interface PostRepository {
  create(userId: string, data: CreatePostInputDTO): Promise<PostDTO>;
  getAllByDatePaginated(options: CursorPagination): Promise<PostDTO[]>;
  getAllByDatePaginatedPublicOrFollowed(userId:string, options: CursorPagination): Promise<PostDTO[]>;
  delete(postId: string): Promise<void>;
  getById(postId: string): Promise<PostDTO | null>;
  getByAuthorId(authorId: string, options: CursorPagination): Promise<PostDTO[]>;
  createComment(userId: string, postId: string, data: CreatePostInputDTO): Promise<PostDTO>;
}
