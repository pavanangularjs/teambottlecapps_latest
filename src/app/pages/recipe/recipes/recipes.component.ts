import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../services/recipe.service';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  recipeList: any[];

  constructor(private router: Router,
    private recipeService: RecipeService,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.spinnerService.show();
    this.getRecipes();
  }

  getRecipes() {
    if (this.recipeService.recipesList) {
      this.recipeList = this.recipeService.recipesList;
    } else {
    this.recipeService.getRecipeList().subscribe(
      (data: any) => {
        this.recipeList = data ? (data.ListRecipe ? data.ListRecipe : []) : [];
        this.spinnerService.hide();
      });
    }
  }

  onRecipeSelection(recipe: any) {
    // routerLink="/recipe-details/{{recipe.RecipeId}}"
    this.recipeService.selectedRecipe = recipe;
    this.router.navigate([`/recipe-details/${recipe.RecipeId}`]);
  }
}
