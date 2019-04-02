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
        function ($scope, $rootScope, $http, $state, $interval) {


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

                            $scope.dateRecorded(review);

                            $http.get(window.location.origin + "/api/users/" + review.user)
                                .then(function (response2) {
                                    review.user = response2.data;
                                    review.movie = review.user.watched.find(function (movie) {
                                        return movie.title == review.movie;
                                    })

                                    if (document.getElementById(review._id)) {

                                        document.getElementById(review._id).setAttribute("value", localStorage.getItem(review._id));

                                        if (document.getElementById(review._id).getAttribute("value") == "-1") {

                                            document.getElementById(review._id + 'x').className += " opacity";
                                        } else if (document.getElementById(review._id).getAttribute("value") == "1") {

                                            document.getElementById(review._id).className += " opacity";
                                        }
                                    }
                                })

                        })

                        $interval(function () {
                            $scope.reviews.forEach(function (value) {
                                $scope.dateRecorded(value)

                            })


                        }, 10000);
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

            $scope.editReview = function (event, review) {

                $scope.reviewId = review._id;
                $scope.reviewMovie = review.movie.title;
                $scope.reviewRating = review.rating;
                $scope.reviewComment = review.description;
                $scope.reviewCreation = review.created_at;

                $scope.review = review;

                $('#editModal').modal('show');

                event.stopPropagation();
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

            $scope.deleteReview = function (event, review) {

                var pos = $scope.reviews.findIndex(function (value) {
                    return value.user.username == $scope.currentUser.username && value.movie.title == review.movie.title && value.created_at == review.created_at;
                })
                $scope.reviews.splice(pos, 1);

                $http.delete(window.location.origin + "/api/reviews/" + review._id);

                event.stopPropagation();

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

            $scope.reviewDetails = function (e, review) {
                $state.go('reviewDetail', {
                    id: review._id
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


            $scope.showMovieDetails = function (event, movie) {
                var d = new Date(movie.release_date);
                $scope.movieId = movie.id;
                $scope.movieTitle = movie.title;
                $scope.movieDescription = movie.overview;
                $scope.moviePosterPath = movie.poster_path;
                $scope.movieReleaseDate = movie.release_date;
                $scope.movieRating = movie.vote_average;
                $scope.movieGenres = movie.genre_ids;

                $scope.movieDisplayDate = monthNames[d.getMonth()] + " " + d.getUTCDate() + ", " + d.getFullYear();
                $scope.movieDisplayGenres = "";

                for (var i = 0; i < movie.genre_ids.length; i++)
                    for (var j = 0; j < genres.length; j++)
                        if (movie.genre_ids[i] === genres[j].id)
                            if (i === movie.genre_ids.length - 1)
                                $scope.movieDisplayGenres += genres[j].name;
                            else
                                $scope.movieDisplayGenres += genres[j].name + ", ";

                $('#movieDetailsModal').modal('show');
                event.stopPropagation();
            };


            $('.dropdown-menu a').click(function () {
                $('#dropdownMenuButton').text($(this).text());
            });

            $scope.reviewPreview = function (review) {

                if (review.description.length > 150)
                    return review.description.substring(0, 150) + "...";

                else return review.description;
            }

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