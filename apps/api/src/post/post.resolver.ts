import { Resolver, Query, Context, Args, Int, Mutation } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  // query to get all posts
  // @UseGuards(JwtAuthGuard)
  @Query(() => [Post], { name: 'posts' })
  findAll(
    @Args('skip', { nullable: true }) skip?: number,
    @Args('take', { nullable: true }) take?: number,
  ) {
    return this.postService.findAll({ skip, take });
  }

  // query to get the count of posts
  @Query(() => Int, { name: 'postCount' })
  count() {
    return this.postService.count();
  }

  // query to get a single post by ID
  @Query(() => Post)
  getPostById(@Args('id', { type: () => Int }) id: number) {
    return this.postService.findOne(id);
  }

  // query to get logined user's posts
  @UseGuards(JwtAuthGuard)
  @Query(() => [Post])
  getUserPosts(
    @Context() context,
    @Args('skip', { nullable: true, type: () => Int }) skip?: number,
    @Args('take', { nullable: true, type: () => Int }) take?: number,
  ) {
    const userId = context.req.user.id;
    return this.postService.findByUserId({
      userId,
      skip: skip ?? 0,
      take: take ?? DEFAULT_PAGE_SIZE,
    });
  }

  // query to get logined user's post count
  @UseGuards(JwtAuthGuard)
  @Query(() => Int)
  userPostCount(@Context() context) {
    const userId = context.req.user.id;
    return this.postService.countByUserId(userId);
  }

  // mutation to create a post
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  createPost(
    @Context() context,
    @Args('createPostInput') createPostInput: CreatePostInput,
  ) {
    const authorId = context.req.user.id;
    return this.postService.create(createPostInput, authorId);
  }

  // mutaion to update a post
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  updatePost(
    @Context() context,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ) {
    const userId = context.req.user.id;

    return this.postService.update(updatePostInput, userId);
  }

  // mutation to delete a post
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  deletePost(
    @Context() context,
    @Args('postId', { type: () => Int }) postId: number,
  ) {
    const userId = context.req.user.id;
    return this.postService.delete(postId, userId);
  }
}
