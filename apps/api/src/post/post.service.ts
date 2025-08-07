import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    skip = 0,
    take = DEFAULT_PAGE_SIZE,
  }: {
    skip?: number;
    take?: number;
  }) {
    return await this.prisma.post.findMany({
      skip,
      take,
    });
  }

  async count() {
    return await this.prisma.post.count();
  }

  async findOne(id: number) {
    return await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        tags: true,
      },
    });
  }

  async findByUserId({
    userId,
    skip,
    take,
  }: {
    userId: number;
    skip: number;
    take: number;
  }) {
    return await this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        published: true,
        slug: true,
        title: true,
        thumbnail: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      skip,
      take,
    });
  }

  async countByUserId(userId: number) {
    return await this.prisma.post.count({
      where: { authorId: userId },
    });
  }

  async create(createPostInput: CreatePostInput, authorId: number) {
    return await this.prisma.post.create({
      data: {
        ...createPostInput,
        author: {
          connect: {
            id: authorId,
          },
        },
        tags: {
          connectOrCreate: createPostInput.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });
  }

  async update(updatePostInput: UpdatePostInput, userId: number) {
    const authorIdMatched = await this.prisma.post.findUnique({
      where: {
        id: updatePostInput.postId,
        authorId: userId,
      },
    });

    if (!authorIdMatched) throw new UnauthorizedException();

    // extract postId from Input
    const { postId, ...data } = updatePostInput;

    return await this.prisma.post.update({
      where: {
        id: updatePostInput.postId,
      },
      data: {
        ...data,
        tags: {
          set: [],
          connectOrCreate: updatePostInput.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });
  }

  async delete(postId: number, userId: number) {
    const authorIdMatched = await this.prisma.post.findUnique({
      where: { id: postId, authorId: userId },
    });

    if (!authorIdMatched) throw new UnauthorizedException();

    const result = await this.prisma.post.delete({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    return !!result;
  }
}
