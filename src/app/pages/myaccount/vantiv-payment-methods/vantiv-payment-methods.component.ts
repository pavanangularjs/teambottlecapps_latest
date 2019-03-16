import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
import { VantivPaymentService } from '../../../services/vantiv-payment.service';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vantiv-payment-methods',
  templateUrl: './vantiv-payment-methods.component.html',
  styleUrls: ['./vantiv-payment-methods.component.scss']
})
export class VantivPaymentMethodsComponent implements OnInit {
  vantivPaymentProfiles: any;
  constructor(
    private progressBarService: ProgressBarService,
    private vantivPaymentService: VantivPaymentService,
    private customerService: CustomerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.vantivPaymentProfiles = [];

    if (!(this.vantivPaymentService.vantiveProfile && this.vantivPaymentService.vantiveProfile.credential1 !== undefined)) {
      this.progressBarService.show();
      this.customerService.getCustomerPaymentMethodGetList().subscribe(
        () => {
          this.getExistingCardDetailsForVantiv();
        });

    } else {
      this.getExistingCardDetailsForVantiv();
    }
  }

  getExistingCardDetailsForVantiv() {
    // vAppLoginId: 5Pj5hE6a   vTransactionKey: 77Za8R4Wnx988xQs
    this.vantivPaymentProfiles = [];

    this.progressBarService.show();
      this.vantivPaymentService.getAddedCards().subscribe(
        data => {
          // data.PaymentAccountQueryResponse.Response.QueryData.Items.Item.TruncatedCardNumber
          if (data && data.PaymentAccountQueryResponse &&
            data.PaymentAccountQueryResponse.Response &&
            data.PaymentAccountQueryResponse.Response.QueryData &&
            data.PaymentAccountQueryResponse.Response.QueryData.Items &&
            data.PaymentAccountQueryResponse.Response.QueryData.Items.Item) {
            // this.vantivPaymentProfiles = data.PaymentAccountQueryResponse.Response.QueryData.Items.Item;
            this.vantivPaymentProfiles = [...this.vantivPaymentProfiles,
              ...data.PaymentAccountQueryResponse.Response.QueryData.Items.Item];

          }
          // this.spinnerService.hide();
          this.progressBarService.hide();
        });

  }
  deletePaymentMethod( profile) {
    this.progressBarService.show();
    this.vantivPaymentService.deletePaymentMethod(
      profile.PaymentAccountID,
      profile.PaymentAccountType,
      profile.PaymentAccountReferenceNumber).subscribe(
      data => {
        if (data && data.PaymentAccountDeleteResponse && data.PaymentAccountDeleteResponse.Response) {
          const res = data.PaymentAccountDeleteResponse.Response;

          if (res.ExpressResponseCode === '0') {
            this.toastr.success(res.ExpressResponseMessage);
            this.progressBarService.hide();
            this.getExistingCardDetailsForVantiv();
          } else {
            this.toastr.error(res.ExpressResponseMessage);
          }
        }
      });
  }
}
