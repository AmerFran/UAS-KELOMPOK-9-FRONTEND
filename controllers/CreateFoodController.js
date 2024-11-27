app.controller('CreateFoodController', ['$scope', '$http', 'AuthService', function($scope, $http, AuthService) {
    const API="http://localhost:3000"

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
        price: '',
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

    // Function to create food
    $scope.createFood = function() {
        if ($scope.foodForm.$valid) {
            $http.post(API+'/foods', $scope.food)
                .then(function(response) {
                    $scope.successMessage = 'Food created successfully!';
                    $scope.food = {}; // Reset the form
                })
                .catch(function(error) {
                    $scope.errorMessage = 'Error creating food. Please try again.';
                    console.error(error);
                });
        } else {
            $scope.errorMessage = 'Please fill in all required fields.';
        }
    };
}]);
