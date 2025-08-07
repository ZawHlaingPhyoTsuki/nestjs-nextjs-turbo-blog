"use client";

import { saveNewPost } from "@/lib/actions/postActions";
import { useActionState, useState } from "react";
import UpsertPostForm from "./upsertPostForm";
import { PostFormState } from "@/lib/types/formState";
import { toast } from "sonner";

export default function CreatePostContainer() {
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (prevState: PostFormState, formData: FormData) => {
    const result = await saveNewPost(prevState, formData);

    if (result?.message) {
      if (result.ok) {
        toast.success(result.message);
        setImageUrl("");
      } else {
        toast.error(result.message);
      }
      return result;
    }
  };

  const [state, action] = useActionState(handleSubmit, undefined);

  return (
    <UpsertPostForm
      state={state}
      formAction={action}
      imageUrl={imageUrl}
      setImageUrl={setImageUrl}
    />
  );
}
