angular.module('filmApp')

    .controller('ReviewDetailController',
        function ($scope, $rootScope, $http, $state, $stateParams, $interval) {


            $http.get(window.location.origin + "/api/reviews/" + $stateParams.id)
                .then(function (response) {
                    $scope.review = response.data;

                    $scope.dateRecorded($scope.review);

                    $http.get(window.location.origin + "/api/users/" + $scope.review.user)
                        .then(function (response2) {
                            $scope.review.user = response2.data;
                            $scope.review.movie = $scope.review.user.watched.find(function (movie) {
                                return movie.title == $scope.review.movie;
                            })

                        })

                    $interval(function () {
                        $scope.dateRecorded($scope.review)

                    }, 10000);
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

            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];



            $scope.dateRecorded = function (review) {
                var date = new Date();
                var activityDate = new Date(review.created_at);

                var timeDiff = Math.abs(date.getTime() - activityDate.getTime());

                if (timeDiff < 86400000 && timeDiff >= 3600000) {
                    var diffHours = Math.floor(timeDiff / 3600000);
                    if (diffHours == 1) review["elapsed"] = "1 hour ago";
                    else review["elapsed"] = diffHours + " hours ago";
                } else if (timeDiff < 3600000 && timeDiff >= 60000) {
                    var diffMinutes = Math.floor(timeDiff / 60000);
                    if (diffMinutes == 1) review["elapsed"] = "1 minute ago";
                    else review["elapsed"] = diffMinutes + " minutes ago";
                } else if (timeDiff < 60000) {
                    review["elapsed"] = "Just now";
                } else {
                    var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
                    if (diffDays == 1) review["elapsed"] = "1 day ago";
                    else review["elapsed"] = diffDays + " days ago";
                }
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

            $scope.timeStamp = function (review) {

                if(!review) return;
                var activityDate = new Date(review.created_at);

                var day = activityDate.getDay();

                if (day == 0) day = "Sunday"
                else if (day == 1) day = "Monday"
                else if (day == 2) day = "Tuesday"
                else if (day == 3) day = "Wednesday"
                else if (day == 4) day = "Thursday"
                else if (day == 5) day = "Friday"
                else if (day == 6) day = "Saturday"

                var month = monthNames[activityDate.getMonth()];

                var date = activityDate.getDate();

                var year = activityDate.getFullYear();

                var time = activityDate.toLocaleTimeString();

                return day + ", " + month + " " + date + ", " + year + " at " + time;


            }



        })