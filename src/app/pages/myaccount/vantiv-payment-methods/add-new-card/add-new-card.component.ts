import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VantivURLs } from '../../../../app-config.service';
import { VantivPaymentService } from '../../../../services/vantiv-payment.service';
import { CustomerService } from '../../../../services/customer.service';
import { ProgressBarService } from '../../../../shared/services/progress-bar.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { VantivResponseCodes } from '../../../../services/vantiv-responsecodes';

@Component({
  selector: 'app-add-new-card',
  templateUrl: './add-new-card.component.html',
  styleUrls: ['./add-new-card.component.scss']
})
export class AddNewCardComponent implements OnInit {
  url: SafeResourceUrl;
  add_card_url: string;
  setupTransactionURL: string;
  ifrm: HTMLIFrameElement;
  addressList: any;

  constructor(public sanitizer: DomSanitizer,
    private vantivPaymentService: VantivPaymentService,
    private customerService: CustomerService,
    private progressBarService: ProgressBarService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.url = '';
    this.vantivPaymentService.vTransactionSetupID = '';
    this.getAddressList();
  }

  setupTransactionId() {
    if (!this.vantivPaymentService.vTransactionSetupID) {
      this.progressBarService.show();
      this.vantivPaymentService.setupTransactionID().subscribe(() => {
        this.progressBarService.hide();
        this.setURL();
        this.saveRequestAndResponse();
      });
    } else {
      this.setURL();
    }
  }

  getAddressList() {
    if (this.customerService.customerAddressList && this.customerService.customerAddressList.ListAddress) {
      this.addressList = this.customerService.customerAddressList.ListAddress;
      const defaultAddress = this.addressList.filter(address => address.IsDefault === true)[0];

      if (defaultAddress) {
        this.vantivPaymentService.setBillingAddress(defaultAddress);
      }
      this.setupTransactionId();
    } else {
      this.progressBarService.show();
      this.customerService.getCustomerAddressList().subscribe(
        data => {
          this.addressList = data ? (data.ListAddress ? data.ListAddress : []) : [];
          this.progressBarService.hide();

          const defaultAddress = this.addressList.filter(address => address.IsDefault === true)[0];
          if (defaultAddress) {
            this.vantivPaymentService.setBillingAddress(defaultAddress);
          }
          this.setupTransactionId();
        });
    }
  }

  setURL() {
    this.setupTransactionURL = '';
    this.add_card_url = VantivURLs.hostedPayments + this.vantivPaymentService.vTransactionSetupID;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.add_card_url);
  }

  onLoad() {
    this.ifrm = <HTMLIFrameElement>document.getElementById('myIframe');
    if (this.add_card_url === this.ifrm.src) {
      if (this.setupTransactionURL === '') {
        this.setupTransactionURL = this.add_card_url;
      } else {
        this.progressBarService.show();
        this.vantivPaymentService.onCardValidationSuccessGetTransactionDetails(
          this.vantivPaymentService.vTransactionSetupID).subscribe(data => {
            this.progressBarService.hide();
            this.saveRequestAndResponse();
            this.vantivPaymentService.vTransactionSetupID = '';
            if ( data && data.TransactionQueryResponse
              && data.TransactionQueryResponse.Response
              && data.TransactionQueryResponse.Response.ReportingData
              && data.TransactionQueryResponse.Response.ReportingData.Items
              && data.TransactionQueryResponse.Response.ReportingData.Items.Item) {
                const res = data.TransactionQueryResponse.Response.ReportingData.Items.Item;
                if (res && res.ExpressResponseCode === '0'
                  && ['X', 'Y', 'Z', 'D', 'M'].indexOf(res.AVSResponseCode.trim()) !== -1
                  && res.CVVResponseCode.trim() === 'M') {
                    this.getPaymentAccountId();
                  } else {
                    this.showProperErrorMessage(res);
                  }
            }
        });
        // this.vantivPaymentService.vTransactionSetupID = '';
        // alert(this.ifrm.src);
        // console.log(this.ifrm.src);
      }
    }
  }

  private showProperErrorMessage(res) {
    const avsCode = VantivResponseCodes.AVSInfo.filter( item => item.AVSCode === res.AVSResponseCode.trim())[0];

    if (avsCode) {
      this.toastr.error(avsCode.AVSMessage);
      this.router.navigate(['/myaccount/vantiv-payment-methods']);
      return;
    }

    const cvvInfo = VantivResponseCodes.CVVInfo.filter( item => item.CVVCode === res.CVVResponseCode.trim())[0];

    if (cvvInfo) {
      this.toastr.error(cvvInfo.CVVMessage);
      this.router.navigate(['/myaccount/vantiv-payment-methods']);
    }
  }

  getPaymentAccountId() {
    this.progressBarService.show();
    this.vantivPaymentService.OnSuccessParseDetailsForAddCardRequest().subscribe(data => {
      this.progressBarService.hide();
        this.saveRequestAndResponse();
        this.sendCustomerPaymentInsertReference();
    });
  }

  private sendCustomerPaymentInsertReference() {
    if (this.vantivPaymentService && this.vantivPaymentService.vPaymentAccountID) {
      this.progressBarService.show();
      this.customerService.customerPaymentInsert(this.vantivPaymentService.vPaymentAccountID, true, 1)
      .subscribe(res => {
        if (res && res.SuccessMessage !== '') {
          this.toastr.success(res.SuccessMessage);
          this.progressBarService.hide();
          this.saveRequestAndResponse();
          this.router.navigate(['/myaccount/vantiv-payment-methods']);
        }
      });
    }
  }
  saveRequestAndResponse() {
    this.progressBarService.show();
    this.vantivPaymentService.insertVantivRequestAndResponse().subscribe((data) => {
      if (data) {
        this.progressBarService.hide();
        console.log(data);
      }
    });
  }
}