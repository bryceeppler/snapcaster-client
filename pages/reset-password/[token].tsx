import MainLayout from '@/components/MainLayout';
import { type NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import { toast } from "sonner";
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

type Props = {};

const ResetPassword: NextPage<Props> = () => {
  const router = useRouter();
  const { token } = router.query; // Access the token from the URL
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');
  type Submision = {
    password: string;
    confirmPassword: string;
  };
  const onSubmit = async (data: Submision) => {
    const { password } = data;
    const endpoint = `${process.env.NEXT_PUBLIC_USER_URL}/reset-password`;

    try {
      const response = await axios.post(endpoint, { token, password });

      if (!response.status) {
        toast.error('Invalid response from server.');
        throw new Error('Something went wrong with the password reset process');
      } else {
        if (response.status !== 200) {
          throw new Error('Something went wrong with the password reset process');
        }
        toast.success('Your password has been reset! You can now sign in.');
        router.push('/signin');
      }
    } catch (error) {
      toast.error('An error occurred during password reset');
      console.error(error);
    }
  };

  return (
    <>
      <ResetPasswordHead />
      <MainLayout>
        <div className="w-full max-w-md flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="container grid max-[1fr_900px] md:px-6 items-start gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">
                  Reset Password
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Reset your password.
                </p>
              </div>
              <form
                className="grid gap-4 md:gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  className={`block input-dark w-full px-4 py-2`}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
                <input
                  type="password"
                  {...register('confirmPassword', {
                    validate: (value) =>
                      value === password || 'The passwords do not match'
                  })}
                  className={`block input-dark w-full px-4 py-2`}
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
                <button
                  type="submit"
                  className="mt-2 p-2 btn-white"
                >
                    Reset Password 
                </button>
              </form>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default ResetPassword;

const ResetPasswordHead = () => {
  return (
    <Head>
      <title>Reset Password</title>
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
