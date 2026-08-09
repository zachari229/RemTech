import { IsString, IsObject, IsOptional } from 'class-validator';

export class ChariowWebhookDto {
  @IsString()
  event: string;

  @IsObject()
  @IsOptional()
  data: {
    id?: string;
    customer?: {
      email?: string;
    };
    product?: {
      id?: string;
    };
    custom_metadata?: {
      order_ref?: string;
      course_id?: string;
      user_id?: string;
    };
    [key: string]: any;
  };
}