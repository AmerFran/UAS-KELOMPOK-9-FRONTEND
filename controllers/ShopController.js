app.controller('ShopController', function($scope, $location, $http, AuthService) {
    $scope.foodItems = [];
    $scope.cart = [];
    $scope.page = 1;
    $scope.limit = 5;
    $scope.totalPages = 1;
    $scope.totalItems = 0;

    // Initialize search and filter variables
    $scope.searchName = '';
    $scope.selectedCategory = '';

    const API = 'http://localhost:3000';

    // Gets user information (id, user, etc.)
    $scope.getUser = function() {
        return AuthService.getUser();
    };

    // Passes variable to HTML
    $scope.user = $scope.getUser();

    // Fetch food items with pagination, search, and filtering
    $scope.getFoodItems = function() {
        $http.get(API + '/foods', {
            params: {
                n: $scope.searchName,
                c: $scope.selectedCategory,
                page: $scope.page,
                limit: $scope.limit
            }
        }).then(function(response) {
            // Set default quantity to 1
            $scope.foodItems = response.data.data.map(function(food) {
                food.quantity = 1;
                return food;
            });

            $scope.totalItems = response.data.pagination.totalItems;
            $scope.totalPages = response.data.pagination.totalPages;
        }, function(error) {
            console.error('Error fetching food items:', error);
        });
    };

    // Load food items on page load
    $scope.getFoodItems();

    // Add food to cart
    $scope.addToCart = function(food, quantity) {
        if (quantity <= 0) {
            alert('Quantity must be greater than zero');
            return;
        }

        let existingItem = $scope.cart.find(item => item.food.id === food.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            $scope.cart.push({
                food: food,
                quantity: quantity
            });
        }
    };

    // Decrease the quantity of an item in the cart
    $scope.decreaseQuantity = function(cartItem) {
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
        } else if (cartItem.quantity === 1) {
            cartItem.quantity = 0;
            const index = $scope.cart.indexOf(cartItem);
            if (index !== -1) {
                $scope.cart.splice(index, 1);  // Removes the item from the cart
            }
        }
    };

    // Calculate the total price of all items in the cart
    $scope.calculateTotal = function() {
        return $scope.cart.reduce(function(total, cartItem) {
            return total + (cartItem.food.price * cartItem.quantity);
        }, 0).toFixed(2);
    };

    // Submit the cart
    $scope.submitCart = function(userId) {
        if ($scope.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const items = $scope.cart.map(item => ({
            food_id: item.food.id,
            quantity: item.quantity
        }));

        const total_price = parseFloat($scope.calculateTotal());

        // Check if the user already has a cart
        $http.get(API + '/carts/user/' + userId)
            .then(function(response) {
                if (response.data && response.data.cart) {
                    const cartId = response.data.cart.id;

                    // Update the existing cart
                    $http.put(API + '/carts/' + cartId, {
                        user_id: userId,
                        items: items,
                        total_price: total_price
                    }).then(function(response) {
                        $location.path('/payment');
                        $scope.cart = [];  // Clear cart after submission
                    }, function(error) {
                        alert('Error updating cart.');
                        console.error(error);
                    });
                } else {
                    // Create a new cart
                    $http.post(API + '/carts', {
                        user_id: userId,
                        items: items,
                        total_price: total_price
                    }).then(function(response) {
                        $location.path('/payment');
                        $scope.cart = []; // Clear cart after submission
                    }, function(error) {
                        alert('Error creating cart.');
                    });
                }
            }, function(error) {
                alert('Error checking if cart exists.');
            });
    };

    // Go to the previous page of food items
    $scope.prevPage = function() {
        if ($scope.page > 1) {
            $scope.page--;
            $scope.getFoodItems();
        }
    };

    // Go to the next page of food items
    $scope.nextPage = function() {
        if ($scope.page < $scope.totalPages) {
            $scope.page++;
            $scope.getFoodItems();
        }
    };
});
