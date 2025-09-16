const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

export const MealAPI ={
    // Search meal by name 

    searchMealByName: async (name) => {
        try {
            const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error('Error fetching meal by name:', error);
            return [];
        }
    },
    // Lookup full meal details by id

    getMealById: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error('Error fetching meal by ID:', error);
            return null;
        }
    },
    // Get a random meal
    getRandomMeal: async () => {
        try {
            const response = await fetch(`${BASE_URL}/random.php`);
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error('Error fetching random meal:', error);
            return null;
        }
    },
    getRandomMeals: async (count = 6) => {
        try {
            const promises = Array(count).fill().map(() => MealAPI.getRandomMeal());
            const meals = await Promise.all(promises);
            return meals.filter(meal => meal !== null);
        } catch (error) {
            console.error('Error fetching random meals:', error);
            return [];
        }
    },

    // list all meal categories
    getCategories: async () => {
        try {
            const response = await fetch(`${BASE_URL}/categories.php`);
            const data = await response.json();
            return data.categories || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    // filter by main ingredient
    filterByIngredient: async (ingredient) => {
        try {
            const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error('Error filtering by ingredient:', error);
            return [];
        }
    },

    // filter by category
    filterByCategory: async (category) => {
        try {
            const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error('Error filtering by category:', error);
            return [];
        }
    },

    // transform the meal data to app 

    transformMealData: (meal) => {
        if (!meal) return null;

        // extract ingredients from the meal object

        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                const measureText = measure && measure.trim() ? `${measure.trim()}` : '';
                ingredients.push(`${measureText} ${ingredient.trim()}`);
            }
        }
        const instructions = meal.strInstructions ? meal.strInstructions.split(/\r?\n/).filter(step => step.trim()) : [];
        return {
            id: meal.idMeal,
            name: meal.strMeal,
            title: meal.strMeal, // Add title property for UI consistency
            description: meal.strInstructions ? meal.strInstructions.substring(0, 120) + '...' : 'Delecious meal from the MealDB',
            image: meal.strMealThumb,
            cookTime: "30-45 mins",
            servings: 4,
            category: meal.strCategory || "Main Coourse", 
            area: meal.strArea,
            ingredients,
            instructions,
            originalData: meal,
        };
    },
}