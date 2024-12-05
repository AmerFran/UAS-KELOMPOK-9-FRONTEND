app.controller('HistoryController', ['$scope', 'HistoryService', function($scope, HistoryService) {
    // Get current user details
    $scope.getUser = function() {
        return HistoryService.getUser();
    };

    $scope.user = $scope.getUser(); // Get the currently logged-in user

    // Fetch the transactions for the logged-in user where pickup_date is not NULL
    $scope.fetchTransactions = function() {
        var userId = $scope.user.id;

        // Call the service to fetch transactions
        HistoryService.fetchTransactions(userId)
            .then(function(transactions) {
                // Assign the fetched transactions to the scope
                $scope.transactions = transactions;
            })
            .catch(function(error) {
                $scope.transactions = [];
            });
    };

    // Function to delete a transaction
    $scope.deleteTransaction = function(transactionId) {
        // Confirm deletion with the user
        if (confirm('Are you sure you want to delete this transaction?')) {
            HistoryService.deleteTransaction(transactionId)
                .then(function(deletedTransactionId) {
                    // Removes deleted item from the HTML
                    $scope.transactions = $scope.transactions.filter(function(transaction) {
                        return transaction.id !== deletedTransactionId;
                    });
                })
                .catch(function(error) {
                    console.error('Error deleting transaction:', error);
                    alert('Failed to delete transaction.');
                });
        }
    };

    $scope.fetchTransactions(); // Initial fetch of transactions
}]);
