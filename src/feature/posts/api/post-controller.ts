import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { CreatePostInputModel } from '../types/models';
import { PostService } from '../services/post-service';
import { PostQueryRepository } from '../repositories/post-query-repository';
import { ViewPost } from '../types/views';

@Controller('posts')
export class PostsController {
  constructor(
    protected postService: PostService,
    protected postQueryRepository: PostQueryRepository,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createPost(
    @Body() createPostInputModel: CreatePostInputModel,
  ): Promise<ViewPost | null> {
    /* создать новый пост  и вернуть данные этого поста и также
    внутри структуру данных(снулевыми значениями)  о лайках  к этому посту*/

    const postId: string | null =
      await this.postService.createPost(createPostInputModel);

    if (!postId) {
      throw new NotFoundException(
        'Cannot create post because blog does not exist-:method-post,url-posts',
      );
    }

    const post: ViewPost | null =
      await this.postQueryRepository.getPostById(postId);

    if (post) {
      return post;
    } else {
      throw new NotFoundException('Cannot create post- :method-post,url-posts');
    }
  }
}
