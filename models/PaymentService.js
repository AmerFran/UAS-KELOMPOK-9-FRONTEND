app.service('PaymentService', ['$http', '$location', function ($http, $location) {
    const API = 'http://localhost:3000';

    // Fetch cart data for a user
    this.getCart = function (userId) {
        return $http.get(API + `/carts/user/${userId}`);
    };

    // Process payment transaction
    this.processPayment = function (data) {
        return $http.post(API + '/transactions', data);
    };
}]);
