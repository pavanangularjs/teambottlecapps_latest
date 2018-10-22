import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartDetails: any;
  constructor(private cartService: CartService,
    private customerService: CustomerService,
    private router: Router) { }

  ngOnInit() {
    this.getCartDetails();
  }

  getCartDetails() {
    this.cartService.getCartDetails().subscribe(
      (data: any) => {
        this.cartDetails = data;
      });
  }

  onDelivery() {
    if (this.customerService.customerSession && this.customerService.customerSession.UserId !== 0) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
