import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ProductFilters } from '../../../models/product-filters';

@Component({
  selector: 'app-advance-filter',
  templateUrl: './advance-filter.component.html',
  styleUrls: ['./advance-filter.component.scss']
})
export class AdvanceFilterComponent implements OnInit {
  allFilterOptions: ProductFilters;
  constructor(public dataservice: DataService) { }

  ngOnInit() {
    this.allFilterOptions = this.dataservice.filtersAllData;
  }

  isSelected(item) {
    //this.selectedFilters.type.filter(p => p.TypeId === item.TypeId)
  }

}
