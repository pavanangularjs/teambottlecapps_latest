import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { ProductFilters } from '../../../../models/product-filters';
import { Router } from '@angular/router';
import { Item } from '../../../../models/item';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss']
})
export class FilterMenuComponent implements OnInit {
  @Input() filters: any;

  isCheckAllTypes = false;
  isCheckAllSizes = false;
  isCheckAllPrices = false;

  allFilters: ProductFilters;
  priceRanges: any;

  constructor(public dataservice: DataService, private router: Router) {
    this.allFilters = {
      size: [],
      type: [],
      price: [],
      countries: []
    };
  }

  ngOnInit() {
    this.dataservice.categoryId = this.filters.CategoryId;
    this.dataservice.getFiltersByCategory();
    this.allFilters = this.dataservice.filtersAllData;
    this.priceRanges = this.dataservice.priceRanges;
  }

  selectAllTypes(event: any, check: any) {
    this.allFilters.type.map(type => type.isSelected = check);
  }

  selectAllSizes(event: any, check: any) {
    this.allFilters.size.map(size => size.isSelected = check);
  }

  selectAllPrices(event: any, check: any) {
    this.allFilters.price.map(price => price.isSelected = check);
  }
  onSelected(type) {
    type.isSelected = !type.isSelected;
  }

  applyFilter() {
    this.dataservice.searchByText = '';
    this.dataservice.categoryId = this.filters.CategoryId;
    this.dataservice.filtersAllData = this.allFilters;
    this.router.navigate(['/advance-filter']);
  }
}
