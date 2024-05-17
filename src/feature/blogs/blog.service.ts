import { Injectable } from '@nestjs/common';
import { CreateBlogInputModel, ViewBlog } from './types-blog';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument } from './domainBlog';
import { DtoBlog } from './classes.blog';
import { BlogRepository } from './blog.repository';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blob.name) private blogModel: Model<BlogDocument>,
    protected blogRepository: BlogRepository,
  ) {}

  async createBlog(createBlogInputModel: CreateBlogInputModel) {
    const isMembership = true;

    const dtoBlog: DtoBlog = new DtoBlog(
      createBlogInputModel.name,
      createBlogInputModel.description,
      createBlogInputModel.websiteUrl,
      isMembership,
    );

    const newBlog: BlogDocument = new this.blogModel(dtoBlog);

    const blog: BlogDocument = await this.blogRepository.createBlog(newBlog);

    const viewBlog: ViewBlog = DtoBlog.getViewModel(blog);

    return viewBlog;
  }
}
