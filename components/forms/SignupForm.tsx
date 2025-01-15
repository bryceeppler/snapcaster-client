import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Router from 'next/router';
import Link from 'next/link';
import { authService } from '@/services/authService';

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
  callToAction?: string;
};

export function SignupForm({
  onSuccess,
  showSignInLink = true,
  disableToast = false,
  inputClassName = '',
  labels = 'explicit',
  confirmPassword = true,
  callToAction = 'Sign Up'
}: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SignupFormData>();

  const router = Router;
  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    try {
      await authService.signup({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        newsletter: data.newsletter
      });

      if (!disableToast) {
        toast.success('Success! Welcome to Snapcaster 🙂');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Could not register user');
      }
      console.error('Signup error:', error);
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

      <Button type="submit">{callToAction}</Button>
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