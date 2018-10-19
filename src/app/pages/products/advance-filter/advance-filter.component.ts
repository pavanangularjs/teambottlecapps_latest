import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ProductFilters } from '../../../models/product-filters';
import { Item } from '../../../models/item';
import { Store } from '@ngrx/store';

import { ProductGetListRequestPayload } from '../../../models/product-get-list-request-payload';
import { ProductGetList } from '../../../state/product-store/product-store.action';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';

@Component({
  selector: 'app-advance-filter',
  templateUrl: './advance-filter.component.html',
  styleUrls: ['./advance-filter.component.scss']
})
export class AdvanceFilterComponent implements OnInit {
  allFilterOptions: ProductFilters;
  selectedFilters: Item[] = [];
  selectedTypes: Item[] = [];
  selectedSizes: Item[] = [];
  selectedPrices: Item[] = [];
  productsList: any;
  PageSize = [20, 40, 60, 80, 100];
  SortBy = ['Price', 'Size', 'Type', 'Country', 'Region'];
  selectedPageSize = 40;

  constructor(public dataservice: DataService,
    private store: Store<ProductGetListRequestPayload>,
    private productStoreService: ProductStoreService) {
    this.store.select(ProductStoreSelectors.productGetListData)
      .subscribe(pgld => {
        this.productsList = pgld ? pgld.ListProduct : [];
      });
  }

  ngOnInit() {
    this.allFilterOptions = this.dataservice.filtersAllData;
    this.getAllSelectedFilters();
    this.getFilteredProducts();
  }

  getAllSelectedFilters() {
    this.selectedTypes = this.getSelectedFilterOptions(this.allFilterOptions.type);
    this.selectedSizes = this.getSelectedFilterOptions(this.allFilterOptions.size);
    this.selectedPrices = this.getSelectedFilterOptions(this.allFilterOptions.price);

    this.selectedFilters = [...this.selectedTypes, ...this.selectedSizes, ...this.selectedPrices];
  }

  getSelectedFilterOptions(filterType): Item[] {
    return filterType.filter(type => type.isSelected === true);
  }

  removeFilter(filter) {
    const index = this.selectedFilters.indexOf(filter);
    if (index !== -1) {
      this.selectedFilters.splice(index, 1);
    }
  }

  onPageSizeChange() {
    this.getFilteredProducts();
  }
  getFilteredProducts() {

    let types = '';
    let sizes = '';
    let minPrice = 0;
    let maxPrice = 0;

    if (this.selectedTypes && this.selectedTypes.length > 0) {
      types = this.selectedTypes.map((res: Item) => res.id).join(',');
    }
    if (this.selectedSizes && this.selectedSizes.length > 0) {
      sizes = this.selectedSizes.map((res: Item) => res.id).join(',');
    }
    if (this.selectedPrices && this.selectedPrices.length > 0) {
      const prices = this.selectedPrices.map((res: Item) => res.value);
      minPrice = +prices[0].split('-')[0].replace(/^\D+/g, '');
      maxPrice = +prices[prices.length - 1].split('-')[1].replace(/^\D+/g, '');
    }

    this.store.dispatch(new ProductGetList(
      this.productStoreService.getProductGetListParams(
        { categoryId: this.dataservice.categoryId , pageSize: this.selectedPageSize, typeId: types,
          sizeId: sizes, minPrice: minPrice, maxPrice: maxPrice }
      )));
  }

}
