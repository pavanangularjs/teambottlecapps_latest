import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MyAccountModule } from './pages/myaccount/myaccount.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
// import {  SharedModule } from './shared/shared.module';

import { customerReducer  } from './state/customer/customer.reducer';
import { CustomerEffects } from './state/customer/customer.effects';
import { CustomerActions } from './state/customer/customer.action';
import { productStoreReducer  } from './state/product-store/product-store.reducer';
import { ProductStoreEffects } from './state/product-store/product-store.effects';
import { ProductStoreActions } from './state/product-store/product-store.action';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/home/header/header.component';
import { FooterComponent } from './pages/home/footer/footer.component';
import { HomepageComponent } from './pages/home/homepage/homepage.component';
import { AboutusComponent } from './pages/aboutus/aboutuscomponent';
import { LoginComponent } from './pages/login/login.component';
import { SigninComponent } from './pages/login/signin/signin.component';
import { SignupComponent } from './pages/login/signup/signup.component';
import { FeatureProductsComponent } from './pages/products/feature-products/feature-products.component';
import { MenubarComponent } from './pages/home/menubar/menubar.component';
import { HomecauroselComponent } from './pages/home/homecaurosel/homecaurosel.component';
import { DownloadappComponent } from './pages/home/downloadapp/downloadapp.component';
import { AgelimitComponent } from './pages/agelimit/agelimit.component';
import { RecipesComponent } from './pages/recipe/recipes/recipes.component';
import { RecipeDetailsComponent } from './pages/recipe/recipe-details/recipe-details.component';
import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';
import { FilterMenuComponent } from './pages/home/menubar/filter-menu/filter-menu.component';
import { SearchBarComponent } from './pages/home/menubar/search-bar/search-bar.component';
import { ProductComponent } from './pages/products/product/product.component';
import { EventDetailsComponent } from './pages/products/event-details/event-details.component';
// import { MyAccountComponent } from './pages/myaccount/myaccount.component';
import { MyOrdersComponent } from './pages/myaccount/myorders/myorders.component';
import { CartComponent } from './pages/cart/cart.component';
import { AdvanceFilterComponent } from './pages/products/advance-filter/advance-filter.component';

import { CustomerService } from './services/customer.service';
import { ProductStoreService } from './services/product-store.service';
import { DataService } from './services/data.service';

import { HttpCacheService } from './cache.service';
import { CacheInterceptor } from './cacheInterceptor';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CheckoutAddressComponent } from './pages/checkout/checkout-address/checkout-address.component';
import { CheckoutPaymentMethodComponent } from './pages/checkout/checkout-payment-method/checkout-payment-method.component';
import { CheckoutProductsComponent } from './pages/checkout/checkout-products/checkout-products.component';
import { ProductReviewComponent } from './pages/products/product-details/product-review/product-review.component';
import { ProductAddReviewComponent } from './pages/products/product-details/product-add-review/product-add-review.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    AboutusComponent,
    LoginComponent,
    SigninComponent,
    SignupComponent,
    FeatureProductsComponent,
    MenubarComponent,
    HomecauroselComponent,
    DownloadappComponent,
    AgelimitComponent,
    FilterMenuComponent,
    SearchBarComponent,
    ProductComponent,
    RecipesComponent,
    RecipeDetailsComponent,
    ProductDetailsComponent,
    EventDetailsComponent,
    // MyAccountComponent,
    MyOrdersComponent,
    CartComponent,
    AdvanceFilterComponent,
    CheckoutComponent,
    CheckoutAddressComponent,
    CheckoutPaymentMethodComponent,
    CheckoutProductsComponent,
    ProductReviewComponent,
    ProductAddReviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
   // SharedModule,
    MyAccountModule,
    StoreModule.forRoot({customer: customerReducer, productStore: productStoreReducer }),
    EffectsModule.forRoot([CustomerEffects, ProductStoreEffects]),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [CustomerService, ProductStoreService, DataService],
    // HttpCacheService, { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
