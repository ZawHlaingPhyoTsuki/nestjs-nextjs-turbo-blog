"use server";

import { authFetchGraphQL, fetchGraphQl } from "../fetchGraphQl";
import { CREATE_COMMENT_MUTATION, GET_POST_COMMENTS } from "../gqlQueries";
import { print } from "graphql";
import { CommentEntity } from "../types/modelTypes";
import { CreateCommentFormState } from "../types/formState";
import { CommentFormSchema } from "../zodSchema/commentFormSchema";

export async function getPostComments({
  postId,
  skip,
  take,
}: {
  postId: number;
  skip: number;
  take: number;
}) {
  const data = await fetchGraphQl(print(GET_POST_COMMENTS), {
    postId,
    skip,
    take,
  });

  return {
    comments: data.getPostComments as CommentEntity[],
    count: data.postCommentCount as number,
  };
}

export async function getPostCommentsInfinite({
  postId,
  skip,
  take,
}: {
  postId: number;
  skip: number;
  take: number;
}) {
  const data = await fetchGraphQl(print(GET_POST_COMMENTS), {
    postId,
    skip,
    take,
  });

  return {
    comments: data.getPostComments as CommentEntity[],
    totalComments: data.postCommentCount as number,
  };
}

export async function saveComment(
  state: CreateCommentFormState,
  formData: FormData
) {
  const validatedFields = CommentFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      data: Object.fromEntries(formData.entries()),
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = await authFetchGraphQL(print(CREATE_COMMENT_MUTATION), {
    input: {
      ...validatedFields.data,
    },
  });

  if (data) {
    return {
      message: "Success! Your comment has been added.",
      ok: true,
      open: false,
    };
  }

  return {
    message: "Oops! Something went wrong!",
    ok: false,
    open: true,
    data: Object.fromEntries(formData.entries()),
  };
}
