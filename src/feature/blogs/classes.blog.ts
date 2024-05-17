import { BlogDocument } from './domainBlog';
import { ViewBlog } from './types-blog';

export class DtoBlog {
  createdAt: string;

  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public isMembership: boolean,
  ) {
    this.createdAt = new Date().toISOString();
  }

  static getViewModel(blog: BlogDocument): ViewBlog {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }
}
