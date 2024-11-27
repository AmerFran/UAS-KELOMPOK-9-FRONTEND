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
                if (error.data && error.data.error) {
                    alert(error.data.error); // Display the raw error message returned from the API
                } else {
                    alert("An unexpected error occurred. Please try again later.");
                }
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

    //delete
    $scope.deleteAccount = function(currUser) {
        const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (confirmation) {
            $http.delete(API_URL + `/users/${currUser.id}`)
                .then(function(response) {
                    alert("Your account has been deleted successfully.");
                    AuthService.logout();
                    $location.path('/');
                })
                .catch(function(error) {
                    alert("Error deleting account: " + (error.data && error.data.error ? error.data.error : "Please try again later."));
                });
        }
    };


}]);

