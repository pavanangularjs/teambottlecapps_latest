import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { CustomerLoginSession } from '../../../models/customer-login-session';
import { CustomerLogin } from '../../../state/customer/customer.action';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { CartService } from '../../../services/cart.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
import * as CryptoJS from 'crypto-js';
import { baseUrl } from '../../../services/url-provider';
import { AppConfigService } from '../../../app-config.service';

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
    private cartService: CartService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private titleService: Title,
    private progressBarService: ProgressBarService,
    private appConfig: AppConfigService) {
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

      let demail = sessionStorage.getItem('email');
      let dpass = sessionStorage.getItem('password');

      if (demail && dpass) {
        demail = CryptoJS.AES.decrypt(demail, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
        dpass = CryptoJS.AES.decrypt(dpass, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
      } else {
        demail = localStorage.getItem('email');
        dpass = localStorage.getItem('password');

        demail = CryptoJS.AES.decrypt(demail, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
        dpass = CryptoJS.AES.decrypt(dpass, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
      }

      this.progressBarService.show();
      if (demail && dpass) {
        this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams(demail, dpass, 'E')));
      } else {
        /* sessionStorage.removeItem('email');
        sessionStorage.removeItem('password');

        localStorage.removeItem('email');
        localStorage.removeItem('password'); */
        this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams()));
      }
    }
  }

  updateCartId() {
    if (this.storeGetHomeData && this.storeGetHomeData.CustomerInfo && this.storeGetHomeData.CustomerInfo.CartId >= 0) {
      this.cartService.cartId = this.storeGetHomeData.CustomerInfo.CartId;
      this.cartService.cartItemCount.next(this.storeGetHomeData.CustomerInfo.CartItemCount);
    }
  }

}
