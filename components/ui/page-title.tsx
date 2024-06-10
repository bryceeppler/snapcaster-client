import React from 'react';

type Props = {
  title: string;
  subtitle?: string;
};

const PageTitle = ({ title, subtitle }: Props) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
        {subtitle}
      </p>
    </div>
  );
};

export default PageTitle;
