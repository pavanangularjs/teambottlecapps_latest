import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './pages/home/homepage/homepage.component';
import { AboutusComponent } from './pages/aboutus/aboutuscomponent';
import { RecipesComponent } from './pages/recipe/recipes/recipes.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'home', component: HomepageComponent },
  { path: 'about', component: AboutusComponent },
  { path: 'recipes', component: RecipesComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
