import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  cacheUpdated = new Subject<any>();

  constructor() { }

  onCacheUpdated() {
    this.cacheUpdated.next();
  }
}
