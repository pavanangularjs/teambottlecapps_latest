import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { CustomerLogin } from '../../../state/customer/customer.action';
import { CustomerLoginSession } from '../../../models/customer-login-session';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { CustomerService } from '../../../services/customer.service';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  customerSession: CustomerLoginSession;
  storeGetHomeData: any;
  cartItemCount = 0;
  isActive = false;
  profileFirstLetter = '';
  profilePic = 'assets/Images/profile.png';

  constructor(private store: Store<CustomerLoginSession>,
    private customerService: CustomerService,
    private cartService: CartService,
    private router: Router) {
    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        this.customerSession = clsd;

        if (this.customerSession  && this.customerSession.UserId !== 0) {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
      });
    this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        if (pssd) {
          this.storeGetHomeData = pssd;

          if (this.storeGetHomeData.CustomerInfo && this.storeGetHomeData.CustomerInfo.ProfileImage !== '') {
            this.profilePic = this.storeGetHomeData.CustomerInfo.ProfileImage;
          } else if (this.storeGetHomeData.CustomerInfo && this.storeGetHomeData.CustomerInfo.FirstName) {
            this.profileFirstLetter = this.storeGetHomeData.CustomerInfo.FirstName.substr(0, 1);
          } else if (this.storeGetHomeData.CustomerInfo && this.storeGetHomeData.CustomerInfo.EmailId) {
            this.profileFirstLetter = this.storeGetHomeData.CustomerInfo.EmailId.substr(0, 1);
          }
        }

      });

    this.cartService.cartItemCount.subscribe((data) => {
      this.cartItemCount = data;
    });
  }

  ngOnInit() {
  }


  onSignOut() {
    this.store.dispatch(new CustomerLogin(this.customerService.getLoginCustomerParams()));
    this.router.navigate(['/']);
  }
}
