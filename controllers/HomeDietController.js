app.controller('HomeDietController', function($scope, $http) {
    // Categories definition
    $scope.categories = [
        {name: 'Breakfast', image: '../assets/image/diet1.jpg'},
        {name: 'Vegan', image: '../assets/image/veganlag.jpg'},
        {name: 'Side', image: '../assets/image/french.jpg'},
        {name: 'Seafood', image: '../assets/image/monsal.jpg'}
    ];

    $scope.filteredMeals = [];
    $scope.filteredCategory = '';

    // Function to fetch the username based on the users id
    function fetchUsername(userId) {
        return $http.get(`http://localhost:3000/users/${userId}`)
            .then(function(response) {
                return response.data.username;
            }).catch(function(error) {
                console.error("Error fetching user data:", error);
                return "Unknown User";  //in case if the user row is somehow empty
            });
    }

    // Category filter
    $scope.filterCategory = function(category) {
        $scope.filteredMeals = [];
        $scope.filteredCategory = category;

        // Prepare the query parameters
        var categoryQuery = { c: category };

        // Make API call to your foods API to filter by category
        $http.get('http://localhost:3000/foods', {params: categoryQuery})
            .then(function(response) {
                if (response.data) {
                    $scope.filteredMeals = response.data.map(function(food) {
                        // Fetch the username for each meal and add it to the food object
                        fetchUsername(food.user_id).then(function(username) {
                            food.username = username;
                        });
                        // Add the description for the meal
                        food.description = `This delicious and tasty dish is perfect for ${category.toLowerCase()} lovers.`;
                        return food;
                    });
                }
            }).catch(function(error) {
                console.error("Error fetching meals by category:", error);
            });
    };

    // Name search
    $scope.searchEvent = function() {
        if ($scope.searchString) {
            $scope.filteredMeals = [];
            $scope.filteredCategory = `Search result for ${$scope.searchString}`;
            var searchQuery = { n: $scope.searchString };

            $http.get('http://localhost:3000/foods', {params: searchQuery})
                .then(function(response) {
                    if (response.data) {
                        $scope.filteredMeals = response.data.map(function(food) {
                            // Fetch the username for each meal and add it to the food object
                            fetchUsername(food.user_id).then(function(username) {
                                food.username = username;
                            });
                            food.description = `This delicious and tasty dish is perfect for all meal lovers.`;
                            return food;
                        });
                    }
                }).catch(function(error) {
                    console.error("Error fetching search results:", error);
                });
        }
    };

    // Check for Enter key press to trigger the search
    $scope.checkEnter = function(event) {
        if (event.key === 'Enter') {
            $scope.searchEvent();
        }
    };
});
