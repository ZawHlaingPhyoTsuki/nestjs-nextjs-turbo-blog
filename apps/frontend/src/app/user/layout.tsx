import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default function UserLayout({ children }: Props) {
  return (
    <div className="mt-24 flex flex-col justify-center items-center">
      {children}
    </div>
  );
}
