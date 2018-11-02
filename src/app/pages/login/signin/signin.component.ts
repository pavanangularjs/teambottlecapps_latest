import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthService, FacebookLoginProvider } from 'angularx-social-login';

import { CustomerLogin } from '../../../state/customer/customer.action';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { CustomerLoginSession } from '../../../models/customer-login-session';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  formSignIn: FormGroup;
  customerSession: CustomerLoginSession;
  submitted = false;

  constructor(private router: Router, private store: Store<CustomerLoginSession>,
    private customerService: CustomerService,
    private spinnerService: Ng4LoadingSpinnerService,
    private socialAuthService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.customerSession = clsd;
          this.spinnerService.hide();
          if (this.customerSession.IsAccess === true && this.customerSession.UserId !== 0) {
            this.router.navigate(['/']);
          }
        }
      });
  }

  ngOnInit() {
    this.formSignIn = this.formBuilder.group({
      eemail: ['', [Validators.required, Validators.email]],
      epassword: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.formSignIn.controls; }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) => {
      console.log(user);
      if (user) {
        this.store.dispatch(new CustomerLogin(
          this.customerService.getLoginCustomerParams(user.email, '', 'F', user.id)));
      }

    });
  }

  onSignIn() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.formSignIn.invalid) {
      return;
    }
    this.spinnerService.show();
    const email = this.formSignIn.get('eemail').value;
    const password = this.formSignIn.get('epassword').value;

    this.store.dispatch(new CustomerLogin(this.customerService.getLoginCustomerParams(email, password, 'E')));
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

}
