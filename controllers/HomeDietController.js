app.controller('HomeDietController', function($scope, $http) {
    //categories
    $scope.categories = [
        {name: 'Breakfast', image: '../assets/image/diet1.jpg'},
        {name: 'Vegan', image: '../assets/image/veganlag.jpg'},
        {name: 'Side', image: '../assets/image/french.jpg'},
        {name: 'Seafood', image: '../assets/image/monsal.jpg'}
    ];

    $scope.filteredMeals = [];
    $scope.filteredCategory = '';

    // category filter
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
                        return {
                            ...food,
                            description: `This delicious and tasty dish is perfect for ${category.toLowerCase()} lovers.`
                        };
                    });
                }
            }).catch(function(error) {
                console.error("Error fetching meals by category:", error);
            });
    };

    //name search
    $scope.searchEvent = function() {
        if ($scope.searchString) {
            $scope.filteredMeals = [];
            $scope.filteredCategory = `Search result for ${$scope.searchString}`;
            var searchQuery = { n: $scope.searchString };
            $http.get('http://localhost:3000/foods', {params: searchQuery})
                .then(function(response) {
                    if (response.data) {
                        $scope.filteredMeals = response.data.map(function(food) {
                            return {
                                ...food,
                                description: `This delicious and tasty dish is perfect for all meal lovers.`
                            };
                        });
                    }
                }).catch(function(error) {
                    console.error("Error fetching search results:", error);
                });
        }
    };
});