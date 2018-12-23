import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthService, FacebookLoginProvider } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';

import { CustomerLogin } from '../../../state/customer/customer.action';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { CustomerLoginSession } from '../../../models/customer-login-session';
// import { CustomerService } from '../../../services/customer.service';
import { baseUrl } from '../../../services/url-provider';
import { AppConfigService } from '../../../app-config.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  formSignIn: FormGroup;
  customerSession: CustomerLoginSession;
  submitted = false;
  returnUrl: string;
  email: string;
  password: string;
  rememberMe = false;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<CustomerLoginSession>,
    // private customerService: CustomerService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private socialAuthService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private progressBarService: ProgressBarService,
    private appConfig: AppConfigService) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.customerSession = clsd;
          // this.spinnerService.hide();
          this.progressBarService.hide();
          if (this.customerSession.IsAccess === true && this.customerSession.UserId !== 0) {

            if (this.rememberMe && this.email && this.password && baseUrl) {
              const email = CryptoJS.AES.encrypt(this.email, baseUrl.substr(3)).toString();
              const password = CryptoJS.AES.encrypt(this.password, baseUrl.substr(3)).toString();

              localStorage.setItem('email', email);
              localStorage.setItem('password', password);
              localStorage.setItem('rememberMe', this.rememberMe.toString());
            }
            this.router.navigate([this.returnUrl]);
          }
        }
      });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.formSignIn = this.formBuilder.group({
      eemail: ['', [Validators.required, Validators.email]],
      epassword: ['', Validators.required],
      rememberMe: [false]
    });

    if (!(this.customerSession && this.customerSession.SessionId)) {
      let demail = localStorage.getItem('email');
      let dpass = localStorage.getItem('password');
      const rememberMe = localStorage.getItem('rememberMe');

      if (rememberMe === 'true') {
        this.rememberMe = true;
      }

      if (demail && dpass && this.rememberMe) {
        demail = CryptoJS.AES.decrypt(demail, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
        dpass = CryptoJS.AES.decrypt(dpass, baseUrl.substr(3)).toString(CryptoJS.enc.Utf8);
      }

      if (demail && dpass) {
        this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams(demail, dpass, 'E')));
      }
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.formSignIn.controls; }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) => {
      console.log(user);
      if (user) {
        this.store.dispatch(new CustomerLogin(
          this.appConfig.getLoginCustomerParams(user.email, '', 'F', user.id)));
      }

    });
  }

  onSignIn() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.formSignIn.invalid) {
      return;
    }
    // this.spinnerService.show();
    this.progressBarService.show();
    this.email = this.formSignIn.get('eemail').value;
    this.password = this.formSignIn.get('epassword').value;
    this.rememberMe = this.formSignIn.get('rememberMe').value;

    this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams(this.email, this.password, 'E')));
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

}
