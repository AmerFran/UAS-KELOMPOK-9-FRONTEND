app.controller('ProfileController', ['$scope', '$http', '$window', '$location','AuthService', function ($scope, $http, $window, $location,AuthService) {
    const API_URL = 'http://localhost:3000';
    
    //gets user information(name,email,id,etc)
    $scope.getUser=function(){
        return(AuthService.getUser());
    }

    //handles username and email change
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

    //handles password change
    $scope.changePass = function (currUser) {
        if($scope.change.newPass!=$scope.change.confirmPass){
            alert("new password and confirm password dont match")
        }else{
            const data={
                newpass:String($scope.change.newPass),
                oldpass:String($scope.change.currPass)
            }
            
    
            //checks if credentials are correct
            $http.put(API_URL + `/users/changepass/${currUser.id}`, data)
                .then(function (response) {
                    alert("sucessfully changed");
    
                })
                .catch(function (error) {
                    alert("incorrect password");
                });
        }
    };
    
    //passes variable to html
    $scope.user = $scope.getUser();

    //logs the user out and redirects them to the login page
    $scope.logOut = function() {
        AuthService.logout();
        $location.path('/');
    };


}]);

