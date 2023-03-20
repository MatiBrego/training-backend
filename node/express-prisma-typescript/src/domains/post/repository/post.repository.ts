import { CursorPagination } from '@types';
import { CreatePostInputDTO, PostDTO } from '../dto';

export interface PostRepository {
  create(userId: string, data: CreatePostInputDTO): Promise<PostDTO>;
  getAllByDatePaginated(options: CursorPagination): Promise<PostDTO[]>;
  getAllByDatePaginatedPublicOrFollowed(userId:string, options: CursorPagination): Promise<PostDTO[]>;
  delete(postId: string): Promise<void>;
  getById(postId: string): Promise<PostDTO | null>;
  getByIdPublicOrFollowed(userId:string, postId: string): Promise<PostDTO | null>;
  getByAuthorId(authorId: string): Promise<PostDTO[]>;
  getByAuthorIdPublicOrFollowed(userId: string, authorId: string): Promise<PostDTO[]>;
}
