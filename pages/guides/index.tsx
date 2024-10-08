// pages/guides/index.tsx
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getAllGuidePosts } from '@/lib/guides';

type GuidePostPreview = {
  slug: string;
  data: {
    title: string;
    date: string;
    tags: string[];
    preview: string;
    image: string;
  };
};

type GuideIndexProps = {
  posts: GuidePostPreview[];
};

const GuideIndex: React.FC<GuideIndexProps> = ({ posts }) => {
  return (
    <div className="container flex flex-col items-center">
      <h1 className="mb-6 text-4xl font-bold">Guides</h1>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            href={`/guides/${post.slug}`}
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
                  className=" rounded-lg border px-2 py-1 text-xs text-primary"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <div className="flex flex-grow"></div>
            <img
              src={post.data.image}
              alt={post.data.title}
              className="outlined-container mx-auto max-h-64 w-auto"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllGuidePosts();
  return {
    props: {
      posts
    }
  };
};

export default GuideIndex;
