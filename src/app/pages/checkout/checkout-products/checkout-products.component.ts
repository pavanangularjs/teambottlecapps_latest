import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { PaymentService } from '../../../services/payment.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlaceOrderForOnlinePayment } from '../../../models/place-order-onlinepayment';
import { CustomerService } from '../../../services/customer.service';
import { Store } from '@ngrx/store';
import { CustomerLoginSession } from '../../../models/customer-login-session';
import { StoreGetHome } from '../../../state/product-store/product-store.action';
import { VantivPaymentService } from '../../../services/vantiv-payment.service';

@Component({
  selector: 'app-checkout-products',
  templateUrl: './checkout-products.component.html',
  styleUrls: ['./checkout-products.component.scss']
})
export class CheckoutProductsComponent implements OnInit {
  @Output() orderplace = new EventEmitter();
  cartDetails: any;
  isCouponError = false;
  isExpand = false;
  isTipExpand = true;
  couponCode: string;
  tipAmount: string;
  listCharges: any;
  isCouponApplied: boolean;
  isCheckoutSubmitted: boolean;

  constructor(private cartService: CartService, private router: Router,
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private customerService: CustomerService,
    private vantivPaymentService: VantivPaymentService,
    private store: Store<CustomerLoginSession>) {
      this.cartService.cartUpdated.subscribe(() => {
        this.cartDetails = this.cartService.cartdetails;
      });
     }

  ngOnInit() {
    this.couponCode = '';
    this.tipAmount = '';
    this.isCouponApplied = false;
    this.isCheckoutSubmitted = false;
    this.cartDetails = this.cartService.cartdetails;
    this.filterCartDetails();
  }

  filterCartDetails() {
    this.cartDetails.ListCartItem = this.cartDetails.ListCartItem.filter(item => item.Quantity !== 0);
    this.cartDetails.ListCartItem.map(item => item.QuantityOrdered = item.Quantity);

    const tip = this.cartDetails.ListCharge.filter(charge => charge.ChargeTitle === 'Tip')[0];
    if (tip) {
      this.tipAmount = tip.ChargeAmountDisplay;
    }
    this.listCharges = this.cartDetails.ListCharge.filter(charge => charge.ChargeTitle !== 'Tip');

    if ( this.cartDetails.OrderTypeId === 2 && this.cartDetails.ListTipForDriver.length > 0 ) {
      if (this.cartDetails.ListTipForDriver.filter(item => item.Percentage === 0).length === 0) {
        const otherTip = { 'Percentage': 0, 'TipAmount': '', 'TipAmountDisplay': 'Other', 'IsDeafault': false };
        this.cartDetails.ListTipForDriver.push(otherTip);
      }
    }
  }

  onCancelOrder() {
    this.clearPaymentCache();
    this.isCheckoutSubmitted = false;
    this.router.navigate(['/cart']);
  }

