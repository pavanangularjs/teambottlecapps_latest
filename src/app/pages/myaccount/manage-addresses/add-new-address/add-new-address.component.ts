import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressInsert } from '../../../../models/address-insert';
import { CustomerService } from '../../../../services/customer.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-new-address',
  templateUrl: './add-new-address.component.html',
  styleUrls: ['./add-new-address.component.scss']
})
export class AddNewAddressComponent implements OnInit {
  formAddNewAddress: FormGroup;
  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit() {
    this.formAddNewAddress = new FormGroup({
      aFirstName: new FormControl(''),
      aLastName: new FormControl(''),
      aAddressName: new FormControl(''),
      aAddress1: new FormControl(''),
      aAddress2: new FormControl(''),
      aCity: new FormControl(''),
      aState: new FormControl(''),
      aZip: new FormControl(''),
      aCountry: new FormControl(''),
      aIsDefault: new FormControl(false),
    });
  }

  onAddressSave() {
    const address = {FirstName: '', LastName: '', AddressName: '',
    Address1: '', Address2: '', City: '', State: '', Zip: '', Country: '', IsDefault: 0,
    StoreId: 0, SessionId: '', UserId: 0, AppId: 0, DeviceId: '', DeviceType: ''};

    address.FirstName = this.formAddNewAddress.get('aFirstName').value;
    address.LastName = this.formAddNewAddress.get('aLastName').value;
    address.AddressName = this.formAddNewAddress.get('aAddressName').value;
    address.Address1 = this.formAddNewAddress.get('aAddress1').value;
    address.Address2 = this.formAddNewAddress.get('aAddress2').value;
    address.City = this.formAddNewAddress.get('aCity').value;
    address.State = this.formAddNewAddress.get('aState').value;
    address.Zip = this.formAddNewAddress.get('aZip').value;
    address.Country = this.formAddNewAddress.get('aCountry').value;
    address.IsDefault = this.formAddNewAddress.get('aIsDefault').value === true ? 1 : 0;

    this.customerService.AddNewAddress(address).subscribe(
      (data) => {
        alert(data.SuccessMessage);
        this.router.navigate(['myaccount/manage-addresses']);
      });
  }
}
