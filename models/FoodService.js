app.service('FoodService', function($http) {
    const API = 'http://localhost:3000';

    // Function to get the foods based on params (search, filter, pagination)
    this.getFoods = function(params) {
        return $http.get(API + '/foods', { params: params });
    };

    // Function to delete a food item by ID
    this.deleteFood = function(foodId) {
        return $http.delete(API + '/foods/' + foodId);
    };
});
