import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
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

import { CustomerService } from './services/customer.service';
import { ProductStoreService } from './services/product-store.service';

import { HttpCacheService } from './cache.service';
import { CacheInterceptor } from './cacheInterceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    AboutusComponent,
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
    ProductDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({customer: customerReducer, productStore: productStoreReducer }),
    EffectsModule.forRoot([CustomerEffects, ProductStoreEffects]),
  ],
  providers: [CustomerService, ProductStoreService,
    HttpCacheService, { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
