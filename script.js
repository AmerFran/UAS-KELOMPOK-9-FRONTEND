$('#seafood').click((e) => {
    e.preventDefault();
    $('#filterResult').empty();
    filterCategory("seafood");
    $('#result').empty();
    $('#result').append('<h1 class="heading" id="result">SeaFood</h1>')
    const resultElement=document.getElementById('result');
    resultElement.scrollIntoView({behavior:'smooth'});
});

$('#sideDish').click((e) => {
    e.preventDefault();
    $('#filterResult').empty();
    filterCategory("Side");
    $('#result').empty();
    $('#result').append('<h1 class="heading" id="result">Side Dishes</h1>')
    const resultElement=document.getElementById('result');
    resultElement.scrollIntoView({behavior:'smooth'});
});

$('#vegan').click((e) => {
    e.preventDefault();
    $('#filterResult').empty();
    filterCategory("Vegan");
    $('#result').empty();
    $('#result').append('<h1 class="heading" id="result">Vegan Meal & Desert</h1>')
    const resultElement=document.getElementById('result');
    resultElement.scrollIntoView({behavior:'smooth'});
});

$('#breakfast').click((e) => {
    e.preventDefault();
    $('#filterResult').empty();
    filterCategory("Breakfast");
    $('#result').empty();
    $('#result').append('<h1 class="heading" id="result">Breakfast</h1>')
    const resultElement=document.getElementById('result');
    resultElement.scrollIntoView({behavior:'smooth'});
});


function nameSearch(temp){
    const tempQuery={
        s:temp
    }
    $.get('https://www.themealdb.com/api/json/v1/1/search.php?',tempQuery).done((response)=>{
        if (response.meals){
            response.meals.forEach((meal)=>{
                idSearch(meal.idMeal).done((mealDetails)=>{
                    const area=mealDetails.meals[0].strArea;
                    const desc=descriptionFiller(meal.strCategory)
                    const description=`this delicious and tasty ${area} dish is sure to satisfy you ${desc}`;
                    $('#filterResult').append(`
                        <div class="box lunch">
                        <div class="image">
                        <img src="${meal.strMealThumb}"/>
                        </div>
                        <div class="content">
                        <a href="ingredients.html?mealId=${meal.idMeal}&description=${description}" target="_blank" class="link">${meal.strMeal}</a>
                        <p>${description}</p>
                        <div class="icon">
                        <a href="#"><i class="fas fa-clock"></i>22 september 2024</a>
                        <a href="#"><i class="fas fa-clock"></i>by amer</a>
                        </div>
                        </div>
                        </div>
                    `);
                });
            });
        }
    })
}

function filterCategory(temp){
    const tempQuery={
        c:temp
    }
    $.get('https://www.themealdb.com/api/json/v1/1/filter.php?',tempQuery).done((response)=>{
        if (response.meals){
            response.meals.forEach((meal)=>{
                idSearch(meal.idMeal).done((mealDetails)=>{
                    const area=mealDetails.meals[0].strArea;
                    const desc=descriptionFiller(mealDetails.meals[0].strCategory);
                    const description=`this delicious and tasty ${area} dish is sure to satisfy you ${desc}`;
                    $('#filterResult').append(`
                        <div class="box lunch">
                        <div class="image">
                        <img src="${meal.strMealThumb}"/>
                        </div>
                        <div class="content">
                        <a href="ingredients.html?mealId=${meal.idMeal}&description=${description}" target="_blank" class="link">${meal.strMeal}</a>
                        <p>${description}</p>
                        <div class="icon">
                        <a href="#"><i class="fas fa-clock"></i>22 september 2024</a>
                        <a href="#"><i class="fas fa-clock"></i>by amer</a>
                        </div>
                        </div>
                        </div>
                    `);
                });
            });
        }
    })
}


document.getElementById('searchString').addEventListener('keypress', function(e) {
    if (e.key==='Enter'){
        searchEvent(e); 
    }
});

$('#searchButton').click((e) => {
    e.preventDefault();
    searchEvent(e);
});

function searchEvent(e){
    searchString=$('#searchString').val()
    $('#result').empty();
    $('#filterResult').empty();
    e.preventDefault();
    const resultElement=document.getElementById('result');
    resultElement.scrollIntoView({behavior:'smooth'});
    $('#result').append(`Search result for ${searchString}`);
    nameSearch(searchString);
}

function descriptionFiller(temp){
    if(temp=="Side"){
        return "perfect as a side dish";
    }
    if(temp=="Vegan"){
        return "perfect for vegans";
    }
    if(temp=="Breakfast"){
        return "perfect for breakfast";
    }
    if(temp=="Seafood"){
        return "perfect for seafood lovers";
    }else{
        return "";
    }
}

function idSearch(temp){
    const tempQuery={
        i:temp
    }
    return $.get('https://www.themealdb.com/api/json/v1/1/lookup.php', tempQuery);
}
