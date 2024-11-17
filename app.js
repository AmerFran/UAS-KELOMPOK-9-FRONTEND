var app = angular.module('healthyLivingApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/home-diet.html',
            controller: 'HomeDietController'
        })
        .when('/about-services', {
            templateUrl: '/views/about-services.html',
            controller: 'AboutServicesController'
        })
        .when('/results', {
            templateUrl: '/views/results.html',
            controller: 'ResultsController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('HomeDietController', function($scope, $http) {
    $scope.message = "Welcome to Home & Diet page";
    $scope.filteredRecipes = [];
    $scope.resultMessage = "Please select a diet category to view recipes.";

    // Function to filter recipes by category
    $scope.filterCategory = function(category) {
        $scope.resultMessage = category + " Recipes";
        $scope.filteredRecipes = [];  // Reset filtered recipes
        $scope.fetchRecipes(category);
    };

    // Function to fetch recipes based on selected category
    $scope.fetchRecipes = function(category) {
        var apiUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=' + category;
        $http.get(apiUrl)
            .then(function(response) {
                if (response.data.meals) {
                    response.data.meals.forEach(function(meal) {
                        $scope.getMealDetails(meal.idMeal);
                    });
                }
            }, function(error) {
                console.log('Error fetching meals', error);
            });
    };

    // Fetch detailed information for each meal
    $scope.getMealDetails = function(mealId) {
        var mealDetailsUrl = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealId;
        $http.get(mealDetailsUrl)
            .then(function(response) {
                var mealDetails = response.data.meals[0];
                var area = mealDetails.strArea;
                var category = mealDetails.strCategory;
                var description = `This delicious and tasty ${area} dish is sure to satisfy you, perfect for ${category.toLowerCase()}.`;
                $scope.filteredRecipes.push({
                    idMeal: mealDetails.idMeal,
                    strMeal: mealDetails.strMeal,
                    strMealThumb: mealDetails.strMealThumb,
                    description: description
                });
            }, function(error) {
                console.log('Error fetching meal details', error);
            });
    };
});

app.controller('AboutServicesController', function($scope) {
    $scope.message = "About Us and Our Services";
});

app.controller('ResultsController', function($scope) {
    $scope.message = "Results and Success Stories";
});
