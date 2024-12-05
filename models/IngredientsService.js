app.service('IngredientsService', ['$http', '$q', function($http, $q) {
    const API_URL = 'http://localhost:3000/foods/';

    this.getMealData = function(mealId) {
        const deferred = $q.defer();

        $http.get(API_URL + mealId)
            .then(function(response) {
                if (response.data) {
                    deferred.resolve(response.data);
                } else {
                    deferred.reject("No data found for the given mealId");
                }
            })
            .catch(function(error) {
                deferred.reject("Error fetching meal data: " + error.message);
            });

        return deferred.promise;
    };
}]);
