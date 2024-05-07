import Link from 'next/link';

export default function BlogFeed(props: {
  pagetitle: string;
  pageDescription: string;
  blogs: {
    title: string;
    date: string;
    link: string;
    description: string;
    image?: string;
    imageAlt: string;
  }[];
}) {
  return (
    <section className="flex w-full justify-center py-6 md:py-12">
      <div className="container grid items-start gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tighter">
            {props.pagetitle}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            {props.pageDescription}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {props.blogs.map((blog, index) => (
            <Link
              href={blog.link}
              key={index}
              className="outlined-container flex w-full flex-col overflow-hidden p-4 text-left hover:cursor-pointer hover:border-zinc-500 hover:bg-zinc-900 md:gap-2 md:p-8"
            >
              {blog.image && (
                <>
                  <div className="relative h-64 w-full overflow-hidden rounded-lg">
                    {/* Image fills the wrapper */}
                    <img
                      src={blog.image}
                      alt={blog.imageAlt}
                      style={{
                        objectFit: 'cover',
                        flexShrink: '0',
                        // minWidth: '100%',
                        minHeight: '100%'
                      }}
                    />
                  </div>
                  <div className="p-2"></div>
                </>
              )}
              {/* TITLE + DATE */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="overflow-hidden overflow-ellipsis font-semibold tracking-tight">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {blog.date}
                  </p>
                </div>
              </div>
              {/* DESCRIPTION */}
              <div className="text-sm text-white">
                <div className="line-clamp-2">
                  <p className="">{blog.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
