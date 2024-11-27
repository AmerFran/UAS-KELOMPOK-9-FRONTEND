app.controller('ReceiptController', ['$scope', '$http', 'AuthService', function($scope, $http, AuthService) {
    const API = 'http://localhost:3000';

    // Get current user details
    $scope.getUser = function() {
        return AuthService.getUser();
    };
    $scope.user = $scope.getUser();

    // Fetch the transactions for the logged-in user where pickup_date is NULL
    $scope.fetchTransactions = function() {
        var userId = $scope.user.id;

        // Call the API to fetch transactions
        $http.get(API + '/transactions/user/' + userId)
            .then(function(response) {
                // Ensure the transactions array exists before processing
                if (response.data && Array.isArray(response.data.transactions)) {
                    // Filter transactions that have a null pickup_date
                    $scope.transactions = response.data.transactions.filter(function(transaction) {
                        return transaction.pickup_date === null;
                    });

                    $scope.transactions.forEach(function(transaction) {
                        //creates the predictedTime variable which is 1 hour after the checkout_date
                        let checkoutDate = new Date(transaction.checkout_date);
                        checkoutDate.setHours(checkoutDate.getHours() + 1);
                        // Assign the predicted time to the transaction
                        transaction.predictedTime = checkoutDate;
                    });

                    //fetch food names
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
                                item.food_name = 'Unknown'; // Default in case of error
                            });
                    });
                }
            });
        } else {
            console.error("Invalid transactions format in fetchFoodDetails");
        }
    };

    // Function to update the pickup date for a transaction
    $scope.updatePickupDate = function(transactionId) {
        // Call the API to update the transaction with a pickup date
        $http.put(API + '/transactions/pickup/' + transactionId)
            .then(function(response) {
                const updatedTransaction = response.data;
                // Find and update the transaction in the transactions list
                const transactionIndex = $scope.transactions.findIndex(function(tx) {
                    return tx.id === updatedTransaction.id;
                });
    
                // If the transaction was found in the list
                if (transactionIndex !== -1) {
                    // Update the transaction's pickup_date in the UI
                    $scope.transactions[transactionIndex].pickup_date = updatedTransaction.pickup_date;
    
                    // Remove the transaction from the displayed list since its now moved into history
                    $scope.transactions.splice(transactionIndex, 1);
                    alert('We hope you enjoy our delicious food');
                }
            })
            .catch(function(error) {
                console.error("Error updating pickup date:", error);
                alert('There was an error confirming your pickup. Please try again later.');
            });
    };
    
    $scope.fetchTransactions();

}]);
