import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axiosInstance from '@/utils/axiosWrapper';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function createCheckoutSession() {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_PAYMENT_URL}/createcheckoutsession`
    );
    if (response.status !== 200) throw new Error('Failed to create session');
    const data = await response.data;
    console.log('Checkout session created:', data);
    window.location.href = data.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
  }
};

export async function createPortalSession(){
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_PAYMENT_URL}/createportalsession`
    );
    if (response.status !== 200) throw new Error('Failed to create session');
    const data = await response.data;
    console.log('Portal session created:', data);
    window.location.href = data.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
  }
};