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

    //category filter
    $scope.filterCategory = function(category) {
        $scope.filteredMeals = [];
        $scope.filteredCategory = category;
        var categoryQuery = { c: category };

        $http.get('https://www.themealdb.com/api/json/v1/1/filter.php?', {params: categoryQuery})
            .then(function(response) {
                if (response.data.meals) {
                    $scope.filteredMeals = response.data.meals.map(function(meal) {
                        return {
                            ...meal,
                            description: `This delicious and tasty dish is perfect for ${category.toLowerCase()} lovers.`
                        };
                    });
                }
            }).catch(function(error) {
                console.error("Error fetching meals:", error);
            });
    };

    //search by name
    $scope.searchEvent = function() {
        if ($scope.searchString) {
            $scope.filteredMeals = [];
            $scope.filteredCategory = `Search result for ${$scope.searchString}`;
            var searchQuery = { s: $scope.searchString };

            $http.get('https://www.themealdb.com/api/json/v1/1/search.php?', {params: searchQuery})
                .then(function(response) {
                    if (response.data.meals) {
                        $scope.filteredMeals = response.data.meals.map(function(meal) {
                            return {
                                ...meal,
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