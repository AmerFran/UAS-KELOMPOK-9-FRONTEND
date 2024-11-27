app.controller('EditFoodController', ['$scope', '$http', '$routeParams', 'AuthService', function($scope, $http, $routeParams, AuthService) {
    const API = "http://localhost:3000";

    // Get user data
    $scope.getUser = function() {
        return AuthService.getUser();
    };

    $scope.user = $scope.getUser();

    $scope.categories = ["Breakfast", "Vegan", "Side", "Seafood"];

    // Initialize the food object
    $scope.food = {
        name: '',
        imagelink: '',
        category: '',
        price: 0,
        ingredients: [],
        measurements: [],
        area: '',
        instructions: '',
        user_id: $scope.user.id 
    };

    // Function to add a new ingredient field
    $scope.addIngredient = function() {
        $scope.food.ingredients.push('');
        $scope.food.measurements.push('');
    };

    // Function to remove an ingredient field
    $scope.removeIngredient = function(index) {
        $scope.food.ingredients.splice(index, 1);
        $scope.food.measurements.splice(index, 1);
    };

    // Fetch the food data for editing based on the foodId in the URL
    const foodId = $routeParams.foodId;

    // Fetch food item from the api
    $http.get(API + '/foods/' + foodId)
        .then(function(response) {
            const foodData = response.data;

            // Populate form with food data
            $scope.food.name = foodData.name || '';
            $scope.food.imagelink = foodData.imagelink || '';
            $scope.food.category = foodData.category || '';
            $scope.food.price = parseFloat(foodData.price) || 0;
            $scope.food.ingredients = foodData.ingredients || [];
            $scope.food.measurements = foodData.measurements || [];
            $scope.food.area = foodData.area || '';
            $scope.food.instructions = foodData.instructions || '';
        })
        .catch(function(error) {
            alert('Error fetching food data. Please try again.');
            console.error(error);
        });

    // Function to update food
    $scope.updateFood = function() {
        if ($scope.foodForm.$valid) {
            $http.put(API + '/foods/' + foodId, $scope.food)
                .then(function(response) {
                    alert('Food updated successfully!');
                    $scope.food = {}; // Reset the form
                })
                .catch(function(error) {
                    alert('Error updating food. Please try again.');
                    console.error(error);
                });
        } else {
            alert('Please fill in all required fields.');
        }
    };
}]);
