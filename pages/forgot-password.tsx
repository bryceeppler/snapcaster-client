import MainLayout from '@/components/MainLayout';
import { type NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import useAuthStore from '@/stores/authStore';
import { toast } from "sonner";
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

type Props = {};

const ForgotPassword: NextPage<Props> = () => {

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: ''
    }
  });

  type Submision = {
    email: string;
  };
  const onSubmit = async (data : Submision) => {
    const { email } = data;
    const endpoint = process.env.NEXT_PUBLIC_USER_URL + '/forgot-password';

    try {
      const response = await axios.post(endpoint, { email });

      if (!response.status) {
        toast.error('Invalid response from server.');
        throw new Error('Something went wrong with the login process');
      } else {
        if (response.status !== 200) {
          throw new Error('Something went wrong with the login process');
        }
        toast.success('Check your email for a password reset link');
      }
    } catch (error) {
        toast.error('An error occurred during login');
        console.error(error);
    }
  };

  return (
    <>
      <ForgotPasswordHead />
      <MainLayout>
        <div className="w-full max-w-md flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="container grid max-[1fr_900px] md:px-6 items-start gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Forgot Password</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    Enter your email to receive a password reset link.
                </p>
              </div>
              <form className="grid gap-4 md:gap-4" onSubmit={handleSubmit(onSubmit)}>
                <input
                  {...register('email', { required: 'Email is required', pattern: /^\S+@\S+\.\S+$/ })}
                  type="text"
                  className="block w-full input-dark px-4 py-2"
                  placeholder="Email"
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                {errors.email?.type === 'pattern' && <p className="text-red-500">Invalid email</p>}
                <Button type="submit" className="w-full">Send reset link</Button> 
              </form>
              <a href="/signin">Know your password? Sign in.</a>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default ForgotPassword;

const ForgotPasswordHead = () => {
  return (
    <Head>
      <title>Forgot Password</title>
      <meta
        name="description"
        content="Search Magic the Gathering cards across Canada"
      />
      <meta
        property="og:title"
        content={`Snapcaster - Search Magic the Gathering cards across Canada`}
      />
      <meta
        property="og:description"
        content={`Find Magic the Gathering singles and sealed product using in Snapcaster. Search your favourite Canadian stores.`}
      />
      <meta property="og:url" content={`https://snapcaster.ca`} />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
