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
  discountAmount: number;

  /**
   * The type of discount (percentage or fixed amount)
   */
  discountType: DiscountType;

  /**
   * ID of the vendor this discount belongs to
   */
  vendorId: number;

  /**
   * Slug of the vendor this discount belongs to
   */
  vendorSlug: string;

  /**
   * Date when the discount becomes active
   */
  startsAt: string | Date;

  /**
   * Date when the discount expires (null for never expires)
   */
  expiresAt: string | Date | null;

  /**
   * Whether the discount is currently active
   */
  isActive: boolean;

  /**
   * When the discount was created
   */
  createdAt?: string | Date;

  /**
   * When the discount was last updated
   */
  updatedAt?: string | Date;
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
  startDate: Date;

  /**
   * Date when the discount expires (null for never expires)
   */
  endDate: Date | null;

  /**
   * Whether the discount is currently active
   */
  isActive: boolean;

  /**
   * ID of the vendor this discount belongs to
   * Only required for admin users creating discounts
   */
  vendorId?: number;
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
  discountAmount: number;

  /**
   * The type of discount
   */
  discountType: DiscountType;

  /**
   * ID of the vendor this discount belongs to
   */
  vendorId: number;

  /**
   * Date when the discount becomes active
   */
  startsAt: Date;

  /**
   * Date when the discount expires (null for never expires)
   */
  expiresAt: Date | null;

  /**
   * Whether the discount is currently active
   */
  isActive: boolean;
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
  data: Partial<Omit<CreateDiscountPayload, 'vendorId'>>;
}

/**
 * Type for discount update request
 * This is used by the vendor service
 */
export type UpdateDiscountRequest = Partial<
  Omit<CreateDiscountPayload, 'vendorId'>
>;
