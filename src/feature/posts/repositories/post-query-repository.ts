import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domains/domain-post';
import { PostViewDto } from '../dto/create-post-view-dto';
import { ViewPost } from '../types/views';

@Injectable()
export class PostQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async getPostById(postId: string): Promise<ViewPost | null> {
    const post = await this.postModel.findById(postId);

    if (post) {
      return PostViewDto.getViewModel(post);
    } else {
      return null;
    }
  }
}
