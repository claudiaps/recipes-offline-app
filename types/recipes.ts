export type RecipeSummary = {
    id: number;
    title: string;
    image: string
}

export type RecipeSearchQuery = {
    data: {
        offset: number;
        number: number;
        results: RecipeSummary[];
        totalResults: number
    }
}

export type Ingredients = {
    id: number;
    name: string;
    original: string;
    measures: {
        metric: {
            amount: number,
            unitShort: string
        }
    }
}

export type RecipeDetails = {
    id: number;
    title: string;
    image: string
    readyInMinutes: number,
    servings: number
    extendedIngredients: Ingredients[]
    creditsText: string
}

export type RecipeDetailsQuery = {
    data: RecipeDetails
}

export type RecipeDatabase = {

}