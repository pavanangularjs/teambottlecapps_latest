import { BaseRequest } from './base-request';

export class CustomerPaymentInsert extends BaseRequest  {
    UserProfileId: string;
    IsDefault: number;
    PaymentTypeId: number;
}
