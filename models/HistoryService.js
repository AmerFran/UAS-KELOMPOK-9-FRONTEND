app.factory('HistoryService', ['$http', 'AuthService', function($http, AuthService) {
    const API = 'http://localhost:3000';

    // Get current user details
    function getUser() {
        return AuthService.getUser();
    }

    // Fetch the transactions for the logged-in user where pickup_date is not NULL
    function fetchTransactions(userId) {
        return $http.get(API + '/transactions/user/' + userId)
            .then(function(response) {
                if (response.data && Array.isArray(response.data.transactions)) {
                    // Filter transactions that have a pickup_date
                    let transactions = response.data.transactions.filter(function(transaction) {
                        return transaction.pickup_date != null;
                    });

                    // Now fetch the food details for each transaction
                    return fetchFoodDetails(transactions);
                } else {
                    console.error("No transactions or invalid format received");
                    return [];
                }
            })
            .catch(function(error) {
                console.error("Error fetching transactions:", error);
                return [];
            });
    }

    // Fetch food details for each transaction
    function fetchFoodDetails(transactions) {
        if (Array.isArray(transactions)) {
            // Check every transaction and fetch food name
            let promises = transactions.map(function(transaction) {
                if (transaction.items && Array.isArray(transaction.items)) {
                    let foodPromises = transaction.items.map(function(item) {
                        return $http.get(API + '/foods/' + item.food_id)
                            .then(function(response) {
                                item.food_name = response.data.name;
                            })
                            .catch(function(error) {
                                console.error("Error fetching food details:", error);
                                item.food_name = 'Unknown'; // Default in case of an error
                            });
                    });

                    return Promise.all(foodPromises);
                }
            });

            // Return a promise that resolves when all food details are fetched
            return Promise.all(promises).then(function() {
                return transactions;
            });
        } else {
            console.error("Invalid transactions format in fetchFoodDetails");
            return [];
        }
    }

    // Function to delete a transaction
    function deleteTransaction(transactionId) {
        return $http.delete(API + '/transactions/' + transactionId)
            .then(function(response) {
                return transactionId; // Return the transactionId for removal
            })
            .catch(function(error) {
                console.error('Error deleting transaction:', error);
                throw error; // Throw error to be handled in the controller
            });
    }

    return {
        getUser: getUser,
        fetchTransactions: fetchTransactions,
        deleteTransaction: deleteTransaction
    };
}]);
