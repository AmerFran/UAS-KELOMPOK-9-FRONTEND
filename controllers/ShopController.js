app.controller('ShopController', function($scope, $location, ShopService, AuthService) {
    $scope.foodItems = [];
    $scope.cart = [];
    $scope.page = 1;
    $scope.limit = 5;
    $scope.totalPages = 1;
    $scope.totalItems = 0;

    // Initialize search and filter variables
    $scope.searchName = '';
    $scope.selectedCategory = '';

    // Fetch user information using the service
    $scope.getUser = function() {
        return ShopService.getUser(AuthService);
    };

    // Pass user information to the view
    $scope.user = $scope.getUser();

    // Fetch food items with pagination, search, and filtering
    $scope.getFoodItems = function() {
        ShopService.getFoodItems($scope.page, $scope.limit, $scope.searchName, $scope.selectedCategory)
            .then(function(result) {
                $scope.foodItems = result.foodItems;
                $scope.totalItems = result.totalItems;
                $scope.totalPages = result.totalPages;
            }, function(error) {
                console.error('Error fetching food items:', error);
            });
    };

    //resets page to 1 when filtering food
    $scope.filterFoods = function() {
        $scope.page=1;
        this.getFoodItems();
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

        // Use the service to check and update the cart
        ShopService.checkAndUpdateCart(userId, items, total_price)
            .then(function(response) {
                $location.path('/payment');
                $scope.cart = [];  // Clear cart after submission
            }, function(error) {
                alert(error);
                console.error(error);
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
