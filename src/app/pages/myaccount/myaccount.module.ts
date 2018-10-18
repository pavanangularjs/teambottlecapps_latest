import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAccountRoutingModule  } from './myaccount-routing.module';

import { MyAccountComponent } from './myaccount.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ManageAddressesComponent } from './manage-addresses/manage-addresses.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';

@NgModule({
  imports: [
    CommonModule,
    MyAccountRoutingModule
  ],
  declarations: [
      MyAccountComponent,
      ProfileComponent,
      ProfileEditComponent,
      ManageAddressesComponent,
      PaymentMethodsComponent
    ]
})
export class MyAccountModule { }
