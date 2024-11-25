app.controller('PaymentController', ['$scope', '$http', '$window', '$location','AuthService', function ($scope, $http, $window, $location,AuthService)  {
    const API='http://localhost:3000'
    
    $scope.payment = {
        cardNumber: ''
    };

    //gets user information(name,email,id,etc)
    $scope.getUser=function(){
        return(AuthService.getUser());
    }

    //passes variable to html
    $scope.user = $scope.getUser();

    // Make the API request
    $http.get(API + `/carts/user/${$scope.user.id}`)
    .then(function(response) {
        var result = response.data;
        
        $scope.result = result.cart;
    })
    .catch(function(error) {
        // Handle any errors
        console.error("Error fetching data:", error);
    });

    $scope.paymentStatus = '';

    // Process the payment
    $scope.processPayment = function() {
        $location.path('/');
        alert("payment processed!")
    };
}]);