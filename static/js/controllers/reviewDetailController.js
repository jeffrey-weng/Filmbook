angular.module('filmApp')

    .controller('ReviewDetailController',
        function ($scope, $rootScope, $http, $state, $stateParams) {


            $http.get(window.location.origin + "/api/reviews/" + $stateParams.id)
                .then(function (response) {
                    $scope.review = response.data;

                    $http.get(window.location.origin + "/api/users/" + $scope.review.user)
                        .then(function (response2) {
                            $scope.review.user = response2.data;
                            $scope.review.movie = $scope.review.user.watched.find(function (movie) {
                                return movie.title == $scope.review.movie;
                            })

                        })
                    console.log($scope.review);

                })

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
                if (minutes <= 9) minutes = "0" + minutes;

                return month + "/" + day + "/" + year + " " + hour + ":" + minutes + " " + dayOrNight;
            }




        })