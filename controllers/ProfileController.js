app.controller('ProfileController', ['$scope', '$http', '$window', '$location','AuthService', function ($scope, $http, $window, $location,AuthService) {
    const API_URL = 'http://localhost:3000';
    
    $scope.isAuthenticated = function () {
        return (AuthService.isAuthenticated());
    };

    $scope.getUser=function(){
        return(AuthService.getUser());
    }

    //handles the change of username and or email
    $scope.change = function (currUser) {
        const data={
            username:$scope.change.username,
            email:$scope.change.email,
            password: $scope.change.password
        }

        //checks if credentials are correct
        $http.put(API_URL + `/users/${currUser.id}`, data)
            .then(function (response) {
                AuthService.refreshAuth();
                alert("sucessfully changed");

            })
            .catch(function (error) {
                alert("incorrect password");
            });
    };
    

    

    //get current user
    $scope.user = $scope.getUser();

    //logs the user out and redirects them to the login page
    $scope.logOut = function() {
        AuthService.logout();
        $location.path('/');
    };


}]);

