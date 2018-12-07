import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartDetails: any;
  orderNumber: string;
  isOrderPlaced = false;
  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.isOrderPlaced = false;
    this.cartDetails = this.cartService.cartdetails;
  }

  onOrderPlace(cartDetails) {
    this.orderNumber = '';
    if (cartDetails && cartDetails.OrderNo) {
      this.orderNumber = cartDetails.OrderNo;
      this.isOrderPlaced = true;
    }
  }
}
