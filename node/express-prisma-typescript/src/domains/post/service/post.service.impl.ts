import { CreatePostInputDTO, PostDTO } from '../dto';
import { PostRepository } from '../repository';
import { PostService } from '.';
import { validate } from 'class-validator';
import {ForbiddenException, NotFoundException, PrivateAccessException} from '@utils';
import { CursorPagination } from '@types';
import {UserRepository} from "@domains/user/repository";
import {FollowRepository} from "@domains/follow/repository/follow.repository";

export class PostServiceImpl implements PostService {
  constructor(private readonly repository: PostRepository,
              private readonly userRepository: UserRepository,
              private readonly followRepository: FollowRepository) {}

  createPost(userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    validate(data);
    return this.repository.create(userId, data);
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId);
    if (!post) throw new NotFoundException('post');
    if (post.authorId !== userId) throw new ForbiddenException();
    return this.repository.delete(postId);
  }

  async getPost(userId: string, postId: string): Promise<PostDTO> {
    const post = await this.repository.getById(postId);
    if (!post) throw new NotFoundException('post');

    const author = await this.userRepository.getById(post.authorId);
    if(author?.isPrivate) {
      const follow = await this.followRepository.getByUsersId(userId, author.id)
      if (!follow) throw new PrivateAccessException();
    }

    return post;
  }

  getLatestPosts(userId: string, options: CursorPagination): Promise<PostDTO[]> {
    return this.repository.getAllByDatePaginatedPublicOrFollowed(userId, options);
  }

  async getPostsByAuthor(userId: any, authorId: string, options: CursorPagination): Promise<PostDTO[]> {
    const author = await this.userRepository.getById(authorId);

    if(author?.isPrivate) {
      const follow = await this.followRepository.getByUsersId(userId, author.id)
      if (!follow) throw new PrivateAccessException();
    }

    return this.repository.getByAuthorId(authorId, options);
  }

  async commentPost(userId: string, postId: string, body: CreatePostInputDTO): Promise<PostDTO>{
    return await this.repository.createComment(userId, postId, body);
  }

}
