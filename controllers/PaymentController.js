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

    $scope.processPayment = function () {
        // Prepare the receipt data
        const Data = {
            user_id: $scope.user.id,
            items: $scope.result.items,
            total_price: $scope.result.total_price,
            checkout_date: new Date().toISOString()
        };
    
        // creates a new transaction
        $http.post(API+'/transactions', Data)
            .then(function(response) {
                $location.path('/receipt'); 
                alert('Transaction completed successfully!');
            })
            .catch(function(error) {
                // Error - handle the error
                console.error('Error processing payment:', error);
                alert('There was an error processing your payment. Please try again.');
            });
    };    
}]);