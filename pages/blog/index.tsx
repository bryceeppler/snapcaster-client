// pages/blog/index.tsx
import { GetStaticProps } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import MainLayout from '@/components/main-page-layout';
import BlogFeed from '@/components/blog-feed';

export type BlogPostPreview = {
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
        <BlogFeed posts={posts} />
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
