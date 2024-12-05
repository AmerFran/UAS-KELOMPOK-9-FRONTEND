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
            templateUrl: '/views/transactions.html',
            controller: 'TransactionsController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/');    
                    }
                }
            }
        })
        .when('/receipt', {
            templateUrl: '/views/receipts.html',
            controller: 'ReceiptController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/');
                    }
                }
            }
        })
        .when('/history', {
            templateUrl: '/views/history.html',
            controller: 'HistoryController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/');
                    }
                }
            }
        })
        .when('/userFoods', {
            templateUrl: '/views/userFoods.html',
            controller: 'FoodController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/');
                    }
                }
            }
        })
        .when('/editFood', {
            templateUrl: '/views/editFood.html',
            controller: 'editFoodController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/');
                    }
                }
            }
        })
        .when('/createFood', {
            templateUrl: '/views/createFood.html',
            controller: 'CreateFoodController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/');
                    }
                }
            }
        })
        .when('/editFood/:foodId', {
            templateUrl: '/views/editFood.html',
            controller: 'EditFoodController',
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

