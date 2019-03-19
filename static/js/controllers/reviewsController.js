angular.module('filmApp')

    .filter('myFilter', function () {
        return function (inputs, filterValues) {
            var output = [];
            angular.forEach(inputs, function (input) {

                if (!filterValues[0]) output.push(input);

                else if ((input.movie.title && input.movie.title.toLowerCase().includes(filterValues[0].toLowerCase())) ||
                    (input.user.username && input.user.username.toLowerCase().includes(filterValues[0])) ||
                    (input.description && input.description.toLowerCase().includes(filterValues[0])))
                    output.push(input);
            });
            return output;
        };
    })

    .controller('ReviewsController',
        function ($scope, $rootScope, $http) {


            $('#reviewModal').on('hidden.bs.modal', function (e) {
                $(this)
                    .find("textarea,select")
                    .val('')
                    .end()
                    .find("input[type=radio]")
                    .prop("checked", "")
                    .end();
            })


            $scope.refreshReviews = function () {
                $http.get(window.location.origin + "/api/reviews/")
                    .then(function (response) {
                        $scope.reviews = response.data;
                        $scope.reviews.forEach(function (review) {
                            $http.get(window.location.origin + "/api/users/" + review.user)
                                .then(function (response2) {
                                    review.user = response2.data;
                                    review.movie = review.user.watched.find(function (movie) {
                                        return movie.title == review.movie;
                                    })
                                })

                        })
                        console.log($scope.reviews);
                    })

            }

            $scope.refreshReviews();


            $scope.isValidReview = function () {
                if (!$scope.comment || !$scope.rating2 || !$scope.movieName)
                    return false;
                else return true;
            }

            $scope.makeReview = function () {
                document.getElementById("reviewForm").reset();
                document.getElementById("movieName2").selectedIndex = "0";

                $scope.comment = undefined;

                $scope.rating2 = undefined;

                $scope.movieName = undefined;
            }


            $scope.reviewSubmitted = function () {

                alert("Review submitted.");

                $('#reviewModal').modal('hide');
                $http.get(window.location.origin + "/api/users/" + $scope.currentUser.id)
                    .then(function (response2) {
                        var user = response2.data;
                        var movie = user.watched.find(function (movie) {
                            return movie.title == $scope.movieName;
                        })

                        $scope.reviews.push({
                            'user': user,
                            'movie': movie,
                            'rating': $scope.rating2,
                            'description': $scope.comment,
                            'created_at': new Date()
                        })
                    })


            }

            $scope.reviewDate = function (date) {
                var d = new Date(date);

                var month = d.getMonth() + 1;
                var day = d.getDate();
                var year = d.getFullYear();

                return month + "/" + day + "/" + year;
            }


            $scope.follow = function (person) {

                var x = function (person) {

                    if (typeof person == "object") {

                        if ($rootScope.targets.includes(person._id))
                            return true;
                        else return false;
                    } else {
                        if ($rootScope.targets.includes(person))
                            return true;
                        else return false;
                    }
                }

                if (typeof person == "object") {
                    if (x(person)) {
                        var index = $rootScope.targets.indexOf(person._id);
                        $rootScope.targets.splice(index, 1);

                        $http.delete(window.location.origin + "/api/follow/" + $scope.currentUser.id, {
                            data: {
                                target: person._id
                            },
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            }
                        })
                    } else {
                        $rootScope.targets.push(person._id);

                        $http.post(window.location.origin + "/api/follow/" + $scope.currentUser.id, {
                            target: person._id
                        })
                    }
                } else {
                    if (x(person)) {
                        var index = $rootScope.targets.indexOf(person);
                        $rootScope.targets.splice(index, 1);

                        $http.delete(window.location.origin + "/api/follow/" + $scope.currentUser.id, {
                            data: {
                                target: person
                            },
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            }
                        })

                    } else {
                        $rootScope.targets.push(person);

                        $http.post(window.location.origin + "/api/follow/" + $scope.currentUser.id, {
                            target: person
                        })

                    }
                }



            }

        });