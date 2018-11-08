import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {

  paymentMethodList: any;
  constructor(private customerService: CustomerService,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
   this.getPaymentMethodGetList();
  }

  getPaymentMethodGetList() {
    if (this.customerService.customerPaymentMethodGetList && this.customerService.customerPaymentMethodGetList.ListPaymentItem) {
      this.paymentMethodList = this.customerService.customerPaymentMethodGetList.ListPaymentItem;
    } else {
      this.spinnerService.show();
      this.customerService.getCustomerPaymentMethodGetList().subscribe(
        data => {
          // this.paymentMethodList = data ? (data.ListPaymentItem ? data.ListPaymentItem : []) : [];
          this.spinnerService.hide();
        });
    }
  }

  addToFavorite(payment: any) {
    this.paymentMethodList.map(item => item.IsDefault = false);
    payment.IsDefault = true;
  }

}
