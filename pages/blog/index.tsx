// pages/blog/index.tsx
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog';
import MainLayout from '@/components/main-page-layout';

type BlogPostPreview = {
  slug: string;
  data: {
    title: string;
    date: string;
    tags: string[];
    preview: string;
    image: string;
  };
};

type BlogIndexProps = {
  posts: BlogPostPreview[];
};

const BlogIndex: React.FC<BlogIndexProps> = ({ posts }) => {
  return (
    <MainLayout>
      <div className="container flex flex-col items-center">
        <h1 className="mb-6 text-4xl font-bold">Blog</h1>
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.slug}
              className="outlined-container mb-4 w-full max-w-2xl space-y-2 bg-primary p-6 text-primary-foreground transition-colors hover:bg-primary/60"
            >
              <h2 className="text-2xl font-semibold">{post.data.title}</h2>
              <p className="text-secondary">{post.data.date}</p>
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
                className="outlined-container h-60 w-full object-cover"
              />
              <p className="line-clamp-5">{post.data.preview}</p>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllBlogPosts();
  return {
    props: {
      posts
    }
  };
};

export default BlogIndex;
