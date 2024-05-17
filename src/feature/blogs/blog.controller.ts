import { Body, Controller, Post } from '@nestjs/common';
import { CreateBlogInputModel } from './types-blog';
import { BlogService } from './blog.service';

@Controller('blogs')
export class BlogController {
  constructor(protected blogService: BlogService) {}
  @Post()
  async createBlog(@Body() createBlogInputModel: CreateBlogInputModel) {
    const newBlog = await this.blogService.createBlog(createBlogInputModel);
    return newBlog;
  }
}
