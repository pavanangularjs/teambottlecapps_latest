import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss']
})
export class MyAccountComponent implements OnInit {
  selectedOption: string;

  constructor() { }

  ngOnInit() {
  }

  onOptionSelected(option: string) {
    this.selectedOption = option;
  }
}
