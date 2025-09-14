import express from 'express';
import  { ENV } from './config/env.js';
import { db } from './config/db.js';
import { favoriteTable } from './db/schema.js';
import { and, eq } from 'drizzle-orm';
import job from './config/cron.js';

const app = express();
const PORT = process.env.PORT || 5000;
if ( ENV.NODE_ENV === "production" ) job.start();

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: "API is healthy" });
});


// -----------------------adding favorite recipes to the database

app.post('/api/favorites', async(req, res) => {
    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;

        if (!userId || !recipeId || !title ) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const newFavorites = await db.insert(favoriteTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        }).returning();

        res.status(201).json(newFavorites[0]);

    } catch (error) {
        console.log("Error adding favorite: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// -----------------------deleting favorite recipes from the database

app.delete('/api/favorites/:userId/:recipeId', async(req, res) => {
    try {

        const { userId, recipeId } = req.params

        await db.delete(favoriteTable).where(
            and(eq(favoriteTable.userId, userId), eq(favoriteTable.recipeId, parseInt(recipeId)   ))
        );

        res.status(200).json({ message: "Favorite deleted successfully" });
        
    } catch (error) {
        console.log("Error deleting favorite: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// -----------------------fetching favorite recipes from the database

app.get('/api/favorites/:userId', async(req, res) => {
    try {

        const { userId } = req.params;

        const userFavorites = await db.select().from(favoriteTable).where(
            eq(favoriteTable.userId, userId)
        );

        res.status(200).json(userFavorites);
        
    } catch (error) {
        console.log("Error fetching favorite: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
});