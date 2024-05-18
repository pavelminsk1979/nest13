import { Injectable } from '@nestjs/common';
import { BlogDocument } from '../domains/domain-blog';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blob.name) private blogModel: Model<BlogDocument>) {}

  async save(newBlog: BlogDocument) {
    return newBlog.save();
  }

  async deleteBlogById(blogId: string) {
    const result = await this.blogModel.deleteOne({
      _id: new Types.ObjectId(blogId),
    });

    return !!result.deletedCount;
  }
}
