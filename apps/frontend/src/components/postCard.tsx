import { Post } from "@/lib/types/modelTypes";
import Image from "next/image";
import Link from "next/link";

type Props = Partial<Post>;

export default function PostCard({
  id,
  title,
  slug,
  thumbnail,
  content,
  createdAt,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video w-full">
        <Image
          src={thumbnail ?? "/no-image.png"}
          alt={title ?? "Post image"}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJ+wPfcfpLlAAAAABJRU5ErkJggg==" // Tiny base64 placeholder
          loading="lazy" // Lazy load offscreen images
          quality={75} // Good balance between size and quality
        />
      </div>
      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <h3 className="text-lg font-bold mt-2 sm:mt-4 break-words text-center text-gray-600">
          {title}
        </h3>
        <p className="mt-2 text-gray-500 text-sm">
          {new Date(createdAt ?? "").toLocaleDateString()}
        </p>
        <p className="mt-3 sm:mt-4 text-gray-700 break-words text-sm sm:text-base line-clamp-3">
          {content?.slice(0, 100)}...
        </p>
        <Link
          className="text-indigo-600 hover:underline mt-auto text-right block text-sm sm:text-base font-medium"
          href={`/blog/${slug}/${id}`}
        >
          Read more →
        </Link>
      </div>
    </div>
  );
}
