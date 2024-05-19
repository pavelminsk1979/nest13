import { Injectable } from '@nestjs/common';
import { PostDocument } from '../domains/domain-post';

@Injectable()
export class PostRepository {
  async save(newPost: PostDocument) {
    return newPost.save();
  }
}