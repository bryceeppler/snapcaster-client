import Link from 'next/link';
import type { BlogPostPreview } from '@/pages/blog';
type Props = {
  posts: BlogPostPreview[];
};

export default function BlogFeed({ posts }: Props) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link
          href={`/blog/${post.slug}`}
          key={post.slug}
          className="outlined-container mb-4 flex w-full max-w-2xl flex-col space-y-2 bg-background p-6 text-popover-foreground transition-colors hover:bg-popover"
        >
          <h2 className="line-clamp-1 text-2xl font-semibold">
            {post.data.title}
          </h2>
          <p className="text-sm text-muted-foreground">{post.data.date}</p>
          <ul className="flex flex-wrap gap-2">
            {post.data.tags.map((tag, index) => (
              <li
                key={index}
                className=" rounded border px-2 py-1 text-xs text-primary"
              >
                {tag}
              </li>
            ))}
          </ul>
          <div className="flex flex-grow"></div>
          <p className="line-clamp-4 text-left text-sm">{post.data.preview}</p>
        </Link>
      ))}
    </div>
  );
}
