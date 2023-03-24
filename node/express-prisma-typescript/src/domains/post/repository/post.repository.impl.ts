import { PrismaClient } from '@prisma/client';
import { CursorPagination } from '@types';
import { PostRepository } from '.';
import { CreatePostInputDTO, PostDTO } from '../dto';

export class PostRepositoryImpl implements PostRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data,
      },
    });
    return new PostDTO(post);
  }

  async getAllByDatePaginated(options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: {
        id: options.after ? options.after : options.before ? options.before : undefined,
      },
      skip: options.after || options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          id: 'asc',
        },
      ],
    });
    return posts.map(post => new PostDTO(post));
  }

  async getAllByDatePaginatedPublicOrFollowed(userId: string, options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: {
        id: options.after ? options.after : options.before ? options.before : undefined,
      },
      skip: options.after || options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          id: 'asc',
        },
      ],
      where: {
        author: {
          OR: [
              {
                isPrivate: false,
              }, {
                  followers: {
                    some: {
                      followerId: userId
                      }
                  }
              }
          ]
        }
      }
    });

    return posts.map(post => new PostDTO(post));
  }

  async delete(postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId,
      },
    });
  }

  async getById(postId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          take: 10,
          orderBy: [
              {
                retweets: {_count: 'desc'},
              },
          ],
          select: {
            id: true,
            authorId: true,
            content: true,
            images: true,
            createdAt: true,
            _count:{
              select:{
                retweets: true,
              }
            }
          },
        }
      }
    });
    console.log(post);
    return post ? new PostDTO(post) : null;
  }

  async getByAuthorId(authorId: string, options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: {
        id: options.after ? options.after : options.before ? options.before : undefined,
      },
      skip: options.after || options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          id: 'asc',
        },
      ],
      where: {
        authorId: authorId,
      },
    });
    return posts.map(post => new PostDTO(post));
  }

  async createComment(userId: string, postId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const comment = await this.db.post.create({
      data: {
        authorId: userId,
        parentPostId: postId,
        ...data
      }
    })

    return new PostDTO(comment);
  }
}
