import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import Router from 'next/router';
import Link from 'next/link';

type SignupFormData = {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
  newsletter: boolean;
};

type SignupFormProps = {
  onSuccess?: () => void;
  showSignInLink?: boolean;
  disableToast?: boolean;
  inputClassName?: string;
  labels?: 'implicit' | 'explicit';
  confirmPassword?: boolean;
};

export function SignupForm({ onSuccess, showSignInLink = true, disableToast = false, inputClassName = '', labels = 'explicit', confirmPassword = true }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SignupFormData>();

  const router = Router;
  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    const { email, password, fullName, newsletter } = data;
    const endpoint = `${process.env.NEXT_PUBLIC_USER_URL}/register`;

    try {
      const response = await axios.post(endpoint, {
        email,
        password,
        fullName,
        newsletter
      });
      if (response.status !== 200) {
        throw new Error('Something went wrong with the registration process');
      }
      if (!disableToast) {
        toast.success('Registration successful! You can now sign in.');
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/signin');
      }
    } catch (error: any) {
      toast.error('Could not register user');
    }
  };

  return (
    <form className="grid gap-4 md:gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        {labels === 'explicit' && <Label htmlFor="fullName">Name</Label>}
        <Input
          type="text"
          {...register('fullName', {
            required: 'A name is required'
          })}
          className={`${errors.fullName ? 'border-red-500' : ''} ${inputClassName}`}
          placeholder={labels === 'implicit' ? 'Name' : 'Al Dente'}
        />
        {errors.fullName && (
          <p className="text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        {labels === 'explicit' && <Label htmlFor="email">Email</Label>}
        <Input
          type="email"
          {...register('email', {
            required: 'An email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          className={`${errors.email ? 'border-red-500' : ''} ${inputClassName}`}
          placeholder={labels === 'implicit' ? 'Email' : 'aldente@pasta.com'}
        />
        {errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        {labels === 'explicit' && <Label htmlFor="password">Password</Label>}
        <Input
          type="password"
          {...register('password', {
            required: 'A password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
          className={`${errors.password ? 'border-red-500' : ''} ${inputClassName}`}
          placeholder={labels === 'implicit' ? 'Password' : ''}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      {confirmPassword && (
        <div className="grid gap-2">
          {labels === 'explicit' && <Label htmlFor="confirmPassword">Confirm Password</Label>}
          <Input
          type="password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: value =>
              value === password || 'The passwords do not match'
          })}
          className={`${errors.confirmPassword ? 'border-red-500' : ''} ${inputClassName}`}
          placeholder={labels === 'implicit' ? 'Confirm Password' : ''}
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="newsletter"
          defaultChecked={true}
          {...register('newsletter')}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="newsletter" className="text-sm text-muted-foreground">
          Subscribe to our newsletter
        </Label>
      </div>

      <Button type="submit">Sign Up</Button>
      {showSignInLink && (
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/signin" className="underline">
            Sign in.
          </Link>
        </div>
      )}
    </form>
  );
} 