import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { PaymentService } from '../../../services/payment.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlaceOrderForOnlinePayment } from '../../../models/place-order-onlinepayment';
import { CustomerService } from '../../../services/customer.service';

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
  constructor(private cartService: CartService, private router: Router,
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private customerService: CustomerService) { }

  ngOnInit() {
    this.couponCode = '';
    this.tipAmount = '';
    this.isCouponApplied = false;
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

    if (this.cartDetails.PaymentTypeId === 1 &&
      this.paymentService.createTransaction.cvv === 0 || this.paymentService.createTransaction.cvv.toString() === '') {
      this.toastr.error('Please Enter CVV');
      return;
    }

    const data = {
      amount: this.cartDetails.TotalValue,
      taxAmount: this.cartDetails.ListCharge.filter(item => item.ChargeTitle === 'Tax')[0].ChargeAmount,
      taxType: 'Sales Tax'
    };

    if (this.cartDetails.PaymentTypeId === 0) {
      this.placeOrder();
    } else {
      this.paymentService.createTransactionRequest(data).subscribe(paymentResponse => {
        if (paymentResponse.messages.message[0].text === 'Successful.'
          || paymentResponse.messages.message[0].code === 'I00001') {
          this.placeOrderForOnlinePayment(paymentResponse);
        }
      });
    }
  }

  placeOrder() {
    this.cartService.placeOrder(this.cartDetails).subscribe(
      (orderResponse: any) => {
        this.cartDetails = orderResponse;
        this.toastr.success('Order Placed Successfully.');
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
          this.toastr.success('Order Placed Successfully.');
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
    if (this.couponCode.trim() !== '') {
      this.cartDetails.CouponCode = this.couponCode;
      this.cartService.updateCart(this.cartDetails).subscribe(
        (data: any) => {
          this.cartDetails = data;
          this.isCouponApplied = true;
          this.toastr.success('Coupon Applied Successfully.');
          this.filterCartDetails();
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
