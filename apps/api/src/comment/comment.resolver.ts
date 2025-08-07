import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { CommentEntity } from './entities/comment.entity';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import { CreateCommentInput } from './dto/create-comment.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Resolver(() => CommentEntity)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => [CommentEntity])
  getPostComments(
    @Args('postId', { type: () => Int! }) postId: number,
    @Args('take', {
      type: () => Int,
      nullable: true,
      defaultValue: DEFAULT_PAGE_SIZE,
    })
    take: number,
    @Args('skip', { type: () => Int!, nullable: true, defaultValue: 0 })
    skip: number,
  ) {
    return this.commentService.findOneByPostId(postId, take, skip);
  }

  @Query(() => Int)
  postCommentCount(@Args('postId', { type: () => Int! }) postId: number) {
    return this.commentService.count(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentEntity)
  createComment(
    @Context() context,
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    const authorId = context.req.user.id;
    return this.commentService.create(createCommentInput, authorId);

  }
}
