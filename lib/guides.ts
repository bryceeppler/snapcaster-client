// lib/guides.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const guideDirectory = path.join(process.cwd(), 'content/guides');

interface GuidePostFrontmatter {
  title: string;
  date: string;
  author: string;
  tags: string[];
  preview: string;
  image: string;
}

interface GuidePost {
  slug: string;
  data: GuidePostFrontmatter;
  content: string;
}

export function getAllGuidePosts(): GuidePost[] {
  const fileNames = fs.readdirSync(guideDirectory);
  const allPosts = fileNames.map((fileName): GuidePost => {
    const fullPath = path.join(guideDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);

    // Cast frontmatter data to our GuidePostFrontmatter type
    const frontmatter = data as GuidePostFrontmatter;

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

export function getGuidePostBySlug(slug: string): GuidePost {
  const fullPath = path.join(guideDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Cast frontmatter data to our GuidePostFrontmatter type
  const frontmatter = data as GuidePostFrontmatter;

  return {
    slug,
    data: frontmatter,
    content
  };
}
