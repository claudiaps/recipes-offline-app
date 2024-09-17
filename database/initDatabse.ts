import { SQLiteDatabase } from "expo-sqlite";

export async function initDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS ingredients (
            id INTEGER NOT NULL PRIMARY KEY,
            name TEXT,
            original TEXT,
            amount REAL,
            unitShort TEXT
        );

        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER NOT NULL PRIMARY KEY,
            title TEXT,
            image TEXT,
            readyInMinutes INTEGER,
            servings INTEGER,
            creditsText TEXT
        );

        CREATE TABLE IF NOT EXISTS ingredientsRecipes (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            ingredientId INTEGER NOT NULL,
            recipeId INTEGER NOT NULL,
            FOREIGN KEY(ingredientId) REFERENCES ingredients(id),
            FOREIGN KEY(recipeId) REFERENCES recipes(id)
        );

    `)
}