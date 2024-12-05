app.service('EditFoodService', ['$http', function($http) {
    const API = "http://localhost:3000";

    // Fetch food item from the API
    this.getFood = function(foodId) {
        return $http.get(API + '/foods/' + foodId);
    };

    // Update food item on the API
    this.updateFood = function(foodId, foodData) {
        return $http.put(API + '/foods/' + foodId, foodData);
    };
}]);
