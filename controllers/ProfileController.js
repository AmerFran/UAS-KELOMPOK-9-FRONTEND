// ProfileController.js
app.controller('ProfileController', ['$scope', '$window', '$location', 'AuthService', 'ProfileService', function ($scope, $window, $location, AuthService, ProfileService) {
    // Gets user information(name, email, id, etc)
    $scope.getUser = function() {
        return ProfileService.getUser();
    };

    // Handles username and email change
    $scope.change = function(currUser) {
        const data = {
            username: $scope.change.username,
            email: $scope.change.email,
            password: $scope.change.password
        };

        // Checks if credentials are correct
        ProfileService.change(currUser, data)
            .then(function(response) {
                AuthService.refreshAuth();
                alert("Successfully changed");
            })
            .catch(function(error) {
                if (error.data && error.data.error) {
                    alert(error.data.error); // Display the raw error message returned from the API
                } else {
                    alert("An unexpected error occurred. Please try again later.");
                }
            });
    };

    // Handles password change
    $scope.changePass = function(currUser) {
        if ($scope.change.newPass !== $scope.change.confirmPass) {
            alert("New password and confirm password don't match");
        } else {
            const data = {
                newPass: String($scope.change.newPass),
                currPass: String($scope.change.currPass)
            };

            // Checks if credentials are correct
            ProfileService.changePass(currUser, data)
                .then(function(response) {
                    alert("Successfully changed");
                })
                .catch(function(error) {
                    alert("Incorrect password");
                });
        }
    };

    // Passes variable to HTML
    $scope.user = $scope.getUser();

    // Logs the user out and redirects them to the login page
    $scope.logOut = function() {
        AuthService.logout();
        $location.path('/');
    };

    // Delete account
    $scope.deleteAccount = function(currUser) {
        const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (confirmation) {
            ProfileService.deleteAccount(currUser)
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
