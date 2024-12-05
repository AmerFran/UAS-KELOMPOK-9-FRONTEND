app.service('CreateFoodService', ['$http', 'AuthService', function($http, AuthService) {
    const API = "http://localhost:3000";

    // Get user data
    this.getUser = function() {
        return AuthService.getUser();
    };

    // Create a food item
    this.createFood = function(food) {
        return $http.post(API + '/foods', food);
    };

}]);
