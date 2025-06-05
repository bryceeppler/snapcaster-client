'use server';

import { coreService } from '@/services/coreService';

export async function createStripeAccountLink(accountId: string) {
  return await coreService.createStripeAccountLink(accountId);
}

export async function getMerchant(merchantId: string) {
  return await coreService.getMerchant(merchantId);
}
