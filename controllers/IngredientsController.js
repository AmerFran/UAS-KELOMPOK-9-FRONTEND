app.controller('IngredientsController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    const urlParams=new URLSearchParams($location.search());
    const mealId=urlParams.get('mealId');
    const description=urlParams.get("description");

    $scope.description=description;
    $scope.meal={};

    $http.get(`http://localhost:3000/foods/${mealId}`)
        .then(function(response) {
            if (response.data) {
                $scope.meal = response.data;

                $scope.meal.instructions = $scope.meal.instructions.split('\r\n');
            }
        })
        .catch(function(error) {
            console.error("Error fetching meal data:", error);
        });
}]);
