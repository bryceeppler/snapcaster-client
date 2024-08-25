// pages/guides/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllGuidePosts, getGuidePostBySlug } from '@/lib/guides';
import { remark } from 'remark';
import html from 'remark-html';

type GuidePostPageProps = {
  post: {
    title: string;
    date: string;
    contentHtml: string;
    tags: string[];
  };
};

const GuidePostPage: React.FC<GuidePostPageProps> = ({ post }) => {
  return (
    <div className="container flex flex-col items-center ">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <p>{post.date}</p>
      <ul className="mb-10 mt-6 flex flex-wrap gap-2">
        {post.tags.map((tag, index) => (
          <li
            key={index}
            className=" rounded border px-2 py-1 text-xs text-primary"
          >
            {tag}
          </li>
        ))}
      </ul>
      <div
        className="prose lg:prose-xl"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllGuidePosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = getGuidePostBySlug(params?.slug as string);
  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      post: {
        ...post.data,
        contentHtml
      }
    }
  };
};

export default GuidePostPage;
