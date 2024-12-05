app.controller('HomeDietController', function($scope, $http) {
    // Categories definition
    $scope.categories = [
        {name: 'Breakfast', image: '../assets/image/diet1.jpg'},
        {name: 'Vegan', image: '../assets/image/veganlag.jpg'},
        {name: 'Side', image: '../assets/image/french.jpg'},
        {name: 'Seafood', image: '../assets/image/monsal.jpg'}
    ];

    $scope.page = 1;  // Start on the first page
    $scope.limit = 10; // Number of items per page
    $scope.totalPages = 1; // Default total pages (to be updated later)
    $scope.filteredMeals = [];
    $scope.filteredCategory = '';

    // Function to fetch the username based on the user's ID
    function fetchUsername(userId) {
        return $http.get(`http://localhost:3000/users/${userId}`)
            .then(function(response) {
                return response.data.username;
            }).catch(function(error) {
                console.error("Error fetching user data:", error);
                return "Unknown User";  // Default if no user found
            });
    }

    // Category filter with pagination
    $scope.filterCategory = function(category) {
        $scope.filteredMeals = [];
        $scope.filteredCategory = category;

        var categoryQuery = { 
            c: category, 
            page: $scope.page, 
            limit: $scope.limit 
        };

        // Make API call to your foods API to filter by category with pagination
        $http.get('http://localhost:3000/foods', { params: categoryQuery })
            .then(function(response) {
                if (response.data) {
                    $scope.filteredMeals = response.data.data.map(function(food) {
                        fetchUsername(food.user_id).then(function(username) {
                            food.username = username;
                        });
                        food.description = `This delicious and tasty dish is perfect for ${category.toLowerCase()} lovers.`;
                        return food;
                    });
                    $scope.totalPages = response.data.pagination.totalPages;
                }
            }).catch(function(error) {
                console.error("Error fetching meals by category:", error);
            });
    };

    // Name search with pagination
    $scope.searchEvent = function() {
        if ($scope.searchString) {
            $scope.filteredMeals = [];
            $scope.filteredCategory = `Search result for ${$scope.searchString}`;

            var searchQuery = { 
                n: $scope.searchString, 
                page: $scope.page, 
                limit: $scope.limit 
            };

            $http.get('http://localhost:3000/foods', { params: searchQuery })
                .then(function(response) {
                    if (response.data) {
                        $scope.filteredMeals = response.data.data.map(function(food) {
                            fetchUsername(food.user_id).then(function(username) {
                                food.username = username;
                            });
                            food.description = `This delicious and tasty dish is perfect for all meal lovers.`;
                            return food;
                        });
                        $scope.totalPages = response.data.pagination.totalPages;
                    }
                }).catch(function(error) {
                    console.error("Error fetching search results:", error);
                });
        }
    };

    // Go to the next page
    $scope.nextPage = function() {
        if ($scope.page < $scope.totalPages) {
            $scope.page++;
            if ($scope.filteredCategory) {
                $scope.filterCategory($scope.filteredCategory);  // Re-fetch the filtered meals
            } else {
                $scope.searchEvent();  // Re-fetch search results
            }
        }
    };

    // Go to the previous page
    $scope.previousPage = function() {
        if ($scope.page > 1) {
            $scope.page--;
            if ($scope.filteredCategory) {
                $scope.filterCategory($scope.filteredCategory);  // Re-fetch the filtered meals
            } else {
                $scope.searchEvent();  // Re-fetch search results
            }
        }
    };

    $scope.socialLinks = [
        {
            url: "https://github.com/AmerFran/KELOMPOK-9-FRONTEND",
            icon: "bxl-github"
        },
        {
            url: "https://www.instagram.com/fabliusm/",
            icon: "bxl-instagram-alt"
        },
        {
            url: "https://x.com/",
            icon: "bxl-twitter"
        },
        {
            url: "https://www.linkedin.com/in/amer-f-337088308/",
            icon: "bxl-linkedin-square"
        }
    ];

    $scope.copyright = "© Healthy Living | All Rights Reserved";
});
