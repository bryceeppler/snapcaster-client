'use client';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { coreService } from '@/services/coreService';

const businessTypeEnum = z.enum([
  'sole_proprietorship',
  'partnership',
  'corporation',
  'cooperative'
]);

const provinceEnum = z.enum([
  'AB',
  'BC',
  'MB',
  'NB',
  'NL',
  'NS',
  'NT',
  'NU',
  'ON',
  'PE',
  'QC',
  'SK',
  'YT'
]);

export const merchantOnboardingFormSchema = z.object({
  accountEmail: z.string().email(),
  businessEmail: z.string().email(),
  businessName: z.string().min(3),
  legalBusinessName: z.string().min(3),
  businessType: businessTypeEnum,
  businessNumber: z.string().min(9),
  gstHstNumber: z.string().min(13),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  phone: z.string().min(10),
  websiteUrl: z.string().url(),
  description: z.string().min(10),
  addressLine1: z.string().min(3),
  addressLine2: z.string().min(3).optional(),
  city: z.string().min(3),
  province: provinceEnum,
  postalCode: z
    .string()
    .regex(
      /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/,
      'Invalid Canadian postal code format (e.g., A1A 1A1)'
    ),
  country: z.literal('CA')
});

function MerchantOnboardingForm() {
  const accountEmail = 'eppler97@gmail.com';
  const form = useForm<z.infer<typeof merchantOnboardingFormSchema>>({
    resolver: zodResolver(merchantOnboardingFormSchema),
    defaultValues: {
      accountEmail: accountEmail,
      businessEmail: '',
      businessName: '',
      legalBusinessName: '',
      businessType: 'sole_proprietorship',
      businessNumber: '',
      gstHstNumber: '',
      firstName: '',
      lastName: '',
      phone: '',
      websiteUrl: '',
      description: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: 'AB',
      postalCode: '',
      country: 'CA'
    }
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function onSubmit(
    values: z.infer<typeof merchantOnboardingFormSchema>
  ) {
    setLoading(true);
    await coreService.createMerchant(values);
    router.push('/account/marketplace/merchant/dashboard');
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="accountEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Snapcaster Account Email</FormLabel>
              <FormControl>
                <Input {...field} disabled value={accountEmail} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is the email you will use to login to your Snapcaster
                account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Email</FormLabel>
              <FormControl>
                <Input placeholder="Business Email" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is your primary business email, used for receiving payouts
                and business communications.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Business Name" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is how customers will see your business name.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="legalBusinessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legal Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Legal Business Name" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is the legal name of your business.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Business Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypeEnum.options.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is the type of business you are.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Number</FormLabel>
              <FormControl>
                <Input placeholder="Business Number" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>This is your business number.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gstHstNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST/HST Number</FormLabel>
              <FormControl>
                <Input placeholder="GST/HST Number" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>This is your GST/HST number.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Your primary business phone number.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input placeholder="Website URL" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Your business website URL.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is your business description. This will be displayed on
                your business profile.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input placeholder="Address Line 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input placeholder="Address Line 2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinceEnum.options.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="Postal Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </Form>
  );
}

export default MerchantOnboardingForm;
