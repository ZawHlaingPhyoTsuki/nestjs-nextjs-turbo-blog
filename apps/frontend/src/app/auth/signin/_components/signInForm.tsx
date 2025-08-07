"use client";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/actions/auth";
import { useActionState, useState } from "react";

export default function SignInForm ()  {
  const [state, action] = useActionState(signIn, undefined);
  const [email, setEmail] = useState(state?.data?.email || "");
  const [password, setPassword] = useState(state?.data?.password || "");

  return (
    <form action={action} className="flex flex-col gap-2">
      {!!state?.message && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {!!state?.errors?.email && (
        <p className="text-red-500 text-sm">{state.errors.email}</p>
      )}

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {!!state?.errors?.password && (
        <p className="text-red-500 text-sm">{state.errors.password}</p>
      )}

      <SubmitButton>Sign In</SubmitButton>
    </form>
  );
};