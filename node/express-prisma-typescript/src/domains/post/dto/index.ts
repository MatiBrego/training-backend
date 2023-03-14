import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  content!: string;

  @IsOptional()
  @MaxLength(4)
  images?: string[];
}

export class PostDTO {

  constructor(post: PostDTO) {
    this.id = post.id;
    this.authorId = post.authorId;
    this.content = post.content;
    this.images = post.images;
    this.createdAt = post.createdAt;
  }

  id: string;
  authorId: string;
  content: string;
  images: string[];
  createdAt: Date;
}
