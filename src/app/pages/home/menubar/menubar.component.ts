import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { DataService } from '../../../services/data.service';

// const menuOptions = require('../../../shared/store-filters.json');
import * as menuOptions from '../../../shared/store-filters.json';
@Component({
  selector: 'app-menu',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {
  storeGetHomeData: any;

  menuItems = [
    /* { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }, */
    { name: 'Featured Products', url: '/feature-products' }
  ];

  filterMenuItems: any;
  receipeMenuItem: any;
  couponMenuItem: any;

  constructor(private store: Store<any>, private router: Router, public dataservice: DataService) {
    /*this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        this.storeGetHomeData = pssd;
        this.updateMenuItems();
      });*/
   }

   ngOnInit() {
    this.updateMenuItems();
   }

  updateMenuItems() {

    if (menuOptions && menuOptions['StoreFilters']) {
      /*menuOptions.StoreFilters.forEach(element => {
        this.filterMenuItems.push({ name: element.CategoryName });
      });*/
      this.filterMenuItems = menuOptions['StoreFilters'];
    }

    if (menuOptions && menuOptions['IsRecipes'] !== undefined) {
      if (menuOptions['IsRecipes']) {
        this.receipeMenuItem = { name: 'Recipes', url: '/recipes' };
      }
    } else {
      this.receipeMenuItem = { name: 'Recipes', url: '/recipes' };
    }
    if (menuOptions && menuOptions['IsCouponAvailable'] !== undefined) {
      if (menuOptions['IsCouponAvailable']) {
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

