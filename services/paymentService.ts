import axiosInstance from '@/utils/axiosWrapper';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CustomerPortalSession {
  portalUrl: string;
}

interface PaymentApiResponse<T> {
  status: string;
  data: T;
}

export interface CheckoutSession {
  url: string;
  successUrl: string;
  cancelUrl: string;
  sessionId: string;
  message: string;
}

export enum SubscriptionType {
  PRO = 'pro',
  TIER_3_MONTHLY = 'tier_3_monthly',
  TIER_3_QUARTERLY = 'tier_3_quarterly'
}

export class PaymentService {
  async createCheckoutSession(
    subscriptionType: SubscriptionType
  ): Promise<CheckoutSession> {
    const response = await axiosInstance.post<
      PaymentApiResponse<CheckoutSession>
    >(`${API_URL}/api/v1/payment/checkout-sessions`, {
      subscriptionType
    });
    return response.data.data;
  }
}

export const paymentService = new PaymentService();
