import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-addresses',
  templateUrl: './manage-addresses.component.html',
  styleUrls: ['./manage-addresses.component.scss']
})
export class ManageAddressesComponent implements OnInit {
addressList: any;
  constructor(private customerService: CustomerService,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService) { }

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
    const updatedAddress = {
      AddressId: address.AddressId,
      FirstName: address.FirstName,
      LastName: address.LastName,
      AddressName: address.AddressName,
      Address1: address.Address1,
      Address2: address.Address2,
      City: address.City,
      State: address.State,
      Zip: address.Zip,
      Country: address.Country,
      IsDefault: 1,
      StoreId: 0, SessionId: '', UserId: 0, AppId: 0, DeviceId: '', DeviceType: ''};

    this.addressList.map(item => item.IsDefault = false);

    this.spinnerService.show();
    this.customerService.UpdateAddress(updatedAddress).subscribe(
      data => {
        if (data) {
          this.toastr.success(data.SuccessMessage);
          address.IsDefault = data.IsDefault;
        }
        this.spinnerService.hide();
      });
  }

  deleteAddress(address: any) {
    this.spinnerService.show();
    this.customerService.DeleteAddress(address.AddressId).subscribe(
      data => {
        this.toastr.success(data.SuccessMessage);
        this.addressList.splice(this.addressList.indexOf(address), 1);
        this.spinnerService.hide();
      });
  }

}
