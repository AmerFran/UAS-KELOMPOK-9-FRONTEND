import pool from '../database.js';
import { faker } from '@faker-js/faker';
import fetch from 'node-fetch';

const categories = ["Breakfast", "Vegan", "Side", "Seafood"];

//fetch ingredients and measurements
function details(meal) {
    const ingredients = [];
    const measurements = [];
    const area=meal[`strArea`];
    const instructions=meal[`strInstructions`];

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim() !== '' && measure && measure.trim() !== '') {
            ingredients.push(ingredient);
            measurements.push(measure);
        }
    }

    return { ingredients, measurements,area,instructions };
}

//converts the data from api into the database
async function fetchAndInsertData() {
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
            for (let meal of data.meals) {
                const name = meal.strMeal;
                const imagelink = meal.strMealThumb;
                const temp = meal.idMeal;

                //gets detailed response
                const res=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${temp}`);
                const detailed=await res.json();
                const detailedMeal=detailed.meals[0];
                const {ingredients,measurements,area,instructions}=details(detailedMeal);

                //prices are randomly generated
                const price = faker.commerce.price(5, 20, 2);
                //inserts data into the database
                try {
                    await pool.query(
                        'INSERT INTO food (name, imagelink, category, price,ingredients,measurements,area,instructions) VALUES ($1, $2, $3, $4,$5,$6,$7,$8)',
                        [name, imagelink, category, price,ingredients,measurements,area,instructions]
                    );
                    console.log(`Inserted meal: ${name} (${category})`);
                } catch (err) {
                    console.error(`Error inserting meal ${name}:`, err);
                }
            }
        }
    }
    console.log("Data import completed!");
}

// Start the process of fetching and inserting data
fetchAndInsertData()
    .catch(err => {
        console.error('Error during data import:', err);
    });
