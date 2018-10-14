import { Component, OnChanges, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';

@Component({
  selector: 'app-menu',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent {
  storeGetHomeData: any;

  menuItems = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Feature Products', url: '/feature-products' }
  ];

  filterMenuItems = [];
  receipeMenuItem: any;
  couponMenuItem: any;

  constructor(private store: Store<any>) {
    this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        this.storeGetHomeData = pssd;
        this.updateMenuItems();
      });
   }

  updateMenuItems() {

    if (this.storeGetHomeData && this.storeGetHomeData.StoreFilters) {
      this.storeGetHomeData.StoreFilters.forEach(element => {
        this.filterMenuItems.push({ name: element.CategoryName });
      });
    }

    if (this.storeGetHomeData && this.storeGetHomeData.IsRecipes !== undefined) {
      if (this.storeGetHomeData.IsRecipes) {
        this.receipeMenuItem = { name: 'Recipes', url: '/recipes' };
      }
    } else {
      this.receipeMenuItem = { name: 'Recipes', url: '/recipes' };
    }
    if (this.storeGetHomeData && this.storeGetHomeData.IsCouponAvailable !== undefined) {
      if (this.storeGetHomeData.IsCouponAvailable) {
        this.couponMenuItem = { name: 'Coupons', url: '/coupons' };
      }
    }
  }
}

