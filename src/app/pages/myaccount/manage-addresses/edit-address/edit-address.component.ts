import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressInsert } from '../../../../models/address-insert';
import { CustomerService } from '../../../../services/customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss']
})
export class EditAddressComponent implements OnInit {
  editAddress: any;
  formEditAddress: FormGroup;
  constructor(private route: ActivatedRoute, private customerService: CustomerService, private router: Router,
    private toastr: ToastrService) {
      this.formEditAddress = new FormGroup({
        aFirstName: new FormControl(''),
        aLastName: new FormControl(''),
        aAddressName: new FormControl(''),
        aAddress1: new FormControl(''),
        aAddress2: new FormControl(''),
        aCity: new FormControl(''),
        aState: new FormControl(''),
        aZip: new FormControl(''),
        // aCountry: new FormControl(''),
        aIsDefault: new FormControl(false),
      });
     }

  ngOnInit() {
    const addressId = +this.route.snapshot.paramMap.get('id');
    this.editAddress = this.customerService.customerAddressList.ListAddress.filter(item => item.AddressId === addressId)[0];

    if (this.editAddress) {
      this.initializeAddress();
    }
  }

  initializeAddress() {
    this.formEditAddress = new FormGroup({
      aFirstName: new FormControl(this.editAddress.FirstName),
      aLastName: new FormControl(this.editAddress.LastName),
      aAddressName: new FormControl(this.editAddress.AddressName),
      aAddress1: new FormControl(this.editAddress.Address1),
      aAddress2: new FormControl(this.editAddress.Address2),
      aCity: new FormControl(this.editAddress.City),
      aState: new FormControl(this.editAddress.State),
      aZip: new FormControl(this.editAddress.Zip),
      // aCountry: new FormControl(''),
      aIsDefault: new FormControl(this.editAddress.IsDefault),
    });
  }
  onAddressUpdate() {
    const address = {AddressId: this.editAddress.AddressId, FirstName: '', LastName: '', AddressName: '',
    Address1: '', Address2: '', City: '', State: '', Zip: '', Country: '', IsDefault: 0,
    StoreId: 0, SessionId: '', UserId: 0, AppId: 0, DeviceId: '', DeviceType: ''};

    address.FirstName = this.formEditAddress.get('aFirstName').value;
    address.LastName = this.formEditAddress.get('aLastName').value;
    address.AddressName = this.formEditAddress.get('aAddressName').value;
    address.Address1 = this.formEditAddress.get('aAddress1').value;
    address.Address2 = this.formEditAddress.get('aAddress2').value;
    address.City = this.formEditAddress.get('aCity').value;
    address.State = this.formEditAddress.get('aState').value;
    address.Zip = this.formEditAddress.get('aZip').value;
    // address.Country = this.formAddNewAddress.get('aCountry').value;
    address.IsDefault = this.formEditAddress.get('aIsDefault').value === true ? 1 : 0;

    this.customerService.UpdateAddress(address).subscribe(
      (data) => {
        this.toastr.success(data.SuccessMessage);
        this.router.navigate(['myaccount/manage-addresses']);
      });
  }

}
