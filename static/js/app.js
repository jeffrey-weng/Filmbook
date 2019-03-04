angular.module('filmApp', [
    'ui.router'
])
//Authentication-related user roles
    .constant('USER_ROLES', {
        all: '*',
        admin: 'admin',
        editor: 'editor',
        guest: 'guest'
    })

    //Authentication-related event constants, to be used with $broadcast
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .config(['$urlRouterProvider', '$stateProvider', '$httpProvider', 'USER_ROLES',
        function($urlRouterProvider, $stateProvider, $httpProvider, USER_ROLES) {

            $stateProvider
                .state('landing', {
                    url: '/',
                    templateUrl: 'landing.html',
                    data: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .state('home', {
                    url: '/home',
                    templateUrl: 'home.html',
                    controller: 'MoviesController',
                    data: {
                        authorizedRoles: [USER_ROLES.all]
                    }

                    /*  resolve: {
                        auth: function resolveAuthentication(AuthResolver) {
                            return AuthResolver.resolve();
                        }
                    } */
                })
                .state('movies', {
                    url: '/movies',
                    templateUrl: 'movies.html',
                    controller: 'MoviesController',
                    data: {
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
                    }
                })
                .state('people', {
                    url: '/people',
                    templateUrl: 'people.html',
                    controller: 'PeopleController',
                    data: {
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
                    }
                })

                /*
                .state('home.profile', {
                    url: '/profile',
                    templateUrl: 'profile.html',
                    controller: 'ProfileController',
                    data: {
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
                    }
                })
                .state('home.reviews', {
                    url: '/reviews',
                    templateUrl: 'reviews.html',
                    controller: 'ReviewController'
                    data: {
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
                    }
                })
                .state('home.discussions', {
                    url: '/discussions',
                    templateUrl: 'discussions.html',
                    controller: 'DiscussionController'
                    data: {
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
                    }
                })
                */

                .state('login', {
                    url: '/login',
                    templateUrl: 'login.html',
                    controller: 'LoginController',
                    data: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .state('register', {
                    url: '/register',
                    templateUrl: 'register.html',
                    controller: 'RegisterController',
                    data: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .state('404', {
                    url: '/404',
                    templateUrl: '404.html',
                })
                .state('profile',{
                    url: '/profile',
                    templateUrl: 'profile.html',
                    controller: 'MoviesController',
                    data:{
                        authorizedRoles: [USER_ROLES.all]
                    }
                });

            $urlRouterProvider.otherwise('/');

            /*
            $httpProvider.interceptors.push([
                '$injector',
                function ($injector) {
                    return $injector.get('AuthInterceptor');
                }
            ]);
            */

        }])


/*
    .run(['$rootScope', 'AUTH_EVENTS', 'AuthService', function ($rootScope, AUTH_EVENTS, AuthService) {
        $rootScope.$on('$stateChangeStart', function (event, next) {
            var authorizedRoles = next.data.authorizedRoles;
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                if (AuthService.isAuthenticated()) {
                    // user not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
        });
    }]);

*/