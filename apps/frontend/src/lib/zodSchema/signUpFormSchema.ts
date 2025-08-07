import z from "zod";

export const signUpFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(64, "Password must be at most 64 characters long")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      )
      .trim(),
  })
