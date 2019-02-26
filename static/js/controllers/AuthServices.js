angular.module('filmApp')

    .controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService, $state) {

        $scope.credentials = { username: '', password: ''};

        $scope.login = function (credentials) {
            AuthService.login(credentials).then(function (user) {
                console.log('Back in AuthService.login.then()');
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $scope.setCurrentUser(user); //{user: user.toAuthJSON()}
                console.log('CurrentUser variable set.');
                $state.go('landing');
            }, function () {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        };
    })

    .controller('RegisterController', function($scope, AuthService, $state){

        $scope.newUser = { username:'', password:'', password2: ''};
        $scope.registerWarning = null;
        $scope.register = function() {

            console.log('Entering RegisterController.register() with newUser data:');
            console.log($scope.newUser);

            if($scope.newUser.password != $scope.newUser.password2){
                $scope.registerWarning = 'Error: Passwords must match!';
            }
            else {
                AuthService.register($scope.newUser).then(function (msg) {

                    console.log('Returned from AuthService.register(), going to login page...');

                    $state.go('login');
                    $scope.successMessage = 'Registration successful! Msg: ' + msg;
                }, function (err) {
                    $scope.failureMessage = 'Registration failed! Error: ' + err;
                });
            }
        };
    })

    .service('Session', function () {
        this.create = function (userToken, username, userRole) {
            console.log('Creating Session...');
            this.token = userToken;
            this.username = username;
            this.role = userRole;
        };
        this.destroy = function () {
            this.token = null;
            this.username = null;
            this.role = null;
        };
    })


    .factory('AuthService', ['$http', '$window', 'Session', function ($http, $window, Session) {

        //Helper methods for getting/setting/deleting the JWT token in browser header
        function loadUserToken() {
            console.log('Loading user token...');
            var token = $window.localStorage.getItem('auth_jwt');
            if(token) { useUserToken(token); }
        }

        function saveUserToken(token, username, role) {
            console.log('Inside saveUserToken');
            Session.create(token, username, role);
            console.log('Session created. Saving to localStorage...');
            $window.localStorage.setItem('auth_jwt', token);
            console.log('Saved to localStorage.');
        }

        function useUserToken(token) {
            console.log('Token found. Using token...');
            //isAuthenticated = true;
            //authToken = token;
            $http.defaults.headers.common.Authorization = token;
        }

        function deleteUserToken() {
            Session.destroy();
            $http.defaults.headers.common.Authorization = undefined;
            $window.localStorage.removeItem('auth_jwt');
        }

        var authService = {};

        authService.login = function (credentials) {
            return $http
                .post('/auth/login', credentials)
                .then(function (res) {
                    if(res.statusCode === 422) { //if login failed
                        if(res.data.hasOwnProperty('error')) { return res.data.error; }
                        else{ return res.data.info; }
                    }
                    console.log('Passport authenticated succesfully. Saving user token...');
                    console.log(res);
                    //Session.create(res.data.id, res.data.user.id, res.data.user.role);
                    saveUserToken(res.data.user.token, res.data.user.username, res.data.user.role);
                    loadUserToken();

                    console.log('Login callback done. Returning res.data.user:');
                    console.log(res.data.user);
                    return res.data.user;
                });
        };

        authService.register = function (newUser) {
            console.log('Inside authService.register()');
            return $http.post('/auth/register', newUser)
                .then(function (res) {
                    console.log('Response from POST /auth/register: ');
                    console.log(res);
                    return res.data.user;
                }, function(res){
                    console.log(res);
                    return res;
                });
        };

        authService.logout = function(user) {
            return $http.post('/auth/logout', user)
                .then(function(res) {
                    deleteUserToken();
                    return res.json({success: true, message: 'Logged out successfully.'});
                })
        };

        authService.isAuthenticated = function () {
            return !!Session.username;
        };

        //example usage: <ng-if="isAuthorized('admin')"> or <ng-if="isAuthorized('editor')">
        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
                authorizedRoles.indexOf(Session.role) !== -1);
        };


        loadUserToken();

        return authService;
    }]);

/*
    .factory('AuthInterceptor', function ($rootScope, $q,
                                          AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized,
                    419: AUTH_EVENTS.sessionTimeout,
                    440: AUTH_EVENTS.sessionTimeout
                }[response.status], response);
                return $q.reject(response);
            }
        };
    })

    .factory('AuthResolver', function ($q, $rootScope, $state) {
        return {
            resolve: function () {
                var deferred = $q.defer();
                var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
                    if (angular.isDefined(currentUser)) {
                        if (currentUser) {
                            deferred.resolve(currentUser);
                        } else {
                            deferred.reject();
                            $state.go('login');
                        }
                        unwatch();
                    }
                });
                return deferred.promise;
            }
        };
    });

*/