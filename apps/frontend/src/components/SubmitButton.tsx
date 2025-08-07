"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

export default function SubmitButton({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} {...props}>
      {pending ? <span className="animate-pulse">Submitting</span> : children}
    </Button>
  );
}
