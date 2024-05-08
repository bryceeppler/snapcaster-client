// pages/guides/index.tsx
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getAllGuidePosts } from '@/lib/guides';
import MainLayout from '@/components/main-page-layout';

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
    <MainLayout>
      <div className="container flex flex-col items-center">
        <h1 className="mb-6 text-4xl font-bold">Guides</h1>
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Link
              href={`/guides/${post.slug}`}
              key={post.slug}
              className="outlined-container mb-4 w-full max-w-2xl space-y-2 bg-primary p-6 text-primary-foreground transition-colors hover:bg-primary/60"
            >
              <h2 className="text-2xl font-semibold">{post.data.title}</h2>
              <p className="text-secondary">{post.data.date}</p>
              <p className="line-clamp-5">{post.data.preview}</p>

              <ul className="flex flex-wrap gap-2">
                {post.data.tags.map((tag, index) => (
                  <li key={index} className="rounded bg-pink-500 px-2 py-1">
                    {tag}
                  </li>
                ))}
              </ul>
              <img
                src={post.data.image}
                alt={post.data.title}
                className="outlined-container mx-auto max-h-64 w-fit"
              />
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
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
