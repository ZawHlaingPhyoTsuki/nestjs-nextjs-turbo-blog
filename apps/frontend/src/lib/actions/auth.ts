"use server";

import { print } from "graphql";
import { treeifyError } from "zod";
import { loginFormSchema } from "../zodSchema/loginFormSchema";
import { signUpFormSchema } from "../zodSchema/signUpFormSchema";
import { fetchGraphQl } from "../fetchGraphQl";
import { CREATE_USER_MUTATION, SIGN_IN_MUTATION } from "../gqlQueries";
import { redirect } from "next/navigation";
import { SignInFormState, SignUpFormState } from "../types/formState";
import { revalidatePath } from "next/cache";
import { createSession } from "../session";

export async function signUp(
  state: SignUpFormState | undefined,
  formData?: FormData
): Promise<SignUpFormState> {
  // Handle case where formData is missing
  if (!formData) {
    return {
      message: "Form data is required",
      data: state?.data || {},
      errors: state?.errors,
    };
  }

  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = signUpFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const treeified = treeifyError(validatedFields.error);

    return {
      message: "Validation failed",
      data: rawData,
      errors: {
        name: treeified.properties?.name?.errors,
        email: treeified.properties?.email?.errors,
        password: treeified.properties?.password?.errors,
      },
    };
  }

  const data = await fetchGraphQl(print(CREATE_USER_MUTATION), {
    input: {
      ...validatedFields.data,
    },
  });

  if (data.errors) {
    return {
      data: validatedFields.data,
      message: "Something went wrong",
    };
  }

  redirect("/auth/signin");
}

export async function signIn(
  state: SignInFormState | undefined,
  formData?: FormData
): Promise<SignInFormState> {
  // Handle case where formData is missing

  if (!formData) {
    return {
      message: "Form data is required",
      data: state?.data || {},
      errors: state?.errors,
    };
  }

  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = loginFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const treeified = treeifyError(validatedFields.error);

    return {
      data: rawData,
      errors: {
        email: treeified.properties?.email?.errors,
        password: treeified.properties?.password?.errors,
      },
    };
  }

  const data = await fetchGraphQl(print(SIGN_IN_MUTATION), {
    input: {
      ...validatedFields.data,
    },
  });

  if (data.errors) {
    return {
      data: rawData,
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  await createSession({
    user: {
      id: data.signIn.id,
      name: data.signIn.name,
      avatar: data.signIn.avatar,
    },
    accessToken: data.signIn.accessToken,
  });

  revalidatePath("/");
  redirect("/");
}
