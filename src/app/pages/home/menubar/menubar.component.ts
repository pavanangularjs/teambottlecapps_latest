import { Component, OnChanges, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { DataService } from '../../../services/data.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent {
  storeGetHomeData: any;

  menuItems = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ];

  filterMenuItems = [];
  receipeMenuItem: any;
  couponMenuItem: any;

  constructor(private store: Store<any>, private router: Router, public dataservice: DataService) {
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

  onFeatureProductsSelect() {
    this.dataservice.searchByText = '';
    // this.dataservice.categoryId = '1,2,3,4';
    this.dataservice.isFeatureProduct = 1;
    this.router.navigate(['/advance-filter']);
  }
}