  onCheckout() {

    /* this.cartDetails.OrderTypeId = 1;
    this.cartDetails.AddressId = 0;
    this.cartDetails.PaymentTypeId = 0; */

    if (this.cartDetails.OrderTypeId === 2 && this.cartDetails.AddressId === 0) {
      this.toastr.error('Please Select Address');
      return;
    }
    if (this.cartDetails.PaymentTypeId === 1 &&
      this.paymentService.createTransaction.customerPaymentProfileId === '') {
      this.toastr.error('Please Select Payment Method');
      return;
    }

    if (this.cartDetails.PaymentTypeId === 7 &&
      this.vantivPaymentService.vUserSelectedPaymentAccountID === '') {
      this.toastr.error('Please Select Payment Method');
      return;
    }

    if ((this.cartDetails.PaymentTypeId === 1 || this.cartDetails.PaymentTypeId === 7)  &&
      this.paymentService.createTransaction.cvv === 0 || this.paymentService.createTransaction.cvv.toString() === '') {
      this.toastr.error('Please Enter CVV');
      return;
    }

    const data = {
      amount: this.cartDetails.TotalValue,
      taxAmount: this.cartDetails.ListCharge.filter(item => item.ChargeTitle === 'Tax')[0].ChargeAmount,
      taxType: 'Sales Tax'
    };

    this.isCheckoutSubmitted = true;

    if (this.cartDetails.PaymentTypeId === 0) {
      this.placeOrder();
    } else if (this.cartDetails.PaymentTypeId === 1 ) {
      this.paymentService.createTransactionRequest(data).subscribe(paymentResponse => {
        if (paymentResponse.transactionResponse && paymentResponse.transactionResponse.responseCode === '1') {
          this.placeOrderForOnlinePayment(paymentResponse);
        } else if (paymentResponse.transactionResponse && paymentResponse.transactionResponse.responseCode === '2') {
          this.orderplace.emit();
        }
      });
    } else if (this.cartDetails.PaymentTypeId === 7 ) {

      if (this.vantivPaymentService.vantiveProfile &&
        this.vantivPaymentService.vantiveProfile.credential7 === 'Authorize') {
          this.vantivPaymentService.CreditCardAuthorization(data.amount).subscribe((paymentResponse: any) => {
            if (this.vantivPaymentService.vExpressResponseCode === '0') {
              this.placeOrderForOnlinePayment(this.parseVantivResponse(paymentResponse));
            } else {
              this.orderplace.emit();
            }
          });
        } else if (this.vantivPaymentService.vantiveProfile &&
          this.vantivPaymentService.vantiveProfile.credential7 === 'Sale') {
            this.vantivPaymentService.CreditCardSale(data.amount).subscribe((paymentResponse: any) => {
              if (this.vantivPaymentService.vExpressResponseCode === '0') {
                this.placeOrderForOnlinePayment(this.parseVantivResponse(paymentResponse));
              } else {
                this.orderplace.emit();
              }
            });
        }
    }
  }

  parseVantivResponse(response) {

    let req;

    if (response.CreditCardAuthorizationResponse &&
      response.CreditCardAuthorizationResponse.Response) {

      const res = response.CreditCardAuthorizationResponse.Response;

      req = {
              'Address': {
                'BillingAddress1': res.Address.BillingAddress1 || ''
              },
              'Batch': {
                // 'HostBatchAmount': '7946.21',
                'HostBatchID': res.Batch.HostBatchID || ''
                // 'HostItemID': '352'
              },
              'Card': {
                'AVSResponseCode': res.Card.AVSResponseCode || '',
                'BIN': res.Card.BIN || '',
                'CardLogo': res.Card.CardLogo || '',
                'CardNumberMasked': res.Card.CardNumberMasked || ''
              },
              'ExpressResponseCode': res.ExpressResponseCode || '',
              'ExpressResponseMessage': res.ExpressResponseMessage || '',
              'ExpressTransactionDate': res.ExpressTransactionDate || '',
              'ExpressTransactionTime': res.ExpressTransactionTime || '',
              'ExpressTransactionTimezone': res.ExpressTransactionTimezone || '',
              'HostResponseCode': res.HostResponseCode || '',
              'HostResponseMessage': res.HostResponseMessage || '',
              'PaymentAccount': {
                'PaymentAccountID': this.vantivPaymentService.vUserSelectedPaymentAccountID,
                'PaymentAccountReferenceNumber': res.PaymentAccount.PaymentAccountReferenceNumber
              },
              'Transaction': {
                'AcquirerData': res.Transaction.AcquirerData,
                'ApprovalNumber': res.Transaction.ApprovalNumber,
                'ApprovedAmount': res.Transaction.ApprovedAmount,
                'ProcessorName': res.Transaction.ProcessorName,
                'ReferenceNumber': res.Transaction.ReferenceNumber,
                'TransactionID': res.Transaction.TransactionID,
                'TransactionStatus': res.Transaction.TransactionStatus,
                'TransactionStatusCode': res.Transaction.TransactionStatusCode
              }
        };
    }

    return req;
  }

