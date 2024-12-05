app.controller('IngredientsController', ['$scope', '$location', 'IngredientsService', function($scope, $location, IngredientsService) {
    const urlParams = new URLSearchParams($location.search());
    const mealId = urlParams.get('mealId');
    const description = urlParams.get("description");

    $scope.description = description;
    $scope.meal = {};

    // Fetch meal data via MealService
    IngredientsService.getMealData(mealId)
        .then(function(mealData) {
            $scope.meal = mealData;
            $scope.meal.instructions = $scope.meal.instructions.split('\r\n');
        })
        .catch(function(error) {
            console.error("Error fetching meal data:", error);
        });
}]);
