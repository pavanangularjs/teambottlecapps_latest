import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PaymentProfile } from '../../../../models/payment-profile';
import { PaymentService } from '../../../../services/payment.service';
import { ProductStoreService } from '../../../../services/product-store.service';
import { CustomerService } from '../../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CreditcardTypeService } from '../../../../shared/services/creditcard-type.service';
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

  constructor(private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private paymentService: PaymentService,
    private productService: ProductStoreService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private cardService: CreditcardTypeService) {
    if (this.productService.customerInfo) {
      this.customerInfo = this.productService.customerInfo;
    }
  }

  ngOnInit() {
    this.isSaveAddress = false;
    this.formAddNewPayment = this.formBuilder.group({
      firstName: [this.customerInfo && this.customerInfo.FirstName || '', [Validators.required]],
      lastName: [this.customerInfo && this.customerInfo.LastName || '', [Validators.required]],
      sixteenDigitNumber: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(15)]],
      expiryDate: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required], Validators.maxLength(2), Validators.minLength(2)],
      zipCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]]
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
    this.cardProfile.country = this.formAddNewPayment.get('country').value;
    this.cardProfile.phoneNumber = this.formAddNewPayment.get('phoneNumber').value;

    this.cardProfile.cardNumber = this.formAddNewPayment.get('sixteenDigitNumber').value;
    this.cardProfile.expirationDate = this.formAddNewPayment.get('expiryDate').value;
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

    if (this.cardProfile.customerProfileId) {
      this.paymentService.createCustomerPaymentProfileRequest(this.cardProfile).subscribe(data => {
        if (data && data.customerProfileId) {
          // this.customerService.customerPaymentInsert(data.customerProfileId, 1, 1).subscribe(res => {
          //  if (res && res.SuccessMessage !== '') {
          this.toastr.success('New Card added Successfully');
          this.router.navigate(['/myaccount/payment-methods']);
          //  }
          // });
        }
      });
    } else {
      this.paymentService.createCustomerProfile(this.cardProfile).subscribe(data => {
        if (data && data.customerProfileId) {
          this.customerService.customerPaymentInsert(data.customerProfileId, 1, 1).subscribe(res => {
            if (res && res.SuccessMessage !== '') {
              this.toastr.success(res.SuccessMessage);
              this.router.navigate(['/myaccount/payment-methods']);
            }
          });
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

    this.customerService.AddNewAddress(address).subscribe(
      (data) => {
        this.toastr.success(data.SuccessMessage);
      });
  }
}
