import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CartService } from '../../../services/cart.service';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
import { ToastrService } from 'ngx-toastr';

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
    private progressBarService: ProgressBarService,
    private toastr: ToastrService) { }

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
    this.updateCart();
    this.deliveryTimingsList = [];
    if (this.cartDetails && this.cartDetails.ListDoPTimeSlot) {
      this.deliveryTimingsList = this.cartDetails.ListDoPTimeSlot.filter(slot => slot.DoPDate === this.selectedDeliveryDate)
      .map(item => item.DoPSlot);
    }
  }

  updateDeliveryTime() {
    this.cartService.cartdetails.DoPTimeSlot = this.selectedDeliveryTime;
    this.updateCart();
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
          this.addressList = this.addressList.sort((x, y) => x.IsDefault > y.IsDefault ? -1 : 1 );
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
    this.updateCart();
  }

  updateCart() {
    this.progressBarService.show();
    this.cartService.updateCart(this.cartService.cartdetails).subscribe(
      (data: any) => {
        this.cartDetails = data;
        this.progressBarService.hide();

        if ( this.cartDetails && this.cartDetails.DeliveryAddress
          && this.cartDetails.DeliveryAddress.Remark !== '') {
          this.toastr.error(this.cartDetails.DeliveryAddress.Remark);
        }
      });
  }

}
