import pool from '../database.js';
import { faker } from '@faker-js/faker';
import fetch from 'node-fetch';

const categories = ["Breakfast", "Vegan", "Side", "Seafood"];

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
                //prices are randomly generated
                const price = faker.commerce.price(5, 20, 2);

                //inserts data into the database
                try {
                    await pool.query(
                        'INSERT INTO food (name, imagelink, category, price) VALUES ($1, $2, $3, $4)',
                        [name, imagelink, category, price]
                    );
                    console.log(`Inserted meal: ${name} (${category})`);
                } catch (err) {
                    console.error(`Error inserting meal ${name}:`, err);
                }
            }
        } else {
            console.log(`No meals found for category: ${category}`);
        }
    }

    console.log("Data import completed!");
}
fetchAndInsertData()
    .catch(err => {
        console.error('Error during data import:', err);
    });