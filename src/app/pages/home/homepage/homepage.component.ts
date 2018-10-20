import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CustomerLoginSession } from '../../../models/customer-login-session';
import { CustomerLogin } from '../../../state/customer/customer.action';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { CustomerService } from '../../../services/customer.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  customerSession: CustomerLoginSession;
  storeGetHomeData: any;

  constructor(private store: Store<CustomerLoginSession>, private customerService: CustomerService,
    private cartService: CartService) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        this.customerSession = clsd;
      });
    this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        this.storeGetHomeData = pssd;
        this.updateCartId();
      });
  }

  ngOnInit() {
    if (!(this.customerSession && this.customerSession.SessionId)) {
      this.store.dispatch(new CustomerLogin(this.customerService.getLoginCustomerParams()));
    }
  }

  updateCartId() {
    if (this.storeGetHomeData && this.storeGetHomeData.CustomerInfo && this.storeGetHomeData.CustomerInfo.CartId) {
      this.cartService.cartId = this.storeGetHomeData.CustomerInfo.CartId;
    }
  }

}
