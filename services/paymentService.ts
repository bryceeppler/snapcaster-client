import axiosInstance from '@/utils/axiosWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_URL;

export interface CheckoutSession {
  checkoutUrl: string;
}

export interface CustomerPortalSession {
  portalUrl: string;
}

export class PaymentService {
  async createCheckoutSession(
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    const response = await axiosInstance.post(
      `${BASE_URL}/createcheckoutsession`,
      {
        priceId,
        successUrl,
        cancelUrl
      }
    );
    return response.data;
  }

  async createCustomerPortalSession(
    returnUrl: string
  ): Promise<CustomerPortalSession> {
    const response = await axiosInstance.post(
      `${BASE_URL}/createportalsession`,
      {
        returnUrl
      }
    );
    return response.data;
  }
}

export const paymentService = new PaymentService();
