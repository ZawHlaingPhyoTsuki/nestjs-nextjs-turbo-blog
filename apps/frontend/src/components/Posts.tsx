// components/Posts.tsx

import PostCard from "./postCard";
import PostCardSkeleton from "./PostCardSkeleton";
import { Post } from "@/lib/types/modelTypes";
import PostPagination from "./PostPagination";

type Props = {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  isLoading?: boolean; // ← new prop
};

export default function Posts({
  posts,
  currentPage,
  totalPages,
  isLoading = false,
}: Props) {
  const showSkeletons = isLoading || !posts.length;

  return (
    <section className="container m-8 max-w-5xl mx-auto px-4 lg:px-0">
      <h2 className="text-5xl font-bold text-center text-gray-600 leading-tight">
        Latest Posts
      </h2>
      <div className="h-1 mx-auto bg-gradient-to-r from-sky-500 to-indigo-500 w-96 mb-9 rounded-t-md mt-5"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {showSkeletons
          ? Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))
          : posts.map((post) => <PostCard key={post.id} {...post} />)}
      </div>

      {!showSkeletons && (
        <PostPagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </section>
  );
}
