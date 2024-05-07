import React from 'react';
import MainLayout from '@/components/main-page-layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PageTitle from './ui/page-title';
type Props = {
  title: string;
  message: string;
};

const LoginRequired = ({ title, message }: Props) => {
  return (
    <MainLayout>
      <div className="container">
        <PageTitle title={title} />
        <div className="outlined-container mx-auto grid max-w-md gap-4 p-8 md:gap-4">
          <p className="text-left">{message}</p>
          <Link href="/signin">
            <Button className="w-full">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="w-full">Sign up</Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginRequired;
