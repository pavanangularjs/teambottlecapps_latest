import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss']
})
export class FilterMenuComponent implements OnInit {
  @Input() filters: any;

  constructor() { }

  ngOnInit() {
  }

  onTypeSelected(type) {
  }
  onSizeSelected(size) {
  }
}
