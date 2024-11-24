app.factory('AuthService', function($window,$http) {
    var service = {};
    const API_URL = 'http://localhost:3000';

    //checks if user is logged in
    service.isAuthenticated = function() {
        return !!$window.localStorage.getItem('authToken');
    };

    //logs the user out
    service.logout = function() {
        $window.localStorage.removeItem('authToken');
    };

    //gets user detail
    service.getUser = function () {
        const user = JSON.parse($window.localStorage.getItem('user'));
        return user || {};
    };

    //refreshes the user in localstorage
    service.refreshAuth = function() {
        var user = this.getUser();
        if (user && user.id) {
            $http.get(API_URL + `/users/${user.id}`)
                .then(function(response) {
                    $window.localStorage.setItem('user', JSON.stringify(response.data));
                    $window.location.reload();
                })
                .catch(function(error) {
                    console.error('Error refreshing auth', error);
                });
        } else {
            console.error('No user ID found');
        }
    };
    

    return service;
});