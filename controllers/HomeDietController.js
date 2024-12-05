app.controller('HomeDietController', function($scope, HomeDietService) {
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
    $scope.prev = '';

    // Category filter with pagination
    $scope.filterCategory = function(category) {
        $scope.filteredMeals = [];
        $scope.filteredCategory = category;
        if (category !== $scope.prev) {
            $scope.page = 1;
            $scope.prev = category;
        }

        // Fetch meals based on the selected category
        HomeDietService.filterCategory(category, $scope.page, $scope.limit).then(function(result) {
            if (result) {
                $scope.filteredMeals = result.meals;
                $scope.totalPages = result.totalPages;
            }
        });
    };

    // Name search with pagination
    $scope.searchEvent = function() {
        if ($scope.searchString) {
            $scope.filteredMeals = [];
            $scope.filteredCategory = `Search result for ${$scope.searchString}`;

            // Fetch meals based on the search query
            HomeDietService.searchMeals($scope.searchString, $scope.page, $scope.limit).then(function(result) {
                if (result) {
                    $scope.filteredMeals = result.meals;
                    $scope.totalPages = result.totalPages;
                }
            });
        }
    };

    // Go to the next page
    $scope.nextPage = function() {
        if ($scope.page < $scope.totalPages) {
            $scope.page++;  // Increment the page number
            // Fetch the updated list of meals based on the current filter or search query
            if ($scope.filteredCategory) {
                $scope.filterCategory($scope.filteredCategory);  // Re-fetch meals based on the selected category
            } else if ($scope.searchString) {
                $scope.searchEvent();  // Re-fetch meals based on the search string
            }
        }
    };

    // Go to the previous page
    $scope.previousPage = function() {
        if ($scope.page > 1) {
            $scope.page--;  // Decrement the page number
            // Fetch the updated list of meals based on the current filter or search query
            if ($scope.filteredCategory) {
                $scope.filterCategory($scope.filteredCategory);  // Re-fetch meals based on the selected category
            } else if ($scope.searchString) {
                $scope.searchEvent();  // Re-fetch meals based on the search string
            }
        }
    };

    $scope.socialLinks = [
        {
            url: "https://github.com/AmerFran/UAS-KELOMPOK-9-FRONTEND",
            icon: "bxl-github"
        },
        {
            url: "https://www.instagram.com/fabliusm/",
            icon: "bxl-instagram-alt"
        },
        {
            url: "https://x.com/cakequitterie",
            icon: "bxl-twitter"
        },
        {
            url: "https://www.linkedin.com/in/amer-f-337088308/",
            icon: "bxl-linkedin-square"
        }
    ];

    $scope.copyright = "© Healthy Living | All Rights Reserved";
});
