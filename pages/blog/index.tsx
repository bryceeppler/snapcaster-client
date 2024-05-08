// pages/blog/index.tsx
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog';

type BlogPostPreview = {
  slug: string;
  data: {
    title: string;
    date: string;
    tags: string[];
  };
};

type BlogIndexProps = {
  posts: BlogPostPreview[];
};

const BlogIndex: React.FC<BlogIndexProps> = ({ posts }) => {
  return (
    <div className="container">
      <h1 className="text-3xl font-bold">Blog</h1>
      {posts.map((post) => (
        <div key={post.slug} className="mb-4">
          <h2 className="text-2xl font-semibold">
            <Link href={`/blog/${post.slug}`}>{post.data.title}</Link>
          </h2>
          <p className="text-gray-500">{post.data.date}</p>
          <ul className="flex space-x-2">
            {post.data.tags.map((tag, index) => (
              <li key={index} className="rounded bg-blue-100 px-2 py-1">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
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
