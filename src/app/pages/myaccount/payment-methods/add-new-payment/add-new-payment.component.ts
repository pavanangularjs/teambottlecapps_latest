import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PaymentProfile } from '../../../../models/payment-profile';
import { PaymentService } from '../../../../services/payment.service';
import { ProductStoreService } from '../../../../services/product-store.service';
import { CustomerService } from '../../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-new-payment',
  templateUrl: './add-new-payment.component.html',
  styleUrls: ['./add-new-payment.component.scss']
})
export class AddNewPaymentComponent implements OnInit {
  formAddNewPayment: FormGroup;
  submitted = false;
  customerInfo: any;

  constructor(private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private paymentService: PaymentService,
    private productService: ProductStoreService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router) {
      if (this.productService.customerInfo) {
        this.customerInfo = this.productService.customerInfo;
      }
    }

  ngOnInit() {
    this.formAddNewPayment = this.formBuilder.group({
      firstName: [this.customerInfo && this.customerInfo.FirstName || '', [Validators.required]],
      lastName: [this.customerInfo && this.customerInfo.LastName || '', [Validators.required]],
      sixteenDigitNumber: ['', [Validators.required]],
      expiryDate: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]]
    });
  }

  onSaveCard() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.formAddNewPayment.invalid) {
      return;
    }
    // this.spinnerService.show();
    const cardProfile = new PaymentProfile();

    cardProfile.firstName = this.formAddNewPayment.get('firstName').value;
    cardProfile.lastName = this.formAddNewPayment.get('lastName').value;
    cardProfile.customerType = 'individual';
    cardProfile.address = this.formAddNewPayment.get('address').value;
    cardProfile.city = this.formAddNewPayment.get('city').value;
    cardProfile.state = this.formAddNewPayment.get('state').value;
    cardProfile.zip = this.formAddNewPayment.get('zipCode').value;
    cardProfile.country = this.formAddNewPayment.get('country').value;
    cardProfile.phoneNumber = this.formAddNewPayment.get('phoneNumber').value;

    cardProfile.cardNumber = this.formAddNewPayment.get('sixteenDigitNumber').value;
    cardProfile.expirationDate = this.formAddNewPayment.get('expiryDate').value;
    cardProfile.defaultPaymentProfile = false;
    cardProfile.validationMode = 'testMode';

    const paymentMethodList = this.customerService.customerPaymentMethodGetList;

    if (paymentMethodList && paymentMethodList.ListPaymentItem
      && paymentMethodList.ListPaymentItem.length > 0
      && paymentMethodList.ListPaymentItem[0].UserProfileId) {
        cardProfile.customerProfileId = paymentMethodList.ListPaymentItem[0].UserProfileId;
      }

    if (cardProfile.customerProfileId) {
      this.paymentService.createCustomerPaymentProfileRequest(cardProfile).subscribe(data => {
        if (data && data.customerProfileId) {
          this.customerService.customerPaymentInsert(data.customerProfileId, 1, 1).subscribe(res => {
            if (res && res.SuccessMessage !== '') {
              this.toastr.success(res.SuccessMessage);
              this.router.navigate(['/myaccount/payment-methods']);
            }
          });
        }
      });
    } else {
      this.paymentService.createCustomerProfile(cardProfile).subscribe(data => {
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

}
