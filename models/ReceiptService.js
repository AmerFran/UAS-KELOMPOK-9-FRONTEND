app.service('ReceiptService', ['$http', 'AuthService', function($http, AuthService) {
    const API = 'http://localhost:3000';

    // Get current user details
    this.getUser = function() {
        // Assuming user data is stored in AuthService or any similar service
        return AuthService.getUser();
    };

    // Fetch transactions for a given user
    this.fetchTransactions = function(userId) {
        return $http.get(API + '/transactions/user/' + userId)
            .then(function(response) {
                // Ensure the transactions array exists before processing
                if (response.data && Array.isArray(response.data.transactions)) {
                    let transactions = response.data.transactions.filter(function(transaction) {
                        return transaction.pickup_date === null;
                    });

                    transactions.forEach(function(transaction) {
                        // Creates the predictedTime variable which is 1 hour after the checkout_date
                        let checkoutDate = new Date(transaction.checkout_date);
                        checkoutDate.setHours(checkoutDate.getHours() + 1);
                        // Assign the predicted time to the transaction
                        transaction.predictedTime = checkoutDate;
                    });

                    return transactions; // Return filtered and updated transactions
                } else {
                    console.error("No transactions or invalid format received");
                    return [];
                }
            })
            .catch(function(error) {
                console.error("Error fetching transactions:", error);
                return [];
            });
    };

    // Fetch food details for each transaction
    this.fetchFoodDetails = function(transactions) {
        if (Array.isArray(transactions)) {
            transactions.forEach(function(transaction) {
                // Fetches food name
                if (transaction.items && Array.isArray(transaction.items)) {
                    transaction.items.forEach(function(item) {
                        // Fetches food name via its id using the API
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

    // Update the pickup date for a transaction
    this.updatePickupDate = function(transactionId) {
        return $http.put(API + '/transactions/pickup/' + transactionId)
            .then(function(response) {
                return response.data; // Return the updated transaction data
            })
            .catch(function(error) {
                console.error("Error updating pickup date:", error);
                throw error; // Rethrow error to be handled by controller
            });
    };

}]);
