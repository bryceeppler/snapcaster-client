import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  subscriptionType: z.enum(['monthly', 'quarterly'], {
    required_error: 'Please select a subscription type.'
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.'
  }),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  storeName: z.string().min(2, {
    message: 'Store name must be at least 2 characters.'
  }),
  notes: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface Tier3SignupFormProps {
  onSuccess?: () => void;
  initialPlan?: 'monthly' | 'quarterly';
}

export function Tier3SignupForm({
  onSuccess,
  initialPlan = 'quarterly'
}: Tier3SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subscriptionType: initialPlan,
      email: '',
      name: '',
      storeName: '',
      notes: ''
    }
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tier3-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      toast.success('Application submitted successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Subscription Type
        </label>
        <Controller
          control={control}
          name="subscriptionType"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select your subscription type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quarterly">
                  Quarterly ($300/month)
                </SelectItem>
                <SelectItem value="monthly">Monthly ($350/month)</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.subscriptionType && (
          <p className="mt-1 text-sm text-red-500">
            {errors.subscriptionType.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="your@email.com"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Your Name</label>
        <Input
          placeholder="John Smith"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Store Name</label>
        <Input
          placeholder="Your Store Name"
          {...register('storeName')}
          className={errors.storeName ? 'border-red-500' : ''}
        />
        {errors.storeName && (
          <p className="mt-1 text-sm text-red-500">
            {errors.storeName.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Additional Notes
        </label>
        <Textarea
          placeholder="Any additional information you'd like to share..."
          {...register('notes')}
          className={errors.notes ? 'border-red-500' : ''}
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-500">{errors.notes.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Application'
        )}
      </Button>
    </form>
  );
}
