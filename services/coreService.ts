import type { CartItem } from '@/app/marketplace/page';
import axiosInstance from '@/utils/axiosWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class CoreService {
  async createStripeAccount(): Promise<string> {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/core/merchants/account`
    );
    return response.data.account;
  }

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
}

export const coreService = new CoreService();
