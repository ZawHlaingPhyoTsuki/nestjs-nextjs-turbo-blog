import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  modal: ReactNode;
}>;

export default function PostsLayOut({ children, modal }: Props) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
