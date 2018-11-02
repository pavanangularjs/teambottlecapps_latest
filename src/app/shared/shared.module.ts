import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './components/rating/rating.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({positionClass: 'toast-top-right'})
],
declarations: [
    RatingComponent
],
exports: [
    RatingComponent
]
})
export class SharedModule {}
