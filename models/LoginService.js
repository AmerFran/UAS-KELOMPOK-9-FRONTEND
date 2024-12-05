app.service('LoginService', ['$http', '$q', '$window', function ($http, $q, $window) {
    const API_URL = 'http://localhost:3000';

    //checks if the user is authenticated
    this.isAuthenticated = function () {
        return !!$window.localStorage.getItem('authToken');
    };

    //get the current user
    this.getUser = function () {
        return JSON.parse($window.localStorage.getItem('user'));
    };

    //login user
    this.login = function (data) {
        const deferred = $q.defer();
        
        $http.post(API_URL + '/login', data)
            .then(function (response) {
                deferred.resolve(response);
            })
            .catch(function (error) {
                deferred.reject(error);
            });
        
        return deferred.promise;
    };

    //register a new user
    this.register = function (data) {
        const deferred = $q.defer();
        
        $http.post(API_URL + '/users', data)
            .then(function (response) {
                deferred.resolve(response);
            })
            .catch(function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };
}]);
