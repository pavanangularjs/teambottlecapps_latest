import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CustomerLoginSession } from '../../../models/customer-login-session';
import { CustomerLogin } from '../../../state/customer/customer.action';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { CustomerService } from '../../../services/customer.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  @ViewChild('openModal') openModal: ElementRef;

  customerSession: CustomerLoginSession;
  storeGetHomeData: any;

  constructor(private store: Store<CustomerLoginSession>, private customerService: CustomerService) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        this.customerSession = clsd;
      });
      this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        this.storeGetHomeData = pssd;
      });
  }

  ngOnInit() {
    this.openModal.nativeElement.click();
    this.store.dispatch(new CustomerLogin (this.customerService.getLoginCustomerParams()));
  }

}
