import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agelimit',
  templateUrl: './agelimit.component.html',
  styleUrls: ['./agelimit.component.scss']
})
export class AgelimitComponent implements OnInit {
  sorryPopup = false;
  constructor() { }

  ngOnInit() {
  }

  onAgeVarify() {
    localStorage.setItem('isAgeVerified', 'true');
  }
}
