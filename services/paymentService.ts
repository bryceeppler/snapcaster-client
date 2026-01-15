import axiosInstance from '@/utils/axiosWrapper';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment`;

export interface CheckoutSession {
  url: string;
}

export interface CustomerPortalSession {
  url: string;
}

class PaymentService {
  async createCheckoutSession(): Promise<void> {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/createcheckoutsession`
      );
      if (response.status !== 200) throw new Error('Failed to create session');
      const data = await response.data;
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async createPortalSession(): Promise<void> {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/createportalsession`
      );
      if (response.status !== 200) throw new Error('Failed to create session');
      const data = await response.data;
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }

  async syncSubscription(): Promise<void> {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/sync`);
      if (response.status !== 200)
        throw new Error('Failed to sync subscription');
    } catch (error) {
      console.error('Error syncing subscription:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
