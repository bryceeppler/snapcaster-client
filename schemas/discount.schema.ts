import { z } from 'zod';

import { DiscountType, type Discount } from '@/types/discounts';

/**
 * Schema for raw discount data from API (with string dates)
 */
export const rawDiscountSchema = z.object({
  id: z.number(),
  code: z.string(),
  discountAmount: z.number(),
  discountType: z.nativeEnum(DiscountType),
  vendorId: z.number(),
  vendorSlug: z.string(),
  startsAt: z.string().nullable(),
  expiresAt: z.string().nullable(),
  isActive: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

/**
 * Transform raw discount to parsed discount with Date objects
 * Returns a Discount type compatible with the existing interface
 */
export const transformDiscountDates = (
  discount: z.infer<typeof rawDiscountSchema>
): Discount => {
  // Destructure to exclude createdAt and updatedAt from spreading
  const { createdAt, updatedAt, ...restDiscount } = discount;
  
  const result: Discount = {
    ...restDiscount,
    startsAt: discount.startsAt ? new Date(discount.startsAt) : new Date(),
    expiresAt: discount.expiresAt ? new Date(discount.expiresAt) : null,
    isActive: discount.isActive
  };

  // Only add optional properties if they exist
  if (createdAt) {
    result.createdAt = new Date(createdAt);
  }
  if (updatedAt) {
    result.updatedAt = new Date(updatedAt);
  }

  return result;
};

/**
 * Schema for API response wrapper
 */
export const discountApiResponseSchema = z.object({
  data: z.array(rawDiscountSchema).default([])
});

/**
 * Parse and transform discount API response
 */
export const parseDiscountResponse = (response: unknown): Discount[] => {
  const parsed = discountApiResponseSchema.parse(response);
  return parsed.data.map(transformDiscountDates);
};

export type RawDiscount = z.infer<typeof rawDiscountSchema>;
