import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export type OrderStatus = 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export class CartItemDto {
  menuItemId!: string;
  restaurantId!: string;
  name!: string;
  quantity!: number;
  priceCents!: number;
}

export class CartDto {
  userId!: string;
  items!: CartItemDto[];
  selectedAddressId!: string | null;
  totalCents!: number;
}

export class AddToCartDto {
  @IsString() @MinLength(1) menuItemId!: string;
  @IsString() @MinLength(1) restaurantId!: string;
  @IsString() @MinLength(1) name!: string;
  @IsNumber() @Min(1) quantity!: number;
  @IsNumber() @Min(0) priceCents!: number;
}

export class UpdateCartItemDto {
  @IsNumber() @Min(0) quantity!: number;
}

export class CheckoutDto {
  @IsString() @MinLength(1) selectedAddressId!: string;
}

export class OrderTimelineEventDto {
  status!: OrderStatus;
  at!: string;
  note?: string;
}

export class OrderDto {
  id!: string;
  userId!: string;
  restaurantId!: string;
  restaurantName!: string;
  status!: OrderStatus;
  items!: CartItemDto[];
  totalCents!: number;
  addressId!: string;
  paymentId?: string;
  createdAt!: string;
  updatedAt!: string;
  /** Customer display name */
  customerName?: string;
  /** Customer phone for call/chat */
  customerPhone?: string;
  /** Status history for tracking */
  timeline?: OrderTimelineEventDto[];
  /** ETA ISO string (e.g. delivery) */
  eta?: string;
  /** True if order is past expected prep time or missing milestones */
  atRisk?: boolean;
}

export class PaymentInitiateDto {
  @IsString() orderId!: string;
  @IsNumber() @Min(1) amountCents!: number;
}

export class PaymentStatusDto {
  paymentId!: string;
  status!: 'pending' | 'completed' | 'failed';
  orderId!: string;
}
