import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-homecaurosel',
  templateUrl: './homecaurosel.component.html',
  styleUrls: ['./homecaurosel.component.scss']
})
export class HomecauroselComponent implements OnInit {
@Input() eventList: any;

  constructor() { }

  ngOnInit() {
  }

}
