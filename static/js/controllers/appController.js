angular.module('filmApp')

    .controller('AppController',
        function ($scope, $state, USER_ROLES, AuthService, $http, $rootScope) {

            $scope.currentUser = null;
            $scope.userRoles = USER_ROLES;
            $scope.isAuthorized = AuthService.isAuthorized;
            $scope.authToken = null;

            //If any of these messages are set, a dismissible alert will show up under navbar
            $scope.successMessage = null;
            $scope.warningMessage = null;
            $scope.failureMessage = null;


            $scope.logout = function (user) {
                AuthService.logout(user);
                $scope.currentUser = null;
                $scope.authToken = null;
                $scope.isAuthorized = false;
                $state.go('landing');
            };

            $scope.setCurrentUser = function (user) {
                $scope.currentUser = user;
            };

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


            $scope.showProfileDetails = function (person) {

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


            }


            $scope.calculateFavGenres = function () {
                var temp = {};
                for (var i = 0; i < $scope.currentUser.watched.length; i++)
                    for (var j = 0; j < $scope.currentUser.watched[i].genre_ids.length; j++)
                        if (!temp[$scope.currentUser.watched[i].genre_ids[j]])
                            temp[$scope.currentUser.watched[i].genre_ids[j]] = 1;
                        else
                            temp[$scope.currentUser.watched[i].genre_ids[j]] = temp[$scope.currentUser.watched[i].genre_ids[j]] + 1;

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
                if ($scope.favGenres.length == 0)
                    return "None";

                return $scope.favGenres;

            }

            $scope.isFollowing = function (id) {
                if ($rootScope.targets.includes(id))
                    return true;
                else return false;

            }


            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];


            $scope.showMovieDetails = function (movie) {
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



            };


            $scope.inWatchlist = function (movieTitle) {
                if ($scope.currentUser) {
                    for (var i = 0; i < $scope.currentUser.watchlist.length; i++) {
                        if ($scope.currentUser.watchlist[i].title == movieTitle)
                            return true;
                    }
                    return false;
                }
            }

            $scope.inWatched = function (movieTitle) {
                if ($scope.currentUser) {
                    for (var i = 0; i < $scope.currentUser.watched.length; i++) {
                        if ($scope.currentUser.watched[i].title == movieTitle)
                            return true;
                    }
                    return false;
                }
            }

            $scope.inFavorites = function (movieTitle) {
                if ($scope.currentUser) {
                    for (var i = 0; i < $scope.currentUser.favoriteMovies.length; i++) {
                        if ($scope.currentUser.favoriteMovies[i].title == movieTitle)
                            return true;
                    }
                    return false;
                }
            }

            $scope.addToFavorites = function () {

                if ($scope.currentUser.favoriteMovies.length != 0)
                    if (!$scope.currentUser.favoriteMovies.every(function (value) {
                            return $scope.movieTitle !== value.title
                        })) {
                        alert("Movie already in Favorites.");
                        return;
                    }

                $scope.currentUser.favoriteMovies.unshift({
                    id: $scope.movieId,
                    title: $scope.movieTitle,
                    overview: $scope.movieDescription,
                    poster_path: $scope.moviePosterPath,
                    release_date: $scope.movieReleaseDate,
                    genre_ids: $scope.movieGenres,
                    vote_average: $scope.movieRating
                });

                $http.put(window.location.origin + '/api/users/' + $scope.currentUser.id, {
                    favoriteMovies: $scope.currentUser.favoriteMovies
                });

                alert("Movie added to Favorites.");
                //console.log($scope.currentUser);


            }

            $scope.removeFromFavorites = function () {

                for (var i = 0; i < $scope.currentUser.favoriteMovies.length; i++) {
                    if ($scope.currentUser.favoriteMovies[i].title === $scope.movieTitle) {
                        $scope.currentUser.favoriteMovies.splice(i, 1);
                        break;
                    }
                }

                $http.put(window.location.origin + '/api/users/' + $scope.currentUser.id, {
                    favoriteMovies: $scope.currentUser.favoriteMovies
                });

                alert("Movie removed from Favorites.");
                //console.log($scope.currentUser);

            }

            $scope.addToWatchList = function () {

                if ($scope.currentUser.watchlist.length != 0)
                    if (!$scope.currentUser.watchlist.every(function (value) {
                            return $scope.movieTitle !== value.title
                        })) {
                        alert("Movie already in watchlist.");
                        return;
                    }

                if ($scope.currentUser.watched.length != 0)
                    if (!$scope.currentUser.watched.every(function (value) {
                            return $scope.movieTitle !== value.title
                        })) {
                        alert("You've already seen this movie!");
                        return;
                    }



                $scope.currentUser.watchlist.unshift({
                    id: $scope.movieId,
                    title: $scope.movieTitle,
                    overview: $scope.movieDescription,
                    poster_path: $scope.moviePosterPath,
                    release_date: $scope.movieReleaseDate,
                    genre_ids: $scope.movieGenres,
                    vote_average: $scope.movieRating
                });

                $http.put(window.location.origin + '/api/users/' + $scope.currentUser.id, {
                    watchlist: $scope.currentUser.watchlist
                });

                alert("Movie added to watchlist.");
                //console.log($scope.currentUser);

            };

            $scope.removeFromWatchList = function () {


                for (var i = 0; i < $scope.currentUser.watchlist.length; i++) {
                    if ($scope.currentUser.watchlist[i].title === $scope.movieTitle) {
                        $scope.currentUser.watchlist.splice(i, 1);
                        break;
                    }
                }

                $http.put(window.location.origin + '/api/users/' + $scope.currentUser.id, {
                    watchlist: $scope.currentUser.watchlist
                });

                alert("Movie removed from watchlist.");
                //console.log($scope.currentUser);

            };



            $scope.addToWatched = function () {


                //first remove movie from watchlist, then add to watched
                for (var i = 0; i < $scope.currentUser.watchlist.length; i++) {
                    if ($scope.currentUser.watchlist[i].title === $scope.movieTitle) {
                        $scope.currentUser.watchlist.splice(i, 1);
                        break;
                    }
                }

                $scope.currentUser.watched.unshift({
                    id: $scope.movieId,
                    title: $scope.movieTitle,
                    overview: $scope.movieDescription,
                    poster_path: $scope.moviePosterPath,
                    release_date: $scope.movieReleaseDate,
                    genre_ids: $scope.movieGenres,
                    vote_average: $scope.movieRating
                });

                $http.put(window.location.origin + '/api/users/' + $scope.currentUser.id, {
                    watchlist: $scope.currentUser.watchlist,
                    watched: $scope.currentUser.watched
                });

                $http.post(window.location.origin + '/api/watch/', {
                    user: $scope.currentUser.id,
                    movie: $scope.movieTitle
                });


                alert("Movie added to Recently Seen.");
                //console.log($scope.currentUser);

            };

            $scope.dateRecorded = function (activity) {
                var date = new Date();

                var activityDate = new Date(activity.object.created_at);

                var timeDiff = Math.abs(date.getTime() - activityDate.getTime());

                if (timeDiff < 86400000 && timeDiff >= 3600000) {
                    var diffHours = Math.floor(timeDiff / 3600000);
                    if (diffHours == 1) activity["elapsed"] = "1 hour ago";
                    else activity["elapsed"] = diffHours + " hours ago";
                } else if (timeDiff < 3600000 && timeDiff >= 60000) {
                    var diffMinutes = Math.floor(timeDiff / 60000);
                    if (diffMinutes == 1) activity["elapsed"] = "1 minute ago";
                    else activity["elapsed"] = diffMinutes + " minutes ago";
                } else if (timeDiff < 60000) {
                    activity["elapsed"] = "Just now";
                } else {
                    var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
                    if (diffDays == 1) activity["elapsed"] = "1 day ago";
                    else activity["elapsed"] = diffDays + " days ago";
                }
            }

            $scope.timeStamp = function (activity) {

                var activityDate = new Date(activity.object.created_at);

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

        });