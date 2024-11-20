
const app = angular.module('mealApp', []);


app.controller('IngredientController', ['$scope', '$http', function ($scope, $http) {
    $scope.meal = null;
    $scope.description = null;
    $scope.ingredients = [];
    $scope.instructions = [];


    const urlParams = new URLSearchParams(window.location.search);
    const mealId = urlParams.get('mealId');
    $scope.description = urlParams.get('description');

    if (mealId) {

        $http.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then((response) => {
                if (response.data.meals) {
                    const meal = response.data.meals[0];
                    $scope.meal = meal;


                    $scope.ingredients = extractIngredients(meal);


                    $scope.instructions = parseInstructions(meal.strInstructions);
                } else {
                    console.error("No meals found for the given meal ID.");
                }
            })
            .catch((error) => {
                console.error("Error fetching meal data:", error);
            });
    } else {
        console.error("Meal ID is missing in the URL parameters.");
    }


    function extractIngredients(meal) {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient) {
                ingredients.push(`${measure ? measure : ''} ${ingredient}`);
            }
        }
        return ingredients;
    }


    function parseInstructions(instructions) {
        if (!instructions) return [];
        return instructions.split('\r\n').filter(step => step.trim() !== '');
    }
}]);
