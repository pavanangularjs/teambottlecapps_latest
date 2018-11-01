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
  priceRanges = [
    { 'id': '1', 'name': '$0 - $10' },
    { 'id': '2', 'name': '$10 - $25' },
    { 'id': '3', 'name': '$25 - $50' },
    { 'id': '4', 'name': '$50 - $100' },
    { 'id': '5', 'name': '$100 & Above' }
  ];

  constructor(public dataservice: DataService, private router: Router) {
    this.allFilters = {
      size: [],
      type: [],
      price: [],
      countries: []
    };
  }

  ngOnInit() {
    this.getAllFilters();
  }

  getAllFilters() {
    if (!this.filters && !this.filters.ListType) {
      this.allFilters.type = [];
    }
    this.filters.ListType.forEach(element => {
      this.allFilters.type.push({ id: element.TypeId, value: element.TypeName, isSelected: false });
    });

    if (!this.filters && !this.filters.ListSize) {
      this.allFilters.size = [];
    }
    this.filters.ListSize.forEach(element => {
      this.allFilters.size.push({ id: element.SizeId, value: element.UnitSize, isSelected: false });
    });

    this.priceRanges.forEach(element => {
      this.allFilters.price.push({ id: element.id, value: element.name, isSelected: false });
    });

    if (!this.filters && !this.filters.ListSize) {
      this.allFilters.size = [];
    }
    this.filters.ListCountries.forEach(country => {
      let listOfRegions: Item[] = [];

      if (!country.ListRegions) {
        listOfRegions = [];
      }
      country.ListRegions.forEach(element => {
        listOfRegions.push({ id: element.RegionId, value: element.RegionName, isSelected: false });
      });
      this.allFilters.countries.push({ id: country.CountryId, value: country.CountryName, isSelected: false, regions: listOfRegions });
    });
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
