export interface Discount {
  id: number;
  vendor_id: number;
  code: string;
  discount_amount: number;
  is_active: boolean;
  starts_at: Date;
  expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
  discount_type: DiscountType;
  vendor_slug: string;
}

export interface CreateDiscountRequest {
  vendor_id: number;
  code: string;
  discount_type: DiscountType;
  discount_amount: number;
  starts_at: Date;
  expires_at: Date | null;
}

export interface UpdateDiscountRequest {
  code?: string;
  discount_type?: DiscountType;
  discount_amount?: number;
  starts_at?: Date;
  expires_at?: Date | null;
  is_active?: boolean;
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED'
}
