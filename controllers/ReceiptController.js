app.controller('ReceiptController', ['$scope', '$http', 'ReceiptService', function($scope, $http, ReceiptService) {
    const API = 'http://localhost:3000';

    // Get current user details
    $scope.getUser = function() {
        return ReceiptService.getUser();
    };
    $scope.user = $scope.getUser();

    // Fetch the transactions for the logged-in user where pickup_date is NULL
    $scope.fetchTransactions = function() {
        var userId = $scope.user.id;

        // Call the ReceiptService to fetch transactions
        ReceiptService.fetchTransactions(userId).then(function(transactions) {
            if (transactions && Array.isArray(transactions)) {
                $scope.transactions = transactions;
                // Fetch food details for the transactions
                ReceiptService.fetchFoodDetails($scope.transactions);
            } else {
                console.error("No transactions or invalid format received");
                $scope.transactions = [];
            }
        }).catch(function(error) {
            console.error("Error fetching transactions:", error);
            $scope.transactions = [];
        });
    };

    // Function to update the pickup date for a transaction
    $scope.updatePickupDate = function(transactionId) {
        // Call the ReceiptService to update the pickup date
        ReceiptService.updatePickupDate(transactionId).then(function(updatedTransaction) {
            // Find and update the transaction in the transactions list
            const transactionIndex = $scope.transactions.findIndex(function(tx) {
                return tx.id === updatedTransaction.id;
            });

            if (transactionIndex !== -1) {
                // Update the transaction's pickup_date in the UI
                $scope.transactions[transactionIndex].pickup_date = updatedTransaction.pickup_date;

                // Remove the transaction from the displayed list since it's now moved into history
                $scope.transactions.splice(transactionIndex, 1);
                alert('We hope you enjoy our delicious food');
            }
        }).catch(function(error) {
            console.error("Error updating pickup date:", error);
            alert('There was an error confirming your pickup. Please try again later.');
        });
    };

    // Call the function to fetch transactions initially
    $scope.fetchTransactions();

}]);
