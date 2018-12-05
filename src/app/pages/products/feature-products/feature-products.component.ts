import { Component, OnChanges, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { ProductGetListRequestPayload } from '../../../models/product-get-list-request-payload';
import { ProductGetList } from '../../../state/product-store/product-store.action';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'app-feature-products',
  templateUrl: './feature-products.component.html',
  styleUrls: ['./feature-products.component.scss']
})
export class FeatureProductsComponent implements OnInit {
  // @Input() storeGetHomeData: any;
  storeGetHomeData: any;
  productsList: any;
  isFeatureProductsPage = false;
  isPrevious = false;
  isNext = false;
  currentCategoryId = '0';
  totalCount = 0;
  currentPageNo = 1;
  pageSize = 12;

  constructor(private store: Store<ProductGetListRequestPayload>,
    private productStoreService: ProductStoreService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private router: Router,
    private progressBarService: ProgressBarService) {

      this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        if (pssd) {
          this.storeGetHomeData = pssd;
          this.getProductsList();
          // this.spinnerService.hide();
          this.progressBarService.hide();
        }
      });

      this.store.select(ProductStoreSelectors.productGetListData)
        .subscribe(pgld => {
          if (pgld) {
            this.productsList = pgld ? pgld.ListProduct : [];
            this.totalCount = pgld.TotalCount;
            // this.spinnerService.hide();
            this.progressBarService.hide();

            if (this.productsList.length > 0 && this.totalCount > (this.currentPageNo * this.pageSize)) {
              this.isNext = true;
            } else {
              this.isNext = false;
            }

            if (this.productsList.length > 0 && this.currentPageNo > 1) {
              this.isPrevious = true;
            } else {
              this.isPrevious = false;
            }
          }
        });
    }

  ngOnInit() {
    this.productsList = [];
    // console.log(this.router.url);
    if (this.router.url === '/feature-products') {
      this.isFeatureProductsPage = true;
      this.onCategoryChange();
    } else {
      this.isFeatureProductsPage = false;
      this.getProductsList();
    }
  }

  getProductsList() {
    if (this.router.url === '/home') {
      this.productsList = this.storeGetHomeData ? this.storeGetHomeData.HomeList : [];
    }
  }
  /* ngOnChanges() {
    this.productsList = this.storeGetHomeData ? this.storeGetHomeData.HomeList : [];
  } */

  onCategoryChange(catId = '1,2,3,4') {
    this.currentCategoryId = catId;
    // this.spinnerService.show();
    this.progressBarService.show();
    this.store.dispatch(new ProductGetList(
      this.productStoreService.getProductGetListParams(
        { categoryId: catId, pageSize: this.pageSize, isFeatured: 1, pageNumber: this.currentPageNo})));
  }

  showMoreProducts() {
    this.currentPageNo += 1;
    this.onCategoryChange();
  }

  showPreviousProducts() {
    if (this.currentPageNo > 1) {
      this.currentPageNo -= 1;
      this.onCategoryChange();
    }
  }

}
