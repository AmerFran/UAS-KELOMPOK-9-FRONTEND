var app = angular.module('healthyLivingApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/home-diet.html',
            controller: 'HomeDietController'
        })
        .when('/about-services', {
            templateUrl: '/views/about-services.html',
            controller: 'AboutServicesController'
        })
        .when('/results', {
            templateUrl: '/views/results.html',
            controller: 'ResultsController'
        })
        .otherwise({
            redirectTo: '/'
        });
});
