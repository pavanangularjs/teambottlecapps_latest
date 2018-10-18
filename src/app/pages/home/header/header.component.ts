import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { CustomerLoginSession } from '../../../models/customer-login-session';
import { CustomerSelectors } from '../../../state/customer/customer.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  customerSession: CustomerLoginSession;

  constructor(private store: Store<CustomerLoginSession>) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        this.customerSession = clsd;
      });
  }

  ngOnInit() {
  }

}
