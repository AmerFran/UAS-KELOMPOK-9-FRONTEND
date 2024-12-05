app.service('HomeDietService', function($http) {
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

    // Function to get meals by category with pagination
    function filterCategory(category, page, limit) {
        var categoryQuery = { 
            c: category, 
            page: page, 
            limit: limit 
        };

        return $http.get('http://localhost:3000/foods', { params: categoryQuery })
            .then(function(response) {
                if (response.data) {
                    var meals = response.data.data.map(function(food) {
                        fetchUsername(food.user_id).then(function(username) {
                            food.username = username;
                        });
                        food.description = `This delicious and tasty dish is perfect for ${category.toLowerCase()} lovers.`;
                        return food;
                    });
                    return { meals: meals, totalPages: response.data.pagination.totalPages };
                }
            }).catch(function(error) {
                console.error("Error fetching meals by category:", error);
            });
    }

    // Function to search meals by name with pagination
    function searchMeals(searchString, page, limit) {
        var searchQuery = { 
            n: searchString, 
            page: page, 
            limit: limit 
        };

        return $http.get('http://localhost:3000/foods', { params: searchQuery })
            .then(function(response) {
                if (response.data) {
                    var meals = response.data.data.map(function(food) {
                        fetchUsername(food.user_id).then(function(username) {
                            food.username = username;
                        });
                        food.description = `This delicious and tasty dish is perfect for all meal lovers.`;
                        return food;
                    });
                    return { meals: meals, totalPages: response.data.pagination.totalPages };
                }
            }).catch(function(error) {
                console.error("Error fetching search results:", error);
            });
    }

    // Return the functions to be used in the controller
    return {
        filterCategory: filterCategory,
        searchMeals: searchMeals
    };
});
