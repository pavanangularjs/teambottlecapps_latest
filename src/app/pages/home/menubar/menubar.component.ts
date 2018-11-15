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
  eventsMenuItem: any;
  eventsList: any;

  constructor(private store: Store<any>, private router: Router, public dataservice: DataService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.store.select(ProductStoreSelectors.productStoreStateData)
      .subscribe(pssd => {
        this.storeGetHomeData = pssd;
        if (pssd && pssd.EventList) {
          this.eventsList = pssd.EventList;
        }
      });
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

    this.eventsMenuItem = { name: 'Events', url: '/events' };
  }

  showProducts(catId) {
    this.dataservice.searchByText = '';
    this.dataservice.categoryId = catId;
    this.dataservice.getFiltersByCategory();
    this.router.navigate(['/advance-filter']);
  }
}

