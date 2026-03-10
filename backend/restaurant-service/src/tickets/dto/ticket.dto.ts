import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export class TicketDto {
  id!: string;
  restaurantId?: string;
  userId!: string;
  orderId?: string;
  subject!: string;
  category!: string;
  status!: TicketStatus;
  messages!: TicketMessageDto[];
  createdAt!: string;
  updatedAt!: string;
}

export class TicketMessageDto {
  id!: string;
  sender!: 'customer' | 'restaurant';
  body!: string;
  at!: string;
}

export class CreateTicketDto {
  @IsString() @MinLength(1) @MaxLength(200) subject!: string;
  @IsString() @MinLength(1) @MaxLength(100) category!: string;
  @IsString() @MinLength(1) @MaxLength(2000) message!: string;
  @IsOptional() @IsString() orderId?: string;
}

export class ReplyTicketDto {
  @IsString() @MinLength(1) @MaxLength(2000) message!: string;
}

export class UpdateTicketStatusDto {
  @IsString() status!: TicketStatus;
}
