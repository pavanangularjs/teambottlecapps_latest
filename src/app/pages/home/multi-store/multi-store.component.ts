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
  tempStores: any;

  constructor() {

  }

  ngOnInit() {
  }

  onStoreSelect(storeId: number) {
    this.storeChange.emit(storeId);
  }

  filterBySearchText() {
    if (this.stores && !this.tempStores) {
      this.tempStores = this.stores.map(obj => {
        const rObj = {
          'Address1': obj.Address1,
          'Address2': obj.Address2,
          'City': obj.City,
          'Phone': obj.Phone,
          'State': obj.State,
          'ContactNo': obj.ContactNo,
          'StoreName': obj.StoreName,
          'Zip': obj.Zip
        };
        return rObj;
      });
    }
    console.log(this.searchText);

    this.stores = this.tempStores;
    this.stores = this.stores.filter(item =>
      Object.keys(item).some(k => item[k] != null &&
        item[k].toString().toLowerCase()
          .includes(this.searchText.toLowerCase()))
    );
  }

}
