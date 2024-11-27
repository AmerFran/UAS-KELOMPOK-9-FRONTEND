app.controller('HistoryController', ['$scope', '$http', 'AuthService', function($scope, $http, AuthService) {
    const API = 'http://localhost:3000';

    // Get current user details
    $scope.getUser = function() {
        return AuthService.getUser();
    };

    $scope.user = $scope.getUser(); // Get the currently logged-in user

    // Fetch the transactions for the logged-in user where pickup_date is not NULL
    $scope.fetchTransactions = function() {
        var userId = $scope.user.id;

        // Call the API to fetch transactions
        $http.get(API + '/transactions/user/' + userId)
            .then(function(response) {
                // Ensure the transactions array exists before processing
                if (response.data && Array.isArray(response.data.transactions)) {
                    // Filter transactions that have a pickup_date
                    $scope.transactions = response.data.transactions.filter(function(transaction) {
                        return transaction.pickup_date != null;
                    });

                    // Now fetch the food names for each transaction
                    $scope.fetchFoodDetails($scope.transactions);
                } else {
                    console.error("No transactions or invalid format received");
                    $scope.transactions = [];
                }
            })
            .catch(function(error) {
                console.error("Error fetching transactions:", error);
                $scope.transactions = [];
            });
    };

    // Fetch food details for each transaction
    $scope.fetchFoodDetails = function(transactions) {
        if (Array.isArray(transactions)) {
            //checks every transaction
            transactions.forEach(function(transaction) {
                //fetches food name
                if (transaction.items && Array.isArray(transaction.items)) {
                    transaction.items.forEach(function(item) {
                        //fetches food name via its id using the api
                        $http.get(API + '/foods/' + item.food_id)
                            .then(function(response) {
                                // Assign the food name to the item
                                item.food_name = response.data.name;
                            })
                            .catch(function(error) {
                                console.error("Error fetching food details:", error);
                                item.food_name = 'Unknown'; // Default in case of an error
                            });
                    });
                }
            });
        } else {
            console.error("Invalid transactions format in fetchFoodDetails");
        }
    };

    // Function to delete a transaction
    $scope.deleteTransaction = function(transactionId) {
        // Confirm deletion with the user
        if (confirm('Are you sure you want to delete this transaction?')) {
            $http.delete(API + '/transactions/' + transactionId)
                .then(function(response) {
                    //removes deleted item from the html
                    $scope.transactions = $scope.transactions.filter(function(transaction) {
                        return transaction.id !== transactionId;
                    });
                })
                .catch(function(error) {
                    console.error('Error deleting transaction:', error);
                    alert('Failed to delete transaction.');
                });
        }
    };

    $scope.fetchTransactions();

}]);
