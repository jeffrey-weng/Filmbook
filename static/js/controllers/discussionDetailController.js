angular.module('filmApp')

    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown", function (e) {
                if (e.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter, {
                            'e': e
                        });
                    });
                    e.preventDefault();
                }
            });
        };
    })

    .controller('DiscussionDetailController',
        function ($scope, $rootScope, $http, $state, $stateParams, $interval) {

            $scope.refreshComments = function () {
                $http.get(window.location.origin + "/api/discussions/" + $stateParams.id)
                    .then(function (response) {
                        $scope.discussion = response.data;

                        $scope.dateRecorded($scope.discussion);

                        $interval(function () {
                            $scope.dateRecorded($scope.discussion)

                        }, 10000);

                        $http.get(window.location.origin + "/api/users/" + $scope.discussion.user)
                            .then(function (response2) {
                                $scope.discussion.user = response2.data;

                                $http.get(window.location.origin + "/api/comments/discussions/" + $stateParams.id)
                                    .then(function (response3) {
                                        $scope.discussion.comments = response3.data;

                                        $scope.discussion.comments.forEach(function (value) {

                                            $scope.dateRecorded(value);

                                            $http.get(window.location.origin + "/api/users/" + value.user)
                                                .then(function (response4) {

                                                    value.user = response4.data;
                                                })

                                        })
                                        $interval(function () {
                                            $scope.discussion.comments.forEach(function (value) {
                                                $scope.dateRecorded(value)

                                            })


                                        }, 10000);

                                        console.log("Discussion: " + $scope.discussion);

                                    })
                            })
                    })
            }
            $scope.refreshComments();


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

            $scope.timeStamp = function (review) {

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



            $scope.discussionDate = function (date) {
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

            $scope.commentPosted = function () {

                setTimeout(function () {
                    $scope.refreshComments();
                    $scope.newComment = "";
                }, 700)
            }

            $scope.newComment = "";

            $scope.isValidComment = function () {
                if (!$scope.currentUser) return false;

                if ($scope.newComment.length == 0) return false;
                else return true;
            }

            $scope.editComment = function (comment) {

                document.getElementById(comment._id).removeAttribute("readonly");

                //code to put cursor at the end of text by default when focused
                var input = $('#' + comment._id);
                input.focus();
                var tmpStr = input.val();
                input.val('');
                input.val(tmpStr);

                comment.beingEdited = true;
            }

            $scope.calculateRows = function (comment) {
                if (Math.ceil(comment.description.length / 72) > 2)
                    return Math.ceil(comment.description.length / 72);

                else return 2;
            }

            //why isnt this crap working omg
            autosize($('textarea'));


            $scope.cancelEdit = function (comment) {
                $('#' + comment._id).attr("readonly", '');
                $('#' + comment._id).val(comment.description);
                comment.beingEdited = false;
            }
            $scope.commentEdited = function (comment) {

                setTimeout(function () {
                    $scope.refreshComments();
                    $('#' + comment._id).attr("readonly", '');
                    comment.beingEdited = false;
                }, 400)
            }

            $scope.deleteComment = function (comment) {
                var pos = $scope.discussion.comments.findIndex(function (value) {
                    return value._id == comment._id;
                })
                $scope.discussion.comments.splice(pos, 1);

                $http.delete(window.location.origin + "/api/comments/" + comment._id);
            }

            $scope.upVote = function (discussion) {

                if (!localStorage.getItem(discussion._id))
                    localStorage.setItem(discussion._id, 0);

                document.getElementById(discussion._id).setAttribute("value", localStorage.getItem(discussion._id));

                if (document.getElementById(discussion._id).getAttribute("value") == "1")
                    return;

                discussion.upVotes++;

                if (document.getElementById(discussion._id).getAttribute("value") == "0") {
                    document.getElementById(discussion._id).setAttribute("value", "1");
                    localStorage.setItem(discussion._id, 1);
                    document.getElementById(discussion._id).className += " opacity";
                } else if (document.getElementById(discussion._id).getAttribute("value") == "-1") {
                    document.getElementById(discussion._id).setAttribute("value", "0");
                    localStorage.setItem(discussion._id, 0);
                    document.getElementById(discussion._id + 'x').classList.remove("opacity");
                }

                $http.put(window.location.origin + "/api/discussions/" + discussion._id, {
                        upVotes: discussion.upVotes
                    })
                    .then(function (response) {
                        console.log(response);
                    });

            }
            $scope.downVote = function (discussion) {
                if (!localStorage.getItem(discussion._id))
                    localStorage.setItem(discussion._id, 0);

                document.getElementById(discussion._id).setAttribute("value", localStorage.getItem(discussion._id));

                if (document.getElementById(discussion._id).getAttribute("value") == "-1")
                    return;

                discussion.upVotes--;

                if (document.getElementById(discussion._id).getAttribute("value") == "0") {
                    document.getElementById(discussion._id).setAttribute("value", "-1");
                    localStorage.setItem(discussion._id, -1);
                    document.getElementById(discussion._id + 'x').className += " opacity";
                } else if (document.getElementById(discussion._id).getAttribute("value") == "1") {
                    document.getElementById(discussion._id).setAttribute("value", "0");
                    localStorage.setItem(discussion._id, 0);
                    document.getElementById(discussion._id).classList.remove("opacity");
                }

                $http.put(window.location.origin + "/api/discussions/" + discussion._id, {
                        upVotes: discussion.upVotes
                    })
                    .then(function (response) {
                        console.log(response);
                    });
            }



        });