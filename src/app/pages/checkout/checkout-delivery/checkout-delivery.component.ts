import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
  addressList: any;
  selectedAddress: number;

  constructor(private customerService: CustomerService,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
   this.getAddressList();
  }

  getAddressList() {
    if (this.customerService.customerAddressList && this.customerService.customerAddressList.ListAddress) {
      this.addressList = this.customerService.customerAddressList.ListAddress;
    } else {
      this.spinnerService.show();
      this.customerService.getCustomerAddressList().subscribe(
        data => {
          this.addressList = data ? (data.ListAddress ? data.ListAddress : []) : [];
          this.spinnerService.hide();
        });
    }

    this.selectedAddress = this.addressList.filter(address => address.IsDefault === true)[0].AddressId;
  }

  onSelectAddress(address) {
    this.selectedAddress = address.AddressId;
  }

}
