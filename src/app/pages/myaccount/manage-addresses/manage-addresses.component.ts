import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-manage-addresses',
  templateUrl: './manage-addresses.component.html',
  styleUrls: ['./manage-addresses.component.scss']
})
export class ManageAddressesComponent implements OnInit {
addressList: any;
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
  }

  addToFavorite(address: any) {
    this.addressList.map(item => item.IsDefault = false);
    address.IsDefault = true;
  }

}
