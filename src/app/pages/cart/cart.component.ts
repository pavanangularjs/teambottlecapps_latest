import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('openCartReviewModal') openModal: ElementRef;
  cartDetails: any;
  quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  reviewItems: any;
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
        this.doStockAvailabilityCheck();
      });
  }

  doStockAvailabilityCheck() {
    if (!(this.cartDetails && this.cartDetails.ListCartItem)) {
      return;
    }

    this.reviewItems = this.cartDetails.ListCartItem.filter(item => item.Quantity !== item.QuantityOrdered);

    if (this.reviewItems && this.reviewItems.length > 0) {
      this.openModal.nativeElement.click();

      this.cartDetails.ListCartItem = this.cartDetails.ListCartItem.filter(item => item.Quantity !== 0);
      this.cartDetails.ListCartItem.map(item => item.QuantityOrdered = item.Quantity);
    }

  }

  onQtyChange(item: any) {
    item.QuantityOrdered = +item.QuantityOrdered;
    item.FinalItemTotal = this.decimalPipe.transform(item.FinalPrice * item.QuantityOrdered, '1.2-2');
    item.FinalItemTotalDisplay = '$' + item.FinalItemTotal;
    this.updateCart();
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

  updateCart() {
    this.cartService.updateCart(this.cartDetails).subscribe(
      (data: any) => {
        this.cartDetails = data;
        this.doStockAvailabilityCheck();
      });
  }

  onPickup() {
    this.cartDetails.OrderTypeId = 1;
    this.navigateURL();
  }

  onDelivery() {
    this.cartDetails.OrderTypeId = 2;

    const tip = this.cartDetails.ListCharge.filter(charge => charge.ChargeTitle === 'Tip')[0];
    if (tip) {
      this.cartDetails.TipForDriver = tip.ChargeAmount;
    } else {
      this.cartDetails.TipForDriver = -1;
    }

    this.navigateURL();
  }

  navigateURL() {
    // if (this.customerService.customerSession && this.customerService.customerSession.UserId !== 0) {    
    this.cartService.updateCart(this.cartDetails).subscribe(
      (data: any) => {
        this.router.navigate(['/checkout']);
      });
    /* } else {
      this.router.navigate(['/login']);
    } */
  }

}
