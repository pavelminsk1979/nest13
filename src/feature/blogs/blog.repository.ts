import { Injectable } from '@nestjs/common';
import { BlogDocument } from './domainBlog';

@Injectable()
export class BlogRepository {
  async createBlog(newBlog: BlogDocument) {
    return newBlog.save();
  }
}
