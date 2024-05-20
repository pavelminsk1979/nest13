import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CreatePostInputModel,
  QueryParamsPost,
  UpdatePostInputModel,
} from '../types/models';
import { PostService } from '../services/post-service';
import { PostQueryRepository } from '../repositories/post-query-repository';
import { ViewArrayPosts, ViewPost } from '../types/views';
import { UpdateBlogInputModel } from '../../blogs/types/models';

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

  @Get()
  async getPosts(
    @Query() queryParamsPost: QueryParamsPost,
  ): Promise<ViewArrayPosts> {
    /*  blogId взял из Postman  ...  её надо потом брать 
      из token*/

    const blogId = '66495ce8668106ecdad8a120';

    const posts: ViewArrayPosts | null =
      await this.postQueryRepository.getPosts(blogId, queryParamsPost);

    if (posts) {
      return posts;
    } else {
      throw new NotFoundException(
        'blog or post  is not exists  ' +
          ':method-get,url -blogs/:blogId /posts',
      );
    }
  }

  @Get(':id')
  async getPostById(@Param('id') postId: string): Promise<ViewPost | null> {
    const post: ViewPost | null =
      await this.postQueryRepository.getPostById(postId);

    if (post) {
      return post;
    } else {
      throw new NotFoundException('post not found:method-get,url /posts/id');
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateBlog(
    @Param('id') postId: string,
    @Body() updatePostInputModel: UpdatePostInputModel,
  ) {
    const isUpdatePost: boolean = await this.postService.updatePost(
      postId,
      updatePostInputModel,
    );

    if (isUpdatePost) {
      return;
    } else {
      throw new NotFoundException(
        'post not update:andpoint-put ,url /posts/id',
      );
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deletePostById(@Param('id') postId: string) {
    const isDeletePostById = await this.postService.deletePostById(postId);

    if (isDeletePostById) {
      return;
    } else {
      throw new NotFoundException(
        'post not found:andpoint-delete,url /post/id',
      );
    }
  }
}
