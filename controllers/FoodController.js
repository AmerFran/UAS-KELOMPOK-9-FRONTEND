app.controller('FoodController', function($scope, $http, $window, AuthService) {
    const API = 'http://localhost:3000';
    
    // Get the current user details
    $scope.getUser = function() {
        return AuthService.getUser();
    };
    $scope.user = $scope.getUser();

    // Initialize pagination and filters
    $scope.currentPage = 1;
    $scope.limit = 10; // Number of items per page
    $scope.searchName = '';
    $scope.selectedCategory = ''; 

    // Function to get the food items with search, filter, and pagination
    $scope.getFoods = function() {
        const params = {
            n: $scope.searchName,
            c: $scope.selectedCategory,
            page: $scope.currentPage,
            limit: $scope.limit
        };

        // Send the request with the search and filter params
        $http.get(API + '/foods', { params: params })
            .then(function(response) {
                $scope.foods = response.data.data; // The foods array
                $scope.totalPages = response.data.pagination.totalPages; // Total pages
                $scope.totalItems = response.data.pagination.totalItems; // Total items
            }, function(error) {
                console.error('Error fetching foods:', error);
            });
    };

    // Function to handle page change (pagination)
    $scope.changePage = function(page) {
        if (page >= 1 && page <= $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getFoods(); // Refresh food list for the new page
        }
    };

    // Function to trigger search manually
    $scope.searchFoods = function() {
        $scope.currentPage = 1; // Reset to the first page when search is triggered
        $scope.getFoods();
    };

    // Initialize foods on page load
    $scope.getFoods();

    // Delete food item
    $scope.deleteFood = function(foodId) {
        if (confirm('Are you sure you want to delete this food item?')) {
            $http.delete(API + '/foods/' + foodId)
                .then(function(response) {
                    alert('Food item deleted successfully');
                    $scope.getFoods(); // Refresh the food list after deletion
                }, function(error) {
                    console.error('Error deleting food:', error);
                });
        }
    };
});
