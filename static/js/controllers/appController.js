angular.module('filmApp')

    .controller('AppController',
    function($scope, $state, USER_ROLES, AuthService) {

        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;
        $scope.authToken = null;

        //If any of these messages are set, a dismissible alert will show up under navbar
        $scope.successMessage = null;
        $scope.warningMessage = null;
        $scope.failureMessage = null;


        $scope.logout = function(user) {
            AuthService.logout(user);
            $scope.currentUser = null;
            $scope.authToken = null;
            $scope.isAuthorized = false;
            $state.go('landing');
        };

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };
    });