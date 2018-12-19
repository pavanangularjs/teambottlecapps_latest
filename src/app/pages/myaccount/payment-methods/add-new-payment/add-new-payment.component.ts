import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PaymentProfile } from '../../../../models/payment-profile';
import { PaymentService } from '../../../../services/payment.service';
import { ProductStoreService } from '../../../../services/product-store.service';
import { CustomerService } from '../../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CreditcardTypeService } from '../../../../shared/services/creditcard-type.service';
import { ProgressBarService } from '../../../../shared/services/progress-bar.service';
@Component({
  selector: 'app-add-new-payment',
  templateUrl: './add-new-payment.component.html',
  styleUrls: ['./add-new-payment.component.scss']
})
export class AddNewPaymentComponent implements OnInit {
  formAddNewPayment: FormGroup;
  submitted = false;
  customerInfo: any;
  cardType = '';
  cardProfile: PaymentProfile;
  isSaveAddress: boolean;
  addressList: any;
  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years: any;

  constructor(private formBuilder: FormBuilder,
    // private spinnerService: Ng4LoadingSpinnerService,
    private paymentService: PaymentService,
    private productService: ProductStoreService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private cardService: CreditcardTypeService,
    private progressBarService: ProgressBarService) {
    if (this.productService.customerInfo) {
      this.customerInfo = this.productService.customerInfo;
    }

    this.years = [];
    const year = new Date().getFullYear();

    for (let i = 0; i < 20; i++) {
      this.years.push(year + i);
    }

  }

