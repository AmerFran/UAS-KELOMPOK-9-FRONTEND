app.controller('ShopController', function($scope,$location, $http,AuthService) {
    $scope.foodItems = [];
    $scope.cart = [];
    $scope.page = 1;
    $scope.limit = 5;
    $scope.totalPages = 1;
    $scope.totalItems = 0;

    const API = 'http://localhost:3000';
    
    //gets user information (id,user,etc)
    $scope.getUser=function(){
        return(AuthService.getUser());
    }

    //passes variable to html
    $scope.user = $scope.getUser();

    //fetches food with pagination
    $scope.getFoodItems = function() {
        $http.get(API + '/foods', {
            params: {
                page: $scope.page,
                limit: $scope.limit
            }
        }).then(function(response) {
            //set default quantity to 1
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

    //loads food
    $scope.getFoodItems();

    //add food to cart
    $scope.addToCart = function(food, quantity) {
        if (quantity <= 0) {
            alert('Quantity must be greater than zero');
            return;
        }

        //checks if item is already in cart
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
        //decreases quantity
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
        } else if (cartItem.quantity === 1) {
            //if the quantity is 1 set the quantity to 0 then remove it from the cart
            cartItem.quantity = 0;
            const index = $scope.cart.indexOf(cartItem);
            if (index !== -1) {
                $scope.cart.splice(index, 1);  //removes the item from the array
            }
        }
    };


    //total price calculation
    $scope.calculateTotal = function() {
        return $scope.cart.reduce(function(total, cartItem) {
            return total + (cartItem.food.price * cartItem.quantity);
        }, 0).toFixed(2);
    };

    //submit the cart
    $scope.submitCart = function(userId) {
        if ($scope.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Create items array to match the strucure in the api
        const items = $scope.cart.map(item => ({
            food_id: item.food.id,
            quantity: item.quantity 
        }));

        // Calculate total price and convert it to a number
        const total_price = parseFloat($scope.calculateTotal()); 

        // Check if the user already has a cart
        $http.get(API +'/carts/user/' +userId) 
            .then(function(response) {
                // If the cart exists (response contains cart details)
                if (response.data && response.data.cart) {
                    // Update the existing cart
                    const cartId = response.data.cart.id;
                
                    // Send PUT request to update cart
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
                    // If no cart exists for the user, create a new cart
                    console.log('Creating new cart with the following data:', {
                        user_id: 1,
                        items: items,
                        total_price: total_price 
                    });

                    // Send POST request to create a new cart
                    $http.post(API + '/carts', {
                        user_id: userId,
                        items: items,
                        total_price: total_price
                    }).then(function(response) {
                        $location.path('/payment');
                        $scope.cart = [];//clear cart after submission
                    }, function(error) {
                        alert('Error creating cart.');
                    });
                }
            }, function(error) {
                alert('Error checking if cart exists.');
            });
    };



    //go to previous food page
    $scope.prevPage = function() {
        if ($scope.page > 1) {
            $scope.page--;
            $scope.getFoodItems();
        }
    };

    //go to next food page
    $scope.nextPage = function() {
        if ($scope.page < $scope.totalPages) {
            $scope.page++;
            $scope.getFoodItems();
        }
    };
});