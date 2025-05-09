/**
 * Types for discount management
 */

/**
 * Enumeration of discount types
 */
export enum DiscountType {
  /**
   * Percentage-based discount
   */
  PERCENTAGE = 'PERCENTAGE',

  /**
   * Fixed amount discount
   */
  FIXED = 'FIXED'
}

/**
 * Represents a discount in the system
 */
export interface Discount {
  /**
   * Unique identifier for the discount
   */
  id: number;

  /**
   * The discount code users enter at checkout
   */
  code: string;

  /**
   * The amount of the discount (percentage or fixed amount)
   */
  discount_amount: number;

  /**
   * The type of discount (percentage or fixed amount)
   */
  discount_type: DiscountType;

  /**
   * ID of the vendor this discount belongs to
   */
  vendor_id: number;

  /**
   * Slug of the vendor this discount belongs to
   */
  vendor_slug: string;

  /**
   * Date when the discount becomes active
   */
  starts_at: string | Date;

  /**
   * Date when the discount expires (null for never expires)
   */
  expires_at: string | Date | null;

  /**
   * Whether the discount is currently active
   */
  is_active: boolean;

  /**
   * When the discount was created
   */
  created_at?: string | Date;

  /**
   * When the discount was last updated
   */
  updated_at?: string | Date;
}

/**
 * Values for discount creation/edit form
 */
export interface DiscountFormValues {
  /**
   * The discount code (will be automatically converted to uppercase)
   */
  code: string;

  /**
   * The percentage discount amount (1-100)
   */
  percentage: number;

  /**
   * Date when the discount becomes active
   */
  start_date: Date;

  /**
   * Date when the discount expires (null for never expires)
   */
  end_date: Date | null;

  /**
   * Whether the discount is currently active
   */
  is_active: boolean;

  /**
   * ID of the vendor this discount belongs to
   * Only required for admin users creating discounts
   */
  vendor_id?: number;
}

/**
 * Request payload for creating a new discount
 */
export interface CreateDiscountPayload {
  /**
   * The discount code
   */
  code: string;

  /**
   * The amount of the discount
   */
  discount_amount: number;

  /**
   * The type of discount
   */
  discount_type: DiscountType;

  /**
   * ID of the vendor this discount belongs to
   */
  vendor_id: number;

  /**
   * Date when the discount becomes active
   */
  starts_at: Date;

  /**
   * Date when the discount expires (null for never expires)
   */
  expires_at: Date | null;

  /**
   * Whether the discount is currently active
   */
  is_active: boolean;
}

// Alias for compatibility with vendorService
export type CreateDiscountRequest = CreateDiscountPayload;

/**
 * Request payload for updating an existing discount
 */
export interface UpdateDiscountPayload {
  /**
   * The ID of the discount to update
   */
  id: number;

  /**
   * The updated discount data
   * This is a partial to allow updating individual fields
   */
  data: Partial<Omit<CreateDiscountPayload, 'vendor_id'>>;
}

/**
 * Type for discount update request
 * This is used by the vendor service
 */
export type UpdateDiscountRequest = Partial<
  Omit<CreateDiscountPayload, 'vendor_id'>
>;
