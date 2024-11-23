app.factory('RecipeModel', function($http) {
    var model = {};

    model.fetchRecipes = function(category) {
        var apiUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=' + category;
        return $http.get(apiUrl);
    };

    model.getMealDetails = function(mealId) {
        var mealDetailsUrl = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealId;
        return $http.get(mealDetailsUrl);
    };

    return model;
});
// 