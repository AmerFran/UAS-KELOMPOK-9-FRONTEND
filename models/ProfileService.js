// ProfileService.js
app.service('ProfileService', ['$http', 'AuthService', function($http, AuthService) {
    const API_URL = 'http://localhost:3000';

    // Function to get the current user
    this.getUser = function() {
        return AuthService.getUser();
    };

    // Function to handle username, email, and password change
    this.change = function(currUser, changeData) {
        const data = {
            username: changeData.username,
            email: changeData.email,
            password: changeData.password
        };

        return $http.put(API_URL + `/users/${currUser.id}`, data);
    };

    // Function to handle password change
    this.changePass = function(currUser, changeData) {
        const data = {
            newpass: String(changeData.newPass),
            oldpass: String(changeData.currPass)
        };

        return $http.put(API_URL + `/users/changepass/${currUser.id}`, data);
    };

    // Function to handle account deletion
    this.deleteAccount = function(currUser) {
        return $http.delete(API_URL + `/users/${currUser.id}`);
    };

}]);
