import React from 'react';

type Props = {
  title: string;
};

const PageTitle = ({ title }: Props) => {
  return (
    <h1 className="py-2 text-center text-4xl font-bold tracking-tighter md:pt-8">
      {title}
    </h1>
  );
};

export default PageTitle;
