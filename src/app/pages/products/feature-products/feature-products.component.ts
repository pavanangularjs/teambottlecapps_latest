import { Component, OnChanges, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { ProductGetListRequestPayload } from '../../../models/product-get-list-request-payload';
import { ProductGetList } from '../../../state/product-store/product-store.action';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

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

  constructor(private store: Store<ProductGetListRequestPayload>,
    private productStoreService: ProductStoreService,
    private spinnerService: Ng4LoadingSpinnerService,
    private router: Router) {

      this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        if (pssd) {
          this.storeGetHomeData = pssd;
          this.getProductsList();
          this.spinnerService.hide();
        }
      });

      this.store.select(ProductStoreSelectors.productGetListData)
        .subscribe(pgld => {
          if (pgld) {
            this.productsList = pgld ? pgld.ListProduct : [];
            this.spinnerService.hide();

            if (this.productsList.length > 0) {
              this.isNext = true;
            }
          }
        });
    }

  ngOnInit() {
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
    this.spinnerService.show();
    this.store.dispatch(new ProductGetList(
      this.productStoreService.getProductGetListParams({ categoryId: catId, pageSize: 12, isFeatured: 1})));
  }

}
