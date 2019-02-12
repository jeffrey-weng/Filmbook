/* register the modules the application depends upon here*/
angular.module('movies', []);

/* register the application and inject all the necessary dependencies */
var app = angular.module('filmApp', ['movies', 'ui.router']);

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {

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

/*
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'UserController'
        });
}]);


var checkLogin = function($q, $timeout, $http, $location, $rootScope) {
    var defer = $q.defer();

    $http.get('/loggedin').success(function(user) {
        $rootScope.errorMessage = null;

        if(user !== '0'){
            $rootScope.currentUser = user;
            defer.resolve();
        }
        else {
            $rootScope.errorMessage = 'Not logged in.';
            defer.reject();
            //$location.url('/login');
        }
    });

    return defer.promise;
};

*/