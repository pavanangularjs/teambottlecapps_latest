import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartDetails: any;
  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartDetails = this.cartService.cartdetails;
  }

}
