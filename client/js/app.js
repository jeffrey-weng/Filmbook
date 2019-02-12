angular.module('filmApp', [
    'ui.router'
])

    .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'home.html'
        })
        .state('movies', {
            url: '/movies',
            templateUrl: 'movies.html',
            controller: 'MoviesController'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
        })
        .state('register', {
            url: '/register',
            templateUrl: 'register.html',
        });

    }]);
