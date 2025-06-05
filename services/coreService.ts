import type { z } from 'zod';

import type { CartItem } from '@/app/marketplace/page';
import type { merchantOnboardingFormSchema } from '@/components/forms/MerchantOnboardingForm';
import axiosInstance from '@/utils/axiosWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class CoreService {
  async createStripeAccountLink(accountId: string): Promise<void> {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/core/merchants/account_link`,
      {
        stripeAccountId: accountId
      }
    );
    window.location.href = response.data.url;
  }

  async createCheckoutSession(items: CartItem[]): Promise<void> {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/core/cart/create-checkout-session`,
      { items }
    );
    window.location.href = response.data.url;
  }

  async createMerchant(values: z.infer<typeof merchantOnboardingFormSchema>) {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/core/merchants`,
      values
    );
    return response.data;
  }

  async getMerchant(merchantId: string) {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/core/merchants/${merchantId}`
    );
    return response.data;
  }
}

export const coreService = new CoreService();
