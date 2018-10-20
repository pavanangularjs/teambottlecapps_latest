import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartDetails: any;
  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.getCartDetails();
  }

  getCartDetails() {
    this.cartService.getCartDetails().subscribe(
      (data: any) => {
        this.cartDetails = data;
      });
  }

}
