import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { ProductGetListRequestPayload } from '../../../models/product-get-list-request-payload';
import { ProductGetList } from '../../../state/product-store/product-store.action';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  productsList: any[];
  constructor(private store: Store<ProductGetListRequestPayload>, private productStoreService: ProductStoreService) {
    this.store.select(ProductStoreSelectors.productGetListData)
      .subscribe(pgld => {
        this.productsList = pgld ? pgld.ListProduct : [];
      });
  }

  ngOnInit() {
    this.store.dispatch(new ProductGetList(this.productStoreService.getProductGetListParams({ isFavorite : 1 })));
  }
  
  getCount(n: number): any[] {
    return Array(n);
  }

}
