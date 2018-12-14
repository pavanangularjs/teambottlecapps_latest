import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { DeviceDetectorService } from 'ngx-device-detector';

import { CustomerLogin } from '../../../state/customer/customer.action';
import { CustomerLoginSession } from '../../../models/customer-login-session';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { CustomerService } from '../../../services/customer.service';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
import * as CryptoJS from 'crypto-js';
import { baseUrl } from '../../../services/url-provider';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('openMultiLocationModal') openModal: ElementRef;
  customerSession: CustomerLoginSession;
  storeGetHomeData: any;
  cartItemCount = 0;
  isActive = false;
  profileFirstLetter = '';
  profilePic = 'assets/Images/profile.png';
  storeList: any;
  isMobile: boolean;
  storeDetails: any;

  constructor(private store: Store<CustomerLoginSession>,
    private customerService: CustomerService,
    private cartService: CartService,
    private router: Router,
    private storeService: ProductStoreService,
    private progressBarService: ProgressBarService,
    private deviceService: DeviceDetectorService) {

    this.store.select(CustomerSelectors.customerLoginSessionData)
      .subscribe(clsd => {
        if (clsd) {
          this.customerSession = clsd;
          this.progressBarService.hide();

          if (this.customerSession && this.customerSession.UserId !== 0) {
            this.isActive = true;
          } else {
            this.isActive = false;
          }
        }
      });
    this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        if (pssd) {
          this.storeGetHomeData = pssd;
          this.getStoreDetails();
          this.getStoreList();

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
    this.isMobile = this.deviceService.isMobile();
  }

  openMultiLocationDialog() {
    this.openModal.nativeElement.click();
  }

  getStoreList() {
    this.progressBarService.show();
    this.storeService.storeGetList().subscribe(data => {
      if (data && data.ListStore) {
        this.storeList = data.ListStore;
        this.progressBarService.hide();
      }
    });
  }

  getStoreDetails() {
    this.storeService.getStoreDetails().subscribe(data => {
      if (data && data.GetStoredetails) {
        this.storeDetails = data.GetStoredetails;
      }
    });
  }

  onStoreChange(storeId) {
    this.customerService.storeID = storeId;

    if (this.customerSession && this.customerSession.SessionId) {
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

  onSignOut() {
    localStorage.clear();
    // localStorage.removeItem(key);  for removing a single item
    location.reload();
    this.store.dispatch(new CustomerLogin(this.customerService.getLoginCustomerParams()));
    this.router.navigate(['/']);
  }
}
