import { RecipeDetails } from "@/types/recipes"
import { useSQLiteContext } from "expo-sqlite"

export function useRecipeDatabase() {
    const database = useSQLiteContext()

    async function create({ recipe }: { recipe: RecipeDetails }) {

        const ingredientsQuery = await database.prepareAsync(`
            INSERT OR IGNORE INTO  ingredients (id, name, original, amount, unitShort) 
                VALUES($id, $name, $original, $amount, $unitShort);
        `)

        const recipeQuery = await database.prepareAsync(`
            INSERT OR IGNORE INTO  recipes (id, title, image, readyInMinutes, servings, creditsText) 
                VALUES($id, $title, $image, $readyInMinutes, $servings, $creditsText);
        `)

        const relationQuery = await database.prepareAsync(`
            INSERT OR IGNORE INTO  ingredientsRecipes (id, ingredientId, recipeId) 
                VALUES($id, $ingredientId, $recipeId);
        `)

        try {
            await Promise.all(recipe.extendedIngredients.map(async (ingredient) => {
                await ingredientsQuery.executeAsync({
                    $id: ingredient.id,
                    $name: ingredient.name,
                    $original: ingredient.original,
                    $amount: ingredient.measures.metric.amount,
                    $unitShort: ingredient.measures.metric.unitShort
                })
            }))

            await recipeQuery.executeAsync({
                $id: recipe.id,
                $title: recipe.title,
                $image: recipe.image,
                $readyInMinutes: recipe.readyInMinutes,
                $servings: recipe.servings,
                $creditsText: recipe.creditsText,
            })

            await Promise.all(recipe.extendedIngredients.map(async (ingredient) => {
                await relationQuery.executeAsync({
                    $ingredientId: ingredient.id,
                    $recipeId: recipe.id
                })
            }))

        } catch (error) {
            console.log(error)
            throw error;
        } finally {
            await ingredientsQuery.finalizeAsync()
            await recipeQuery.finalizeAsync()
            await relationQuery.finalizeAsync()
        }
    }

    async function getRecipes() {
        try {
            const recipes = await database.getAllAsync<any>(`SELECT * FROM recipes;`)
            return recipes
        } catch (error) {
            throw error;
        }
    }

    async function getRecipeById(recipeId: number) {
        try {
            const query = "SELECT * FROM recipes WHERE id = ?"
            const response = await database.getFirstAsync<RecipeDetails>(query, [
                recipeId,
            ])
            return response
        } catch (error) {
            throw error
        }
    }

    async function getFullRecipeById(recipeId: number) {
        try {
            const recipeQuery = `SELECT * FROM  recipes WHERE id = ?`
            const ingredientsQuery = `
            SELECT *
            FROM ingredients i
            JOIN ingredientsRecipes ir ON i.id = ir.ingredientId
            WHERE ir.recipeId = ?;
`
            const recipeResponse = await database.getFirstAsync<RecipeDetails>(recipeQuery, [
                recipeId,
            ])

            const ingredientsResponse = await database.getAllAsync<any>(ingredientsQuery, [
                recipeId,
            ])

            const formatIngredients = ingredientsResponse.map(ingredient => ({
                id: ingredient.id,
                name: ingredient.name,
                original: ingredient.original,
                measures: {
                    metric: {
                        amount: ingredient.amount,
                        unitShort: ingredient.unitShort
                    }
                }
            }))

            return {
                ...recipeResponse,
                extendedIngredients: formatIngredients
            }
        } catch (error) {
            throw error
        }
    }

    return { create, getRecipes, getRecipeById, getFullRecipeById }
}