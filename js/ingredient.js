$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mealId = urlParams.get('mealId');
    const description=urlParams.get("description")
    $.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .done((response)=>{
            if (response.meals){
                const meal=response.meals[0];
                $('#nameHeader').append(meal.strMeal);
                $('#descriptionHeader').append(description);
                $('#imageContainer').append(`<img src="${meal.strMealThumb}"/>`)
                splitter(meal.strInstructions);
                showIngredients(meal);
            }
    })
});

function showIngredients(temp){
    let ingredientsList=`<h2>Ingredients for ${temp.strMeal}:</h2><ul>`;
    for (let i=1;i<=20;i++) {
        const ingredient=temp[`strIngredient${i}`];
        const measure=temp[`strMeasure${i}`];
        if (ingredient){
            ingredientsList+=`<li>${measure} ${ingredient}</li>`;
        }
    }
    ingredientsList+='</ul>';
    $('#ingredientsContainer').append(ingredientsList);
    
}

function splitter(temp){
    res=temp.split(`\r\n`);
    lister(res);
}
function lister(temp){
    let index=1;
    temp.forEach((temps)=>{
        if(temps!=''){
            $('#instructionContainer').append(`<li>${index}.${temps}</li>`);
            index++;
        }
    })
}