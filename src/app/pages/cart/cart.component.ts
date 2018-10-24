import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartDetails: any;
  quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  isCartUpdate = false;
  constructor(private cartService: CartService,
    private customerService: CustomerService,
    private router: Router,
    private decimalPipe: DecimalPipe,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.getCartDetails();
  }

  getCartDetails() {
    this.cartService.getCartDetails().subscribe(
      (data: any) => {
        this.cartDetails = data;
      });
  }

  onQtyChange(item: any) {
    item.Quantity = +item.Quantity;
    item.FinalItemTotal = this.decimalPipe.transform(item.FinalPrice * item.Quantity, '1.2-2');
    item.FinalItemTotalDisplay = '$' + item.FinalItemTotal;
    item.QuantityOrdered = +item.Quantity;
    this.isCartUpdate = true;
  }

  removeFromCart(item: any) {
    this.spinnerService.show();
    this.cartService.removeFromCart(item.PID).subscribe(
      (data: any) => {
        item.InCart = 0;
        if (this.cartDetails && this.cartDetails.ListCartItem) {
          const index = this.cartDetails.ListCartItem.indexOf(item);
          this.cartDetails.ListCartItem.splice(index, 1);
        }
        this.spinnerService.hide();
        alert(data.SuccessMessage);
      });
  }

  onDelivery() {
    if (this.customerService.customerSession && this.customerService.customerSession.UserId !== 0) {
      this.cartService.updateCart(this.cartDetails).subscribe(
        (data: any) => {
          this.cartDetails = data;
          this.router.navigate(['/checkout']);
        });
    } else {
      this.router.navigate(['/login']);
    }
  }

}
