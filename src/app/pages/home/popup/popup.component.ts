import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CustomerLoginSession } from '../../../models/customer-login-session';
import { CustomerLogin } from '../../../state/customer/customer.action';
import { CustomerSelectors } from '../../../state/customer/customer.selector';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { AppConfigService } from '../../../app-config.service';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';
import { ProductStoreService } from '../../../services/product-store.service';
import { SessionService } from '../../../shared/services/session.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @ViewChild('myModalBtn') myModalBtn: ElementRef;
  isAgeVerified = false;
  currentStoreId = 0;
  storeList: any;

  constructor(private router: Router,
    private store: Store<CustomerLoginSession>,
    private appConfig: AppConfigService,
    private progressBarService: ProgressBarService,
    private storeService: ProductStoreService,
    private sessionService: SessionService,
    private commonService: CommonService) {

    this.store.select(CustomerSelectors.customerLoginSessionData)
    .subscribe(clsd => {
      if (clsd) {
        this.getStoreList();
      }
    });

  }

  ngOnInit() {
    this.store.dispatch(new CustomerLogin(this.appConfig.getLoginCustomerParams()));

    if (localStorage.getItem('isAgeVerified') === 'true') {
      this.isAgeVerified = true;
    }

    if (localStorage.getItem('storeId')) {
      this.currentStoreId = +localStorage.getItem('storeId');
    }
  }

  onAgeVerified(data) {
    this.isAgeVerified = data;

    if (this.isAgeVerified && this.currentStoreId !== 0) {
      this.commonService.onCacheUpdated();
      // this.sessionService.createNewSession();

      this.myModalBtn.nativeElement.click();
    }
  }

  getStoreList() {
    this.progressBarService.show();
    this.storeService.storeGetList().subscribe(data => {
      if (data && data.ListStore) {
        this.currentStoreId = data.StoreId;

        const sList = data.ListStore;
        const fromIndex = sList.findIndex(item => item.StoreId === this.currentStoreId);

        if (fromIndex !== -1) {
          const element = sList[fromIndex];
          sList.splice(fromIndex, 1);
          sList.splice(0, 0, element);
        }

        this.storeList = sList;
        this.progressBarService.hide();
      }
    });
  }

  onStoreSelect(storeId: number) {
    this.currentStoreId = storeId;
    // this.storeChange.emit(storeId);
  }
  onStoreSelectConfirm() {
    localStorage.setItem('storeId', this.currentStoreId.toString());
    this.appConfig.storeID = this.currentStoreId;
    this.sessionService.createNewSession();
    this.commonService.onCacheUpdated();
  }
}
