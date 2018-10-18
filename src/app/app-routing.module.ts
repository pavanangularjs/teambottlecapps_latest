import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

import { HomepageComponent } from './pages/home/homepage/homepage.component';
import { AboutusComponent } from './pages/aboutus/aboutuscomponent';
import { RecipesComponent } from './pages/recipe/recipes/recipes.component';
import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';
import { EventDetailsComponent } from './pages/products/event-details/event-details.component';
import { MyAccountComponent } from './pages/myaccount/myaccount.component';
import { MyordersComponent } from './pages/myaccount/myorders/myorders.component';
import { CartComponent } from './pages/cart/cart.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'about', component: AboutusComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'event-details/:id', component: EventDetailsComponent },
  { path: 'myaccount', loadChildren: './pages/myaccount/myaccount.module#MyAccountModule' },
  { path: 'myorders', component: MyordersComponent },
  { path: '**', component: HomepageComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
