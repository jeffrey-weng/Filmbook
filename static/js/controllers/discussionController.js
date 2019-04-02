angular.module('filmApp')


    .controller('DiscussionsController',
        function ($scope, $rootScope, $http, $state, $interval) {


            $('#discussionModal').on('hidden.bs.modal', function (e) {
                $(this)
                    .find("textarea,select")
                    .val('')
                    .end();
            })


            $scope.refreshDiscussions = function () {
                $http.get(window.location.origin + "/api/discussions/")
                    .then(function (response) {
                        $scope.discussions = response.data;
                        console.log(response.data);
                        $scope.discussions.forEach(function (discussion) {

                            $scope.dateRecorded(discussion);

                            $http.get(window.location.origin + "/api/users/" + discussion.user)
                                .then(function (response2) {
                                    discussion.user = response2.data;

                                    $http.get(window.location.origin + "/api/comments/discussions/" + discussion._id)
                                        .then(function (response3) {
                                            discussion.comments = response3.data;


                                            document.getElementById(discussion._id).setAttribute("value", localStorage.getItem(discussion._id));

                                            if (document.getElementById(discussion._id).getAttribute("value") == "-1") {

                                                document.getElementById(discussion._id + 'x').className += " opacity";
                                            } else if (document.getElementById(discussion._id).getAttribute("value") == "1") {

                                                document.getElementById(discussion._id).className += " opacity";
                                            }
                                        })


                                })

                        })

                        $interval(function () {
                            $scope.discussions.forEach(function (value) {
                                $scope.dateRecorded(value)

                            })


                        }, 10000);
                        //console.log("Discussions: "+$scope.discussions);
                    })

            }

            $scope.refreshDiscussions();


            $scope.isValidDiscussion = function () {
                if (!$scope.title)
                    return false;
                else return true;
            }

            $scope.isValidEdit = function () {
                if (!$scope.discussionTitle)
                    return false;
                else return true;
            }


            $scope.makeDiscussion = function () {
                document.getElementById("discussionForm").reset();


                $scope.title = undefined;

                $scope.description = undefined;

            }


            $scope.discussionSubmitted = function () {

                alert("Discussion post submitted.");

                console.log("Scoped");

                setTimeout(function () {
                    $scope.refreshDiscussions()
                }, 800)


                $('#discussionModal').modal('hide');

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


            $('.dropdown-menu a').click(function () {
                $('#dropdownMenuButton').text($(this).text());
            });


            $scope.editDiscussion = function (event, discussion) {
                $scope.discussionId = discussion._id;
                $scope.discussionTitle = discussion.title;
                $scope.discussionDescription = discussion.description;
                $scope.discussionCreation = discussion.created_at;

                $scope.discussion = discussion;

                $('#editModal').modal('show');

                event.stopPropagation();
            }

            $scope.discussionEdited = function () {
                alert("discussion edited.");

                $('#editModal').modal('hide');


                var pos = $scope.discussions.findIndex(function (value) {
                    return value._id == $scope.discussionId;
                })
                console.log(pos);
                console.log($scope.discussion);

                $scope.discussion.description = $scope.discussionDescription;
                $scope.discussion.title = $scope.discussionTitle;

                $scope.discussions[pos] = $scope.discussion;


            }

            $scope.deleteDiscussion = function (event, discussion) {

                var pos = $scope.discussions.findIndex(function (value) {
                    return value._id == discussion._id;
                })
                $scope.discussions.splice(pos, 1);

                $http.delete(window.location.origin + "/api/discussions/" + discussion._id);

                event.stopPropagation();

            }

            $scope.orderByCriteria = "";

            $scope.orderBy = function (criteria) {
                $scope.orderByCriteria = criteria;
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

            $scope.postPreview = function (discussion) {
                if (discussion.description.length > 150)
                    return discussion.description.substring(0, 150) + "...";

                else return discussion.description;
            }

            $scope.titlePreview = function (discussion) {
                if (discussion.title.length > 42)
                    return discussion.title.substring(0, 42) + "...";

                else return discussion.title;
            }


            $scope.discussionPostDetails = function (event, discussion) {
                $state.go('discussionDetail', {
                    id: discussion._id
                });
            }



            $scope.showProfileDetails = function (event, person) {

                $scope.id = person._id;
                $scope.avatar = person.avatar;
                $scope.username = person.username;

                $scope.favMovies = "";

                for (var i = 0; i < person.favoriteMovies.length; i++) {
                    if ((i == person.favoriteMovies.length - 1))
                        $scope.favMovies += person.favoriteMovies[i].title;
                    else
                        $scope.favMovies += person.favoriteMovies[i].title + ", ";
                }

                $scope.watched = "";

                for (var i = 0; i < person.watched.length; i++) {
                    if ((i == person.watched.length - 1))
                        $scope.watched += person.watched[i].title;
                    else
                        $scope.watched += person.watched[i].title + ", ";
                }

                var temp = {};
                for (var i = 0; i < person.watched.length; i++)
                    for (var j = 0; j < person.watched[i].genre_ids.length; j++)
                        if (!temp[person.watched[i].genre_ids[j]])
                            temp[person.watched[i].genre_ids[j]] = 1;
                        else
                            temp[person.watched[i].genre_ids[j]] = temp[person.watched[i].genre_ids[j]] + 1;

                var frequencies = [];
                for (var key in temp) {
                    frequencies.push(temp[key]); //holds the frequencies of genres watched
                }
                frequencies.sort();
                frequencies.reverse();
                //console.log(frequencies);
                frequencies.splice(3, frequencies.length - 3); //holds top 3 frequencies
                var top3 = [];

                for (var key in temp) {
                    if (frequencies.includes(temp[key])) {
                        top3.push(key); //contains top 3 genre IDs

                    }

                }
                $scope.favGenres = "";

                var count = 0;
                //console.log(frequencies);
                //console.log(top3);

                for (var i = 0; i < genres.length; i++) {
                    if (top3.includes(genres[i].id.toString())) {
                        if (count == 2) {
                            $scope.favGenres += genres[i].name;
                            break;
                        } else
                            $scope.favGenres += genres[i].name + ", ";
                        count++;
                    }
                }

                $scope.watchlist = "";

                for (var i = 0; i < person.watchlist.length; i++) {
                    if ((i == person.watchlist.length - 1))
                        $scope.watchlist += person.watchlist[i].title;
                    else
                        $scope.watchlist += person.watchlist[i].title + ", ";
                }

                $('#personDetailsModal').modal('show');
                event.stopPropagation();
            }

            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];


            //same as for reviews
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

            const genres = [{
                    "id": 28,
                    "name": "Action"
                },
                {
                    "id": 12,
                    "name": "Adventure"
                },
                {
                    "id": 16,
                    "name": "Animation"
                },
                {
                    "id": 35,
                    "name": "Comedy"
                },
                {
                    "id": 80,
                    "name": "Crime"
                },
                {
                    "id": 99,
                    "name": "Documentary"
                },
                {
                    "id": 18,
                    "name": "Drama"
                },
                {
                    "id": 10751,
                    "name": "Family"
                },
                {
                    "id": 14,
                    "name": "Fantasy"
                },
                {
                    "id": 36,
                    "name": "History"
                },
                {
                    "id": 27,
                    "name": "Horror"
                },
                {
                    "id": 10402,
                    "name": "Music"
                },
                {
                    "id": 9648,
                    "name": "Mystery"
                },
                {
                    "id": 10749,
                    "name": "Romance"
                },
                {
                    "id": 878,
                    "name": "Science Fiction"
                },
                {
                    "id": 10770,
                    "name": "TV Movie"
                },
                {
                    "id": 53,
                    "name": "Thriller"
                },
                {
                    "id": 10752,
                    "name": "War"
                },
                {
                    "id": 37,
                    "name": "Western"
                }
            ];

        });