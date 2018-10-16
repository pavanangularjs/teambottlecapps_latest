import { Component, OnChanges, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { ProductGetListRequestPayload } from '../../../models/product-get-list-request-payload';
import { ProductGetList } from '../../../state/product-store/product-store.action';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';

@Component({
  selector: 'app-feature-products',
  templateUrl: './feature-products.component.html',
  styleUrls: ['./feature-products.component.scss']
})
export class FeatureProductsComponent implements OnChanges {
  @Input() storeGetHomeData: any;
  productsList: any;

  constructor(private store: Store<ProductGetListRequestPayload>, private productStoreService: ProductStoreService) {


    this.store.select(ProductStoreSelectors.productGetListData)
      .subscribe(pgld => {
        this.productsList = pgld ? pgld.ListProduct : [];
      });
   }

  ngOnChanges() {
    this.productsList = this.storeGetHomeData ? this.storeGetHomeData.HomeList : [];
  }

  onCategoryChange(catId: number) {
    this.store.dispatch(new ProductGetList(this.productStoreService.getProductGetListParams({categoryId: catId})));
  }

}
