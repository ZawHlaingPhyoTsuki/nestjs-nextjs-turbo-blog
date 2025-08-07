import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async likePost(userId: number, postId: number) {
    try {
      return !!(await this.prisma.like.create({
        data: {
          userId,
          postId,
        },
      }));
    } catch {
      throw new BadRequestException('You have already liked this post');
    }
  }

  async unlikePost(userId: number, postId: number) {
    try {
      await this.prisma.like.delete({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      });
      return true;
    } catch {
      throw new BadRequestException('You have not liked this post');
    }
  }

  async getPostLikesCount(postId: number) {
    return this.prisma.like.count({
      where: {
        postId,
      },
    });
  }

  async userLikedPost(userId: any, postId: number) {
    return !!(await this.prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    }));
  }
}
