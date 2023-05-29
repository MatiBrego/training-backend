import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import {LikeDto} from "@domains/reaction/like/dto";

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
    this.comments = post.comments
    this.likes = post.likes
  }

  id: string;
  authorId: string;
  content: string;
  images: string[];
  createdAt: Date;
  comments?: PostDTO[];
  likes?: LikeDto[]
}
