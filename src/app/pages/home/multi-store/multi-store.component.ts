import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-multi-store',
  templateUrl: './multi-store.component.html',
  styleUrls: ['./multi-store.component.scss']
})
export class MultiStoreComponent implements OnInit {
  @Input() stores: any;
  @Output() storeChange = new EventEmitter<number>();
  searchText: string;

  constructor() { }

  ngOnInit() {
  }

  onStoreSelect(storeId: number) {
    this.storeChange.emit(storeId);
  }

}
