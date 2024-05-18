import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument } from '../domains/domain-blog';
import { CreateBlogDto } from '../dto/create-blog-dto';
import { BlogRepository } from '../repositories/blog-repository';
import { CreateBlogInputModel } from '../types/models';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blob.name) private blogModel: Model<BlogDocument>,
    protected blogRepository: BlogRepository,
  ) {}

  async createBlog(
    createBlogInputModel: CreateBlogInputModel,
  ): Promise<string> {
    const isMembership = true;

    const dtoBlog: CreateBlogDto = new CreateBlogDto(
      createBlogInputModel.name,
      createBlogInputModel.description,
      createBlogInputModel.websiteUrl,
      isMembership,
    );

    const newBlog: BlogDocument = new this.blogModel(dtoBlog);

    const blog: BlogDocument = await this.blogRepository.save(newBlog);

    return blog._id.toString();
  }

  async deleteBlogById(blogId: string) {
    return this.blogRepository.deleteBlogById(blogId);
  }
}
