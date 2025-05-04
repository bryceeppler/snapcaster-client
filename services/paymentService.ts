import axiosInstance from '@/utils/axiosWrapper';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CustomerPortalSession {
  portalUrl: string;
}

interface PaymentApiResponse<T> {
  status: string;
  data: T;
}

interface CheckoutSession {
  url: string;
  successUrl: string;
  cancelUrl: string;
  sessionId: string;
  message: string;
}

export class PaymentService {
  async createCheckoutSession(): Promise<CheckoutSession> {
    const response = await axiosInstance.post<
      PaymentApiResponse<CheckoutSession>
    >(`${API_URL}/api/v1/payment/checkout-sessions`);
    return response.data.data;
  }
}

export const paymentService = new PaymentService();
