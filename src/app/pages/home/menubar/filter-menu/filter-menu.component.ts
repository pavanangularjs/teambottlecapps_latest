import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { ProductFilters } from '../../../../models/product-filters';
import { Router } from '@angular/router';
import { Item } from '../../../../models/item';
import { ProductType } from '../../../../models/product-type';
@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss']
})
export class FilterMenuComponent implements OnInit {
  @Input() filters: any;
  @Output() filterApply = new EventEmitter();

  isCheckAllTypes = false;
  isCheckAllSizes = false;
  isCheckAllPrices = false;
  isCheckAllVarietals = false;

  allFilters: ProductFilters;
  priceRanges: any;
  allVarietals: any;

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

    this.allVarietals = [];
    this.getAllVarietals();
  }

  selectAllTypes(check: any) {
    this.allFilters.type.map(type => type.isSelected = check);
    this.getVarietals();
  }

  selectAllSizes(check: any) {
    this.allFilters.size.map(size => size.isSelected = check);
  }

  selectAllPrices(check: any) {
    this.allFilters.price.map(price => price.isSelected = check);
  }

  selectAllVarietals(check: any) {
    this.allVarietals.map(varietal => varietal.isSelected = check);
  }
  onSelected(type) {
    type.isSelected = !type.isSelected;
  }

  onTypeSelectionChange(type: ProductType) {
    this.getVarietals();
  }

  getVarietals() {
    this.allVarietals = [];
    this.allFilters.type.filter(type => type.isSelected === true).forEach(item => {
      this.allVarietals = [...this.allVarietals, ...item.varietals];
    });

    if (this.allFilters.type.filter(type => type.isSelected === true).length === 0) {
      this.getAllVarietals();
    }
  }
  getAllVarietals() {
    if (this.allFilters && this.allFilters.type) {
      this.allVarietals = this.allFilters.type.reduce((acc, item) => [...acc, ...item.varietals], []);
    }
  }
  applyFilter() {
    this.filterApply.emit();
    this.dataservice.searchByText = '';
    this.dataservice.categoryId = this.filters.CategoryId;
    this.dataservice.filtersAllData = this.allFilters;
    this.dataservice.allVarietals = this.allVarietals;
    this.router.navigate(['/advance-filter']);
  }

  clearAll() {
    this.selectAllTypes(false);
    this.selectAllSizes(false);
    this.selectAllPrices(false);
    this.selectAllVarietals(false);
    this.isCheckAllTypes = false;
    this.isCheckAllSizes = false;
    this.isCheckAllPrices = false;
    this.isCheckAllVarietals = false;
  }
}
