import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Like } from './entities/like.entity';
import { LikeService } from './like.service';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  // Mutation to like a post
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async likePost(
    @Context() context,
    @Args('postId', { type: () => Int! }) postId: number,
  ) {
    const userId = context.req.user.id;
    return await this.likeService.likePost(userId, postId);
  }

  // Mutation to unlike a post
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async unlikePost(
    @Context() context,
    @Args('postId', { type: () => Int! }) postId: number,
  ) {
    const userId = context.req.user.id;
    return await this.likeService.unlikePost(userId, postId);
  }

  // Query to get the number of likes for a post
  @Query(() => Int)
  async postLikesCount(@Args('postId', { type: () => Int! }) postId: number) {
    return await this.likeService.getPostLikesCount(postId);
  }

  // Query to check if a user has liked a post
  @UseGuards(JwtAuthGuard)
  @Query(() => Boolean)
  async userLikedPost(
    @Context() context,
    @Args('postId', { type: () => Int! }) postId: number,
  ) {
    const userId = context.req.user.id;
    return await this.likeService.userLikedPost(userId, postId);
  }
}
