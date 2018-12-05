import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CartService } from '../../../services/cart.service';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
  addressList: any;
  selectedAddress: number;
  cartDetails: any;
  deliveryDatesList: any;
  deliveryTimingsList: any;
  selectedDeliveryDate: any;
  selectedDeliveryTime: any;
  constructor(private customerService: CustomerService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private cartService: CartService,
    private progressBarService: ProgressBarService) { }

  ngOnInit() {
    this.cartDetails = this.cartService.cartdetails;
    if (this.cartDetails) {
      this.selectedDeliveryDate = this.cartDetails.DoPDate;
      this.selectedDeliveryTime = this.cartDetails.DoPTimeSlot;
      this.getDeliveryDates();
      this.getDeliveryTimings();
    }
    this.getAddressList();
  }

  getDeliveryDates() {
    this.deliveryDatesList = [];
    if (this.cartDetails && this.cartDetails.ListDoPTimeSlot) {
      this.cartDetails.ListDoPTimeSlot.forEach(slot => {
        if (this.deliveryDatesList.indexOf(slot.DoPDate) === -1) {
          this.deliveryDatesList.push(slot.DoPDate);
        }
      });
    }
  }

  getDeliveryTimings() {
    this.cartService.cartdetails.DoPDate = this.selectedDeliveryDate;
    this.deliveryTimingsList = [];
    if (this.cartDetails && this.cartDetails.ListDoPTimeSlot) {
      this.deliveryTimingsList = this.cartDetails.ListDoPTimeSlot.filter(slot => slot.DoPDate === this.selectedDeliveryDate)
      .map(item => item.DoPSlot);
    }
  }

  updateDeliveryTime() {
    this.cartService.cartdetails.DoPTimeSlot = this.selectedDeliveryTime;
  }
  getAddressList() {
    if (this.customerService.customerAddressList && this.customerService.customerAddressList.ListAddress) {
      this.addressList = this.customerService.customerAddressList.ListAddress;
    } else {
      // this.spinnerService.show();
      this.progressBarService.show();
      this.customerService.getCustomerAddressList().subscribe(
        data => {
          this.addressList = data ? (data.ListAddress ? data.ListAddress : []) : [];
          if (this.addressList && this.addressList.filter(address => address.IsDefault === true).length > 0) {
            this.cartService.cartdetails.AddressId = this.addressList.filter(address => address.IsDefault === true)[0].AddressId;
          }
          // this.spinnerService.hide();
          this.progressBarService.hide();
        });
    }
  }

  onSelectAddress(address) {
    this.cartService.cartdetails.AddressId = address.AddressId;
  }

}
