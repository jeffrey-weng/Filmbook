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


                                    document.getElementById(review._id).setAttribute("value", localStorage.getItem(review._id));

                                    if (document.getElementById(review._id).getAttribute("value") == "-1") {

                                        document.getElementById(review._id + 'x').className += " opacity";
                                    } else if (document.getElementById(review._id).getAttribute("value") == "1") {

                                        document.getElementById(review._id).className += " opacity";
                                    }

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

            $scope.isValidEdit = function () {
                if (!$scope.reviewMovie || !$scope.reviewRating || !$scope.reviewComment)
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

                console.log("Scoped");

                setTimeout(function () {
                    $scope.refreshReviews()
                }, 800)


                $('#reviewModal').modal('hide');

            }

            $scope.reviewDate = function (date) {
                var d = new Date(date);

                var month = d.getMonth() + 1;
                var day = d.getDate();
                var year = d.getFullYear();
                var hour = d.getHours();
                var dayOrNight = "";

                if (hour >= 0 && hour <= 11) {
                    dayOrNight = "a.m";
                    if (hour == 0)
                        hour = 12;
                } else {
                    dayOrNight = "p.m";
                    if (hour > 12)
                        hour %= 12;
                }
                var minutes = d.getMinutes();
                if(minutes<=9) minutes="0"+minutes;

                return month + "/" + day + "/" + year + " " + hour + ":" + minutes + " " + dayOrNight;
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

            $scope.editReview = function (review) {

                $scope.reviewId = review._id;
                $scope.reviewMovie = review.movie.title;
                $scope.reviewRating = review.rating;
                $scope.reviewComment = review.description;
                $scope.reviewCreation = review.created_at;

                $scope.review = review;
            }

            $scope.reviewEdited = function () {
                alert("Review edited.");

                $('#editModal').modal('hide');


                var pos = $scope.reviews.findIndex(function (value) {
                    return value._id == $scope.reviewId;
                })
                console.log(pos);
                console.log($scope.review);

                $scope.review.description = $scope.reviewComment;
                $scope.review.rating = $scope.reviewRating;

                $scope.reviews[pos] = $scope.review;


            }

            $scope.deleteReview = function (review) {

                var pos = $scope.reviews.findIndex(function (value) {
                    return value.user.username == $scope.currentUser.username && value.movie.title == review.movie.title && value.created_at == review.created_at;
                })
                $scope.reviews.splice(pos, 1);

                $http.delete(window.location.origin + "/api/reviews/" + review._id);

            }

            $scope.orderByCriteria = "";

            $scope.orderBy = function (criteria) {
                $scope.orderByCriteria = criteria;
            }


            $scope.upVote = function (review) {

                if (!localStorage.getItem(review._id))
                    localStorage.setItem(review._id, 0);

                document.getElementById(review._id).setAttribute("value", localStorage.getItem(review._id));

                if (document.getElementById(review._id).getAttribute("value") == "1")
                    return;

                review.upVotes++;

                if (document.getElementById(review._id).getAttribute("value") == "0") {
                    document.getElementById(review._id).setAttribute("value", "1");
                    localStorage.setItem(review._id, 1);
                    document.getElementById(review._id).className += " opacity";
                } else if (document.getElementById(review._id).getAttribute("value") == "-1") {
                    document.getElementById(review._id).setAttribute("value", "0");
                    localStorage.setItem(review._id, 0);
                    document.getElementById(review._id + 'x').classList.remove("opacity");
                }

                $http.put(window.location.origin + "/api/reviews/" + review._id, {
                        upvotes: review.upVotes
                    })
                    .then(function (response) {
                        console.log(response);
                    });

            }
            $scope.downVote = function (review) {
                if (!localStorage.getItem(review._id))
                    localStorage.setItem(review._id, 0);

                document.getElementById(review._id).setAttribute("value", localStorage.getItem(review._id));

                if (document.getElementById(review._id).getAttribute("value") == "-1")
                    return;

                review.upVotes--;

                if (document.getElementById(review._id).getAttribute("value") == "0") {
                    document.getElementById(review._id).setAttribute("value", "-1");
                    localStorage.setItem(review._id, -1);
                    document.getElementById(review._id + 'x').className += " opacity";
                } else if (document.getElementById(review._id).getAttribute("value") == "1") {
                    document.getElementById(review._id).setAttribute("value", "0");
                    localStorage.setItem(review._id, 0);
                    document.getElementById(review._id).classList.remove("opacity");
                }

                $http.put(window.location.origin + "/api/reviews/" + review._id, {
                        upvotes: review.upVotes
                    })
                    .then(function (response) {
                        console.log(response);
                    });
            }


        });