  ngOnInit() {
    this.isSaveAddress = false;
    this.formAddNewPayment = this.formBuilder.group({
      firstName: [this.customerInfo && this.customerInfo.FirstName || '', [Validators.required]],
      lastName: [this.customerInfo && this.customerInfo.LastName || '', [Validators.required]],
      sixteenDigitNumber: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(15)]],
      expiryMonth: ['', [Validators.required]],
      expiryYear: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required, Validators.maxLength(2), Validators.minLength(2)]],
      zipCode: ['', [Validators.required]],
      // country: ['', [Validators.required]],
      phoneNumber: [this.customerInfo && this.customerInfo.ContactNo || '', [Validators.required]]
    });
    this.getAddressList();
  }

  getAddressList() {
    if (this.customerService.customerAddressList && this.customerService.customerAddressList.ListAddress) {
      this.addressList = this.customerService.customerAddressList.ListAddress;
      this.addressList = this.addressList.sort((x, y) => x.IsDefault > y.IsDefault ? -1 : 1);

      if (this.addressList && this.addressList.length > 0) {
        this.initializeAddress(this.addressList[0]);
      }

    } else {
      // this.spinnerService.show();
      this.progressBarService.show();
      this.customerService.getCustomerAddressList().subscribe(
        data => {
          this.addressList = data ? (data.ListAddress ? data.ListAddress : []) : [];
          this.addressList = this.addressList.sort((x, y) => x.IsDefault > y.IsDefault ? -1 : 1);
          // this.spinnerService.hide();
          this.progressBarService.hide();

          if (this.addressList && this.addressList.length > 0) {
            this.initializeAddress(this.addressList[0]);
          }
        });
    }
  }

  initializeAddress(address) {

    this.formAddNewPayment = this.formBuilder.group({
      firstName: [this.customerInfo && this.customerInfo.FirstName || '', [Validators.required]],
      lastName: [this.customerInfo && this.customerInfo.LastName || '', [Validators.required]],
      sixteenDigitNumber: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(15)]],
      expiryMonth: ['', [Validators.required]],
      expiryYear: ['', [Validators.required]],
      address: [address.Address1, [Validators.required]],
      city: [address.City, [Validators.required]],
      state: [address.State, [Validators.required, Validators.maxLength(2), Validators.minLength(2)]],
      zipCode: [address.Zip, [Validators.required]],
      // country: ['', [Validators.required]],
      phoneNumber: [this.customerInfo && this.customerInfo.ContactNo || '', [Validators.required]]
    });

  }

  showCardType(isValid) {
    this.cardType = '';
    if (isValid && this.formAddNewPayment.get('sixteenDigitNumber').value) {
      this.cardType = this.cardService.getCardType(this.formAddNewPayment.get('sixteenDigitNumber').value);
    }
  }

  onSaveCard() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.formAddNewPayment.invalid) {
      this.toastr.error('Please enter valid data');
      return;
    }
    // this.spinnerService.show();
    this.cardProfile = new PaymentProfile();

    this.cardProfile.firstName = this.formAddNewPayment.get('firstName').value;
    this.cardProfile.lastName = this.formAddNewPayment.get('lastName').value;
    this.cardProfile.customerType = 'individual';
    this.cardProfile.address = this.formAddNewPayment.get('address').value;
    this.cardProfile.city = this.formAddNewPayment.get('city').value;
    this.cardProfile.state = this.formAddNewPayment.get('state').value;
    this.cardProfile.zip = this.formAddNewPayment.get('zipCode').value;
    // this.cardProfile.country = this.formAddNewPayment.get('country').value;
    this.cardProfile.phoneNumber = this.formAddNewPayment.get('phoneNumber').value;

    this.cardProfile.cardNumber = this.formAddNewPayment.get('sixteenDigitNumber').value;
    this.cardProfile.expirationDate =
    `${this.formAddNewPayment.get('expiryYear').value}-${this.formAddNewPayment.get('expiryMonth').value}`;
    this.cardProfile.defaultPaymentProfile = false;
    this.cardProfile.validationMode = 'testMode';

    if (this.isSaveAddress) {
      this.saveAddress();
    }

    const paymentMethodList = this.customerService.customerPaymentMethodGetList;

    if (paymentMethodList && paymentMethodList.ListPaymentItem
      && paymentMethodList.ListPaymentItem.length > 0
      && paymentMethodList.ListPaymentItem[0].UserProfileId) {
      this.cardProfile.customerProfileId = paymentMethodList.ListPaymentItem[0].UserProfileId;
    }

    this.progressBarService.show();
    if (this.cardProfile.customerProfileId) {
      this.paymentService.createCustomerPaymentProfileRequest(this.cardProfile).subscribe(data => {
        if (data && data.customerProfileId) {
          // this.customerService.customerPaymentInsert(data.customerProfileId, 1, 1).subscribe(res => {
          //  if (res && res.SuccessMessage !== '') {
          this.toastr.success('Card Added Successfully');
          this.progressBarService.hide();
          this.router.navigate(['/myaccount/payment-methods']);
          //  }
          // });
        } else {
          if (data && data.messages && data.messages.message &&
            data.messages.message.length > 0 && data.messages.message[0].text) {
            this.toastr.error(data.messages.message[0].text);
            this.progressBarService.hide();
          }
        }
      });
    } else {
      this.paymentService.createCustomerProfile(this.cardProfile).subscribe(data => {
        if (data && data.customerProfileId) {
          this.customerService.customerPaymentInsert(data.customerProfileId, 1, 1).subscribe(res => {
            if (res && res.SuccessMessage !== '') {
              this.toastr.success(res.SuccessMessage);
              this.progressBarService.hide();
              this.router.navigate(['/myaccount/payment-methods']);
            }
          });
        } else {
          if (data && data.messages && data.messages.message &&
            data.messages.message.length > 0 && data.messages.message[0].text) {
            this.toastr.error(data.messages.message[0].text);
            this.progressBarService.hide();
          }
        }
      });
    }
  }

  saveFlag() {
    this.isSaveAddress = !this.isSaveAddress;
  }

  saveAddress() {
    const address = {
      FirstName: '', LastName: '', AddressName: '',
      Address1: '', Address2: '', City: '', State: '', Zip: '', Country: '', IsDefault: 0,
      StoreId: 0, SessionId: '', UserId: 0, AppId: 0, DeviceId: '', DeviceType: ''
    };

    address.FirstName = this.cardProfile.firstName;
    address.LastName = this.cardProfile.lastName;
    address.Address1 = this.cardProfile.address;
    address.City = this.cardProfile.city;
    address.State = this.cardProfile.state;
    address.Zip = this.cardProfile.zip;
    address.IsDefault = 0;

    this.progressBarService.show();
    this.customerService.AddNewAddress(address).subscribe(
      (data) => {
        this.toastr.success(data.SuccessMessage);
        this.progressBarService.hide();
      });
  }
}
