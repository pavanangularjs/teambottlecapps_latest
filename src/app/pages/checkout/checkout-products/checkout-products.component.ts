import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { PaymentService } from '../../../services/payment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-products',
  templateUrl: './checkout-products.component.html',
  styleUrls: ['./checkout-products.component.scss']
})
export class CheckoutProductsComponent implements OnInit {
  cartDetails: any;
  isCouponError = false;
  isExpand = false;
  isTipExpand = true;
  constructor(private cartService: CartService, private router: Router,
    private paymentService: PaymentService) { }

  ngOnInit() {
    this.cartDetails = this.cartService.cartdetails;
    this.cartDetails.ListCartItem = this.cartDetails.ListCartItem.filter(item => item.Quantity !== 0);
    this.cartDetails.ListCartItem.map(item => item.QuantityOrdered = item.Quantity);

    this.cartDetails.ListCharge = this.cartDetails.ListCharge.filter(charge => charge.ChargeTitle !== 'Tip');
  }

  onCheckout() {

    /* this.cartDetails.OrderTypeId = 1;
    this.cartDetails.AddressId = 0;
    this.cartDetails.PaymentTypeId = 0; */

    const data = {
      amount: this.cartDetails.TotalValue,
      taxAmount: this.cartDetails.ListCharge.filter(item => item.ChargeTitle === 'Tax')[0].ChargeAmount,
      taxType: 'Sales Tax'
    };

    this.paymentService.createTransactionRequest(data).subscribe(paymentResponse => {
      this.cartService.placeOrder(this.cartDetails).subscribe(
        (orderResponse: any) => {
          this.cartDetails = orderResponse;
          this.router.navigate(['/myorders']);
        });
    });

  }

  onTipSelected(event: any, tip: any) {
    if (tip.IsDeafault) {
      this.cartDetails.TipForDriver = tip.TipAmount;
    }
  }
}
