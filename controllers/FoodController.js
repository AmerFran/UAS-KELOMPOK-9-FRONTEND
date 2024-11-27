app.controller('FoodController', function($scope, $http, $window, AuthService) {
    const API='http://localhost:3000'
    // Get the current user details
    $scope.getUser = function() {
        return AuthService.getUser();
    };
    $scope.user = $scope.getUser();

    // Fetch all foods owned by the logged-in user
    $scope.getFoods = function() {
        
        var userId = $scope.user.id;
        $http.get(API+'/foods?user_id=' + userId)
            .then(function(response) {
                $scope.foods = response.data;
            }, function(error) {
                console.error('Error fetching foods:', error);
            });
    };

    // Delete a food item
    $scope.deleteFood = function(foodId) {
        if (confirm('Are you sure you want to delete this food item?')) {
            $http.delete(API+'/foods/' + foodId)
                .then(function(response) {
                    alert('Food item deleted successfully');
                    $scope.getFoods(); // Refresh the food list after deletion
                }, function(error) {
                    console.error('Error deleting food:', error);
                });
        }
    };
    //initialize foods
    $scope.getFoods();
});
