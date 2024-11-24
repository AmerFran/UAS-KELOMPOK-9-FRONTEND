app.controller('LoginController', ['$scope', '$http', '$window', '$location','AuthService', function ($scope, $http, $window, $location,AuthService) {
    const API_URL = 'http://localhost:3000';
    $scope.loginData = {
        email: '',
        password: ''
    };

    $scope.registerData = {
        username: '',
        email: '',
        password: ''
    };

    $scope.showRegisterForm = false;

    //checks if the user is authenticated
    $scope.isAuthenticated = function () {
        return (AuthService.isAuthenticated());
    };

    $scope.getUser=function(){
        return(AuthService.getUser());
    }

    //logs the user
    $scope.login = function () {
        const data = {
            email: $scope.loginData.email,
            password: $scope.loginData.password
        };

        //checks if credentials are correct
        $http.post(API_URL + '/login', data)
            .then(function (response) {
                $window.localStorage.setItem('authToken', response.data.token);
                $window.localStorage.setItem('user', JSON.stringify(response.data.user));
                alert('Login successful!');
                $window.location.reload();
            })
            .catch(function (error) {
                alert('Login failed! ' + error.data.error);
            });
    };

    //registers the user
    $scope.register = function () {
        const data = {
            username: $scope.registerData.username,
            email: $scope.registerData.email,
            password: $scope.registerData.password
        };

        $http.post(API_URL + '/users', data)
            .then(function (response) {
                alert('Registration successful! You can now log in.');
                $scope.showRegisterForm = false;
            })
            .catch(function (error) {
                alert('Registration failed! ' + error.data.error);
            });
    };

    //show registration form
    $scope.goToRegister = function () {
        $scope.showRegisterForm = true;
    };

    //show login form
    $scope.goToLogin = function () {
        $scope.showRegisterForm = false;
    };

    //get current user
    $scope.user = $scope.getUser();

    //redirects the user to the homepage if theyre logged in
    if ($scope.isAuthenticated()) {
        $location.path('/home'); 
    }

}]);
