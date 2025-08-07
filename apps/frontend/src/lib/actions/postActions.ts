"use server";

import { print } from "graphql";
import { authFetchGraphQL, fetchGraphQl } from "../fetchGraphQl";
import {
  CREATE_POST_MUTATION,
  DELETE_POST_MUTATION,
  GET_POST_BY_ID,
  GET_POSTS,
  GET_USER_POSTS,
  UPDATE_POST_MUTATION,
} from "../gqlQueries";
import { Post } from "../types/modelTypes";
import { transformTakeSkip } from "../helpers";
import { PostFormState } from "../types/formState";
import { PostFormSchema } from "../zodSchema/postFormSchema";
import { uploadThumbnail } from "../upload";

export const fetchPosts = async ({
  page,
  pageSize,
}: {
  page?: number;
  pageSize?: number;
}) => {
  const { skip, take } = transformTakeSkip({ page, pageSize });

  const data = await fetchGraphQl(print(GET_POSTS), {
    skip,
    take,
  });

  return {
    posts: data.posts as Post[],
    totalPosts: data.postCount as number,
  };
};

export const fetchPostById = async (id: number) => {
  const data = await fetchGraphQl(print(GET_POST_BY_ID), { id });

  return data.getPostById as Post;
};

export const fetchUserPosts = async ({
  page,
  pageSize,
}: {
  page?: number;
  pageSize?: number;
}) => {
  const { skip, take } = transformTakeSkip({ page, pageSize });

  const data = await authFetchGraphQL(print(GET_USER_POSTS), {
    skip,
    take,
  });

  return {
    posts: data.getUserPosts as Post[],
    totalPosts: data.userPostCount as number,
  };
};

export const saveNewPost = async (
  state: PostFormState,
  formData: FormData
): Promise<PostFormState> => {
  const validatedFields = PostFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success)
    return {
      data: Object.fromEntries(formData.entries()),
      errors: validatedFields.error.flatten().fieldErrors,
    };

  // Upload Thumbnail to supabaase

  let thumbnailUrl = "";

  if (validatedFields.data.thumbnail) {
    thumbnailUrl = await uploadThumbnail(validatedFields.data.thumbnail);
  }

  const data = await authFetchGraphQL(print(CREATE_POST_MUTATION), {
    input: {
      ...validatedFields.data,
      thumbnail: thumbnailUrl,
    },
  });

  if (data)
    return {
      message: "Success! Your post has been saved.",
      ok: true,
    };

  return {
    data: Object.fromEntries(formData.entries()),
    message: "Oops! Something went wrong!",
    ok: false,
  };
};

export const updatePost = async (
  state: PostFormState,
  formData: FormData
): Promise<PostFormState> => {
  const validatedFields = PostFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success)
    return {
      data: Object.fromEntries(formData.entries()),
      errors: validatedFields.error.flatten().fieldErrors,
    };

  const { thumbnail, ...inputs } = validatedFields.data;

  let thumbnailUrl = "";

  if (thumbnail) {
    thumbnailUrl = await uploadThumbnail(thumbnail);
  }

  const data = await authFetchGraphQL(print(UPDATE_POST_MUTATION), {
    input: {
      ...inputs,
      ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
    },
  });

  if (data)
    return {
      message: "Success! The Post Updated",
      ok: true,
    };

  return {
    data: Object.fromEntries(formData.entries()),
    message: "Oops! Something went wrong!",
    ok: false,
  };
};

export const deletePost = async (postId: number) => {
  const data = await authFetchGraphQL(print(DELETE_POST_MUTATION), {
    postId,
  });

  return data.deletePost
};
