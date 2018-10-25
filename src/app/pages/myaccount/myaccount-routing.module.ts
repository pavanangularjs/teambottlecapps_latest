import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyAccountComponent } from './myaccount.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ManageAddressesComponent } from './manage-addresses/manage-addresses.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AddNewAddressComponent } from './manage-addresses/add-new-address/add-new-address.component';

const routes: Routes = [
    {
        path: '',
        component: MyAccountComponent,
        children: [
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            { path: 'profile', component: ProfileComponent },
            { path: 'manage-addresses', component: ManageAddressesComponent },
            { path: 'payment-methods', component: PaymentMethodsComponent },
            { path: 'favorites', component: FavoritesComponent },
            { path: 'add-new-address', component: AddNewAddressComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyAccountRoutingModule { }
