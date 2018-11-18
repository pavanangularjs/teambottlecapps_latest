import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agelimit',
  templateUrl: './agelimit.component.html',
  styleUrls: ['./agelimit.component.scss']
})
export class AgelimitComponent implements OnInit {
  sorryPopup = false;
  legalDate: Date;
  constructor() { }

  ngOnInit() {
    this.legalDate = new Date(new Date().getFullYear() - 21, new Date().getMonth(), new Date().getDate());
  }

  onAgeVarify() {
    localStorage.setItem('isAgeVerified', 'true');
  }
}
