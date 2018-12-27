import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { baseUrl } from '../../services/url-provider';
import { ProgressBarService } from '../../shared/services/progress-bar.service';
import { CustomerLogin } from '../../state/customer/customer.action';
import { Store } from '@ngrx/store';
import { CustomerLoginSession } from '../../models/customer-login-session';
// import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { AppConfigService } from '../../app-config.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private store: Store<CustomerLoginSession>,
    private progressBarService: ProgressBarService,
    // private customerService: CustomerService,
    private route: Router,
    private appConfig: AppConfigService,
    private toastr: ToastrService) { }

  createNewSession() {
    let demail = localStorage.getItem('email');
    let dpass = localStorage.getItem('password');

    if (demail && dpass) {
      demail = CryptoJS.AES.decrypt(demail, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
      dpass = CryptoJS.AES.decrypt(dpass, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
    }

    this.progressBarService.show();
    this.toastr.info('Refreshing');
    if (demail && dpass) {
      this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams(demail, dpass, 'E')));
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams()));
    }
    this.route.navigate(['/home'], { queryParams: { returnUrl: this.route.url } });
  }
}