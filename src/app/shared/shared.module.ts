import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './components/rating/rating.component';

import { ToastrModule } from 'ngx-toastr';

@NgModule({
imports: [
    CommonModule,
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
