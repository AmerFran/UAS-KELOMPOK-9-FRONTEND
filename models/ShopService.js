app.service('ShopService', function($http, $q) {
    const API = 'http://localhost:3000';

    // Fetch food items with pagination, search, and filtering
    this.getFoodItems = function(page, limit, searchName, selectedCategory) {
        return $http.get(API + '/foods', {
            params: {
                n: searchName,
                c: selectedCategory,
                page: page,
                limit: limit
            }
        }).then(function(response) {
            // Set default quantity to 1
            const foodItems = response.data.data.map(function(food) {
                food.quantity = 1;
                return food;
            });

            const pagination = response.data.pagination;

            return {
                foodItems: foodItems,
                totalItems: pagination.totalItems,
                totalPages: pagination.totalPages
            };
        });
    };

    // Get user information (id, user, etc.)
    this.getUser = function(AuthService) {
        return AuthService.getUser();
    };

    // Check if the user already has a cart and update it
    this.checkAndUpdateCart = function(userId, cartItems, totalPrice) {
        const deferred = $q.defer();

        $http.get(API + '/carts/user/' + userId)
            .then(function(response) {
                if (response.data && response.data.cart) {
                    const cartId = response.data.cart.id;
                    $http.put(API + '/carts/' + cartId, {
                        user_id: userId,
                        items: cartItems,
                        total_price: totalPrice
                    }).then(function(response) {
                        deferred.resolve(response);
                    }, function(error) {
                        deferred.reject('Error updating cart.');
                    });
                } else {
                    // Create a new cart
                    $http.post(API + '/carts', {
                        user_id: userId,
                        items: cartItems,
                        total_price: totalPrice
                    }).then(function(response) {
                        deferred.resolve(response);
                    }, function(error) {
                        deferred.reject('Error creating cart.');
                    });
                }
            }, function(error) {
                deferred.reject('Error checking if cart exists.');
            });

        return deferred.promise;
    };
});
