"use client";
// import DOMPurify from "dompurify";

type Props = {
  content: string;
  className?: string;
};

export default function SanitizedContent(props: Props) {
  // const cleanHtml = DOMPurify.sanitize(content);

  return (
    <div
      className={props.className}
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  );
}
