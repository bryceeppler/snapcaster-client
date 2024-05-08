// lib/blog.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogDirectory = path.join(process.cwd(), 'content/blog');

interface BlogPostFrontmatter {
  title: string;
  date: string;
  author: string;
  tags: string[];
  preview: string;
  image: string;
}

interface BlogPost {
  slug: string;
  data: BlogPostFrontmatter;
  content: string;
}

export function getAllBlogPosts(): BlogPost[] {
  const fileNames = fs.readdirSync(blogDirectory);
  const allPosts = fileNames.map((fileName): BlogPost => {
    const fullPath = path.join(blogDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);

    // Cast frontmatter data to our BlogPostFrontmatter type
    const frontmatter = data as BlogPostFrontmatter;

    // Combine the data with the slug (file name without .md extension)
    return {
      slug: fileName.replace(/\.md$/, ''),
      data: frontmatter,
      content
    };
  });

  // Sort posts by date
  return allPosts.sort((a, b) =>
    new Date(a.data.date) < new Date(b.data.date) ? 1 : -1
  );
}

export function getBlogPostBySlug(slug: string): BlogPost {
  const fullPath = path.join(blogDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Cast frontmatter data to our BlogPostFrontmatter type
  const frontmatter = data as BlogPostFrontmatter;

  return {
    slug,
    data: frontmatter,
    content
  };
}
