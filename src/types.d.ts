import { Request } from 'express';
import { type IPost } from './models/Post.ts';

declare global {
  namespace Express {
    interface Request {
      post?: IPost;
      userId?: string;
      username?: string;
    }
  }
}