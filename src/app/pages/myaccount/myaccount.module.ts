import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MyAccountRoutingModule  } from './myaccount-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyAccountComponent } from './myaccount.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ManageAddressesComponent } from './manage-addresses/manage-addresses.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AddNewAddressComponent } from './manage-addresses/add-new-address/add-new-address.component';
import { AddNewPaymentComponent } from './payment-methods/add-new-payment/add-new-payment.component';

@NgModule({
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
      MyAccountComponent,
      ProfileComponent,
      ProfileEditComponent,
      ManageAddressesComponent,
      PaymentMethodsComponent,
      FavoritesComponent,
      AddNewAddressComponent,
      AddNewPaymentComponent
    ]
})
export class MyAccountModule { }
