import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { CustomerLoginSession } from '../../../models/customer-login-session';
import { CustomerLogin } from '../../../state/customer/customer.action';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { CustomerService } from '../../../services/customer.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { CartService } from '../../../services/cart.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
import * as CryptoJS from 'crypto-js';
import { baseUrl } from '../../../services/url-provider';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  customerSession: CustomerLoginSession;
  storeGetHomeData: any;
  returnUrl: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private store: Store<CustomerLoginSession>,
    private customerService: CustomerService,
    private cartService: CartService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private titleService: Title,
    private progressBarService: ProgressBarService) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        this.customerSession = clsd;
        this.progressBarService.hide();
      });
    this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        if (pssd) {
          this.storeGetHomeData = pssd;
          this.titleService.setTitle(this.storeGetHomeData.StoreName);
          this.updateCartId();
          if (this.returnUrl && this.returnUrl !== '/' && this.returnUrl !== '/home') {
            this.router.navigate([this.returnUrl]);
          }
        }
      });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (!(this.customerSession && this.customerSession.SessionId)) {
      // this.spinnerService.show();

      let demail = localStorage.getItem('email');
      let dpass = localStorage.getItem('password');

      if (demail && dpass) {
        demail = CryptoJS.AES.decrypt(demail, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
        dpass = CryptoJS.AES.decrypt(dpass, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
      }

      this.progressBarService.show();
      if (demail && dpass) {
        this.store.dispatch(new CustomerLogin(this.customerService.getLoginCustomerParams(demail, dpass, 'E')));
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        this.store.dispatch(new CustomerLogin(this.customerService.getLoginCustomerParams()));
      }
    }
  }

  updateCartId() {
    if (this.storeGetHomeData && this.storeGetHomeData.CustomerInfo && this.storeGetHomeData.CustomerInfo.CartId) {
      this.cartService.cartId = this.storeGetHomeData.CustomerInfo.CartId;
      this.cartService.cartItemCount.next(this.storeGetHomeData.CustomerInfo.CartItemCount);
    }
  }

}
