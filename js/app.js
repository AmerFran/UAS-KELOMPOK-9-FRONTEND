var app = angular.module('healthyLivingApp', ['ngRoute']);

//all routes except / or login is locked behind authenticator 
//so only authenticated or logged in users can access them
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/login.html',
            controller: 'LoginController'
        })
        .when('/home', {
            templateUrl: '/views/home-diet.html',
            controller: 'HomeDietController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/');
                    }
                }
            }
        })
        .when('/about-services', {
            templateUrl: '/views/about-services.html',
            controller: 'AboutServicesController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/'); 
                    }
                }
            }
        })
        .when('/results', {
            templateUrl: '/views/results.html',
            controller: 'ResultsController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/'); 
                    }
                }
            }
        })
        .when('/ingredient', {
            templateUrl: '/views/ingredients.html',
            controller: 'IngredientsController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/');
                    }
                }
            }
        })
        .when('/profile', {
            templateUrl: '/views/profile.html',
            controller: 'ProfileController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/');
                    }
                }
            }
        })
        .when('/shop', {
            templateUrl: '/views/shop.html',
            controller: 'ShopController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/');
                    }
                }
            }
        })
        .when('/payment', {
            templateUrl: '/views/payment.html',
            controller: 'PaymentController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/');
                    }
                }
            }
        })
        .when('/transactions', {
            templateUrl: '/views/trnsactions.html',
            controller: 'TransactionsController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/');
                    }
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        });
});

