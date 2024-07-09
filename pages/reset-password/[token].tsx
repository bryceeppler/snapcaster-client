import { type NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';

type Props = {};

const ResetPassword: NextPage<Props> = () => {
  const router = useRouter();
  const { token } = router.query;
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
          throw new Error(
            'Something went wrong with the password reset process'
          );
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
      <section className="flex w-full justify-center py-6 md:py-12">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Reset the password for your Snapcaster account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 md:gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  {...register('confirmPassword', {
                    validate: (value) =>
                      value === password || 'The passwords do not match'
                  })}
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
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
