import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { ProductGetListRequestPayload } from '../../../models/product-get-list-request-payload';
import { ProductGetList } from '../../../state/product-store/product-store.action';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { CartService } from '../../../services/cart.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  productsList: any[];
  constructor(private store: Store<ProductGetListRequestPayload>,
    private productStoreService: ProductStoreService,
    private cartService: CartService,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService) {
    this.store.select(ProductStoreSelectors.productGetListData)
      .subscribe(pgld => {
        this.productsList = pgld ? pgld.ListProduct : [];
        this.spinnerService.hide();
      });
  }

  ngOnInit() {
    this.productsList = [];
    this.spinnerService.show();
    this.store.dispatch(new ProductGetList(this.productStoreService.getProductGetListParams({ isFavorite: 1 })));
  }

  favoriteProductUpdate(item: any, status: boolean) {
    this.spinnerService.show();
    this.productStoreService.favoriteProductUpdate(item.PID, status).subscribe(
      (data: any) => {
        item.IsFavorite = data.IsFavorite;
        this.spinnerService.hide();
        this.toastr.success(data.SuccessMessage);
        this.store.dispatch(new ProductGetList(this.productStoreService.getProductGetListParams({ isFavorite: 1 })));
      });
  }

  addToCart(item: any) {
    this.spinnerService.show();
    this.cartService.addToCard(item.PID, 1).subscribe(
      (data: any) => {
        item.InCart = 1;
        this.spinnerService.hide();
        this.toastr.success(data.SuccessMessage);
      });
  }

  removeFromCart(item: any) {
    this.spinnerService.show();
    this.cartService.removeFromCart(item.PID).subscribe(
      (data: any) => {
        item.InCart = 0;
        this.spinnerService.hide();
        this.toastr.success(data.SuccessMessage);
      });
  }
  getCount(n: number): any[] {
    return Array(n);
  }

}
