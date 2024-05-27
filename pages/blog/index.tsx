// pages/blog/index.tsx
import { GetStaticProps } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import MainLayout from '@/components/main-page-layout';
import BlogFeed from '@/components/blog-feed';
import PageTitle from '@/components/ui/page-title';
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
      <div className="flex w-full flex-col justify-center gap-8 text-center">
        <PageTitle
          title="Blog"
          subtitle="Stay up to date with recent changes and annoucements."
        />
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
