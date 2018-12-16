import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-homecaurosel',
  templateUrl: './homecaurosel.component.html',
  styleUrls: ['./homecaurosel.component.scss']
})
export class HomecauroselComponent implements OnInit {
@Input() eventList: any;
isShowFilters = false;
categoryFilters: any;

  constructor() { }

  ngOnInit() {
  }

  showFilters(categoryId) {
    this.isShowFilters = true;
    this.categoryFilters = { 'CategoryId': categoryId};
  }
  onApplyFilter() {
    this.isShowFilters = false;
  }
}
