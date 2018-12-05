import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PaymentService } from '../../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../services/cart.service';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'app-checkout-payment-method',
  templateUrl: './checkout-payment-method.component.html',
  styleUrls: ['./checkout-payment-method.component.scss']
})
export class CheckoutPaymentMethodComponent implements OnInit {

  paymentMethodList: any;
  paymentProfiles: any;
  userProfileId: string;
  selectedCard: number;
  cardCVV: number;
  storeDetails: any;
  orderTypeId: number;

  constructor(private customerService: CustomerService, private paymentService: PaymentService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private cartService: CartService,
    private storeService: ProductStoreService,
    private progressBarService: ProgressBarService) { }

  ngOnInit() {
    this.getPaymentMethodGetList();
    this.getStoreDetails();
    this.orderTypeId = this.cartService.cartdetails.OrderTypeId;
  }

  getPaymentMethodGetList() {
    if (this.customerService.customerPaymentMethodGetList && this.customerService.customerPaymentMethodGetList.ListPaymentItem) {
      this.paymentMethodList = this.customerService.customerPaymentMethodGetList.ListPaymentItem;
      this.getPaymentList();
    } else {
      // this.spinnerService.show();
      this.progressBarService.show();
      this.customerService.getCustomerPaymentMethodGetList().subscribe(
        data => {
          this.paymentMethodList = data ? (data.ListPaymentItem ? data.ListPaymentItem : []) : [];
          this.getPaymentList();
        });
    }
  }

  getPaymentList() {
    if (this.paymentMethodList && this.paymentMethodList.length > 0 &&
      this.paymentMethodList[0].UserProfileId) {
      this.userProfileId = this.paymentMethodList[0].UserProfileId;
      this.paymentService.createTransaction.customerProfileId = this.paymentMethodList[0].UserProfileId;
      this.getExistingCardDetails(this.paymentMethodList[0].UserProfileId);
    } else {
      // this.spinnerService.hide();
      this.progressBarService.hide();
    }
  }

  getExistingCardDetails(userProfileId: string) {
    // vAppLoginId: 5Pj5hE6a   vTransactionKey: 77Za8R4Wnx988xQs
    this.paymentProfiles = [];
    if (userProfileId !== '') {
      this.paymentService.getExistingCards(userProfileId).subscribe(
        data => {
          if (data && data.profile && data.profile.paymentProfiles) {
            this.paymentProfiles = data.profile.paymentProfiles;
          }
          // this.spinnerService.hide();
          this.progressBarService.hide();
        });
    } else {
      // this.spinnerService.hide();
      this.progressBarService.hide();
    }
  }

  getStoreDetails() {
    this.storeService.getStoreDetails().subscribe(data => {
      if (data && data.GetStoredetails) {
        this.storeDetails = data.GetStoredetails;
      }
    });
  }

  saveCVV() {
    this.paymentService.createTransaction.cvv = this.cardCVV;
  }

  updateSelectedPayment(paymentProfile) {
    this.cartService.cartdetails.PaymentTypeId = paymentProfile.customerPaymentProfileId;

    this.paymentService.createTransaction.customerPaymentProfileId = paymentProfile.customerPaymentProfileId;

  }

}