  placeOrder() {
    this.cartService.placeOrder(this.cartDetails).subscribe(
      (orderResponse: any) => {
        this.cartDetails = orderResponse;
        if (this.cartDetails.OrderId !== 0) {
          this.toastr.success('Order Placed Successfully.');
          this.store.dispatch(new StoreGetHome());
        }
        this.isCheckoutSubmitted = false;
        this.clearPaymentCache();
        this.orderplace.emit(this.cartDetails);

      });
  }

  placeOrderForOnlinePayment(data) {
    const placeOrderReq = this.getPlaceOrderRequestParamsForOnlinePayment(data);

    if (placeOrderReq) {
      this.cartService.placeOrder(placeOrderReq).subscribe(
        (orderResponse: any) => {
          this.cartDetails = orderResponse;
          this.isCheckoutSubmitted = false;
          if (this.cartDetails.OrderId !== 0) {
            this.toastr.success('Order Placed Successfully.');
            this.store.dispatch(new StoreGetHome());
          }
          this.clearPaymentCache();
          this.orderplace.emit(this.cartDetails);
        });
    } else {
      this.toastr.error('Invalid Session, Please ReLogin ...');
    }

  }

  clearPaymentCache() {
    this.paymentService.createTransaction = {
      customerProfileId: '',
      customerPaymentProfileId: '',
      cvv: 0
    };
  }
  private getPlaceOrderRequestParamsForOnlinePayment(data: any): PlaceOrderForOnlinePayment {
    if (!this.customerService.customerSession) {
      return null;
    }

    return {
      StoreId: this.customerService.customerSession.StoreId,
      SessionId: this.customerService.customerSession.SessionId,
      UserId: this.customerService.customerSession.UserId,
      AppId: this.customerService.customerSession.AppId,
      DeviceId: this.customerService.customerSession.DeviceId,
      DeviceType: this.customerService.customerSession.DeviceType,
      DoPDate: (this.cartDetails.OrderTypeId === 2) ? this.cartDetails.DoPDate : '',
      DoPSlot: (this.cartDetails.OrderTypeId === 2) ? this.cartDetails.DoPTimeSlot : '',
      CartId: this.cartDetails.CartId,
      CardInfo: data,
      UserRemarks: this.cartDetails.Remark,
      OrderTypeId: this.cartDetails.OrderTypeId,
      PaymentTypeId: this.cartDetails.PaymentTypeId
    };
  }

  applyCoupon() {
    if (this.couponCode.trim() !== '' && !this.isCouponApplied) {
      this.cartDetails.CouponCode = this.couponCode;
      this.cartService.updateCart(this.cartDetails).subscribe(
        (data: any) => {
          this.cartDetails = data;
          if ( data.Remark === '') {
            this.isCouponApplied = true;
            this.toastr.success('Coupon Applied Successfully.');
            this.filterCartDetails();
          }
        });
    }
  }

  updateCart() {
    this.cartService.updateCart(this.cartDetails).subscribe(
      (data: any) => {
        this.cartDetails = data;
        this.filterCartDetails();
      });
  }

  clearCoupon() {
    this.couponCode = '';
    this.isCouponApplied = false;
    if (this.cartDetails.CouponCode !== '') {
      this.cartDetails.CouponCode = this.couponCode;
      this.cartService.updateCart(this.cartDetails).subscribe(
        (data: any) => {
          this.cartDetails = data;
          this.filterCartDetails();
        });
    }
  }
  onTipSelected(event: any, tip: any) {
    this.cartDetails.ListTipForDriver.forEach(item => {
      if (item.Percentage === tip.Percentage) {
        item.IsDeafault = true;
        // this.tipAmount = tip.TipAmountDisplay;
        this.cartDetails.TipForDriver = tip.TipAmount;

        if (tip.TipAmount !== '') {
          this.updateCart();
        }
      } else {
        item.IsDeafault = false;
      }
    });
  }
}
