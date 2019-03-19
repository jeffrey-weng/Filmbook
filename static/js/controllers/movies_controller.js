angular.module('filmApp').controller('MoviesController',
	function ($scope, $rootScope, $http) {


		//populate currentUser's following

		$rootScope.targets = [];
		$rootScope.searchResults = [];
		$rootScope.followingList = [];
		$rootScope.followersList = [];
		$rootScope.followers = [];
		$rootScope.following = [];
		$rootScope.followers2 = [];

		$http.get(window.location.origin + "/api/users/")
			.then(function (response) {
				$rootScope.searchResults = [];
				for (var i = 0; i < response.data.length; i++)
					$rootScope.searchResults.push(response.data[i]);

				$http.get(window.location.origin + "/api/follow/" + $scope.currentUser.id)
					.then(function (response) {
						$scope.followingList = [];
						for (var i = 0; i < response.data.length; i++)
							$scope.followingList.push(response.data[i]);

						$scope.followingList.forEach(function (value) {
							$rootScope.targets.push(value.target);
						})

						$http.get(window.location.origin + "/api/follow/followers/" + $scope.currentUser.id)
							.then(function (response) {
								for (var i = 0; i < response.data.length; i++)
									$rootScope.followersList.push(response.data[i]);

								$rootScope.followersList.forEach(function (value) {
									$rootScope.followers.push(value.user);
								})

								$rootScope.searchResults.forEach(function (value) {
									if ($scope.isFollowing(value._id))
										$scope.following.push(value);
								})

								$rootScope.searchResults.forEach(function (value) {
									if ($scope.isAFollower(value._id))
										$scope.followers2.push(value);
								})
							})

						// console.log($rootScope.targets.length);  
					});
			});



		$scope.movieType = 'movie in popular';
		$scope.displayType = 2; //set default display to top rated movies

		$scope.genres = ["ACTION", "ADVENTURE", "ANIMATION", "COMEDY", "CRIME", "DOCUMENTARY",
			"DRAMA", "FAMILY", "FANTASY", "HISTORY", "HORROR", "MUSIC", "MYSTERY",
			"ROMANCE", "SCIENCE FICTION", "TV MOVIE", "THRILLER", "WAR", "WESTERN"
		];

		//Initial index values for each movie list
		$scope.popularIndex = 4;
		$scope.theaterIndex = 4;
		$scope.topRatedIndex = 4;
		$scope.searchIndex = 3;

		//"Load more" function for popular movies
		$scope.getMorePopular = function () {
			for (var i = $scope.popularIndex; i < $scope.popularIndex + 3; i++) {
				$http.get("https://api.themoviedb.org/3/movie/popular?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=" + i)
					.then(function (response) {
						$scope.popular = $scope.popular.concat(response.data.results);
					});
			}

			$scope.popularIndex = i;

		};

		//"Load more" function for movies in theaters
		$scope.getMoreTheater = function () {
			for (var i = $scope.theaterIndex; i < $scope.theaterIndex + 3; i++) {
				$http.get("https://api.themoviedb.org/3/movie/now_playing?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=" + i)
					.then(function (response) {
						$scope.theater = $scope.theater.concat(response.data.results);
					});
			}

			$scope.theaterIndex = i;

		};

		//"Load more" function for top rated movies
		$scope.getMoreTopRated = function () {
			for (var i = $scope.topRatedIndex; i < $scope.topRatedIndex + 3; i++) {
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&sort_by=vote_count.desc&page=" + i)
					.then(function (response) {
						$scope.rated = $scope.rated.concat(response.data.results);
					});
			}

			$scope.topRatedIndex = i;

		};

		//"Load more" function for searched movies
		$scope.getMoreSearch = function (movieSearchText) {

			//If movie search text is not a genre name
			if (!($scope.genres.indexOf(movieSearchText.toUpperCase()) > -1)) {
				for (var i = $scope.searchIndex; i < $scope.searchIndex + 2; i++) {
					$http.get("https://api.themoviedb.org/3/movie/popular?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=" + i)
						.then(function (response) {
							$scope.popular = $scope.popular.concat(response.data.results);
						});
				}
			}
			$scope.searchIndex = i;

		};

		//popular movies
		$http.get("https://api.themoviedb.org/3/movie/popular?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=1")
			.then(function (response) {
				$scope.popular = response.data.results;
			});

		$http.get("https://api.themoviedb.org/3/movie/popular?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=2")
			.then(function (response) {
				$scope.popular = $scope.popular.concat(response.data.results);
			});


		$http.get("https://api.themoviedb.org/3/movie/popular?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=3")
			.then(function (response) {
				$scope.popular = $scope.popular.concat(response.data.results);
			});

		//movies in theaters
		$http.get("https://api.themoviedb.org/3/movie/now_playing?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=1")
			.then(function (response) {
				$scope.theater = response.data.results;
			});

		$http.get("https://api.themoviedb.org/3/movie/now_playing?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=2")
			.then(function (response) {
				$scope.theater = $scope.theater.concat(response.data.results);
			});


		$http.get("https://api.themoviedb.org/3/movie/now_playing?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=3")
			.then(function (response) {
				$scope.theater = $scope.theater.concat(response.data.results);
			});

		//rated
		$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&sort_by=vote_count.desc" + "&page=1")
			.then(function (response) {
				$scope.rated = response.data.results;
			});

		$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&sort_by=vote_count.desc" + "&page=2")
			.then(function (response) {
				$scope.rated = $scope.rated.concat(response.data.results);
			});


		$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&sort_by=vote_count.desc" + "&page=3")
			.then(function (response) {
				$scope.rated = $scope.rated.concat(response.data.results);
			});


		$scope.searchMovies = function (movieSearchText) {

			if (movieSearchText == "") {

				$scope.displayType = 0;
				return;
			}

			if (movieSearchText.toUpperCase() == "ACTION") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=28&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}

			if (movieSearchText.toUpperCase() == "ADVENTURE") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=12&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}

			if (movieSearchText.toUpperCase() == "ANIMATION") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=16&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}

			if (movieSearchText.toUpperCase() == "COMEDY") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=35&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}

			if (movieSearchText.toUpperCase() == "CRIME") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=80&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}

			if (movieSearchText.toUpperCase() == "DOCUMENTARY") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=99&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}

			if (movieSearchText.toUpperCase() == "DRAMA") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=18&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}
			if (movieSearchText.toUpperCase() == "FAMILY") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=10751&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}
			if (movieSearchText.toUpperCase() == "FANTASY") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=14&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}
			if (movieSearchText.toUpperCase() == "HISTORY") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=36&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}
			if (movieSearchText.toUpperCase() == "HORROR") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=27&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}
			if (movieSearchText.toUpperCase() == "MUSIC") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=10402&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}

			if (movieSearchText.toUpperCase() == "MYSTERY") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=9648&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}
			if (movieSearchText.toUpperCase() == "ROMANCE") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=10749&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}
			if (movieSearchText.toUpperCase() == "SCIENCE FICTION") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=878&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}
			if (movieSearchText.toUpperCase() == "TV MOVIE") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=10770&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}
			if (movieSearchText.toUpperCase() == "THRILLER") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=53&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}
			if (movieSearchText.toUpperCase() == "WAR") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=10752&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}
			if (movieSearchText.toUpperCase() == "WESTERN") {

				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&with_genres=37&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;
			}

			if ((movieSearchText.startsWith("1") || movieSearchText.startsWith("2")) && movieSearchText.length == 4) {
				$scope.displayType = 4;
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&primary_release_year=" + movieSearchText + "&page=1")
					.then(function (response) {
						$scope.searchResults = response.data.results;
					});
				return;

			}


			$http.get("https://api.themoviedb.org/3/search/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=1&include_adult=false&query=" + movieSearchText)
				.then(function (response) {
					$scope.searchResults = response.data.results;
				});

			$http.get("https://api.themoviedb.org/3/search/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=2&include_adult=false&query=" + movieSearchText)
				.then(function (response) {
					$scope.searchResults = $scope.searchResults.concat(response.data.results);
				});

			$scope.displayType = 4;
		};

		$scope.updateMovieDisplay = function (type) {
			$scope.displayType = type;
		};


		$http.get(window.location.origin + '/api/home/' + $scope.currentUser.id)
			.then(function (response) {
				$scope.activities = response.data.activities;
			});


		$http.get(window.location.origin + '/api/profile/' + $scope.currentUser.id)
			.then(function (response) {
				$scope.userActivities = response.data.activities;
			});

		//Refresh feeds every one minute (to show updates on how long ago an activity occured)
		setInterval(function () {
			$http.get(window.location.origin + '/api/home/' + $scope.currentUser.id)
				.then(function (response) {
					$scope.activities = response.data.activities;
				});


			$http.get(window.location.origin + '/api/profile/' + $scope.currentUser.id)
				.then(function (response) {
					$scope.userActivities = response.data.activities;
				});

		}, 60000);





		$scope.activityObject = function (activity) {
			if (activity.verb == "Follow") {
				if (activity.object.target.username == $scope.currentUser.username) {
					document.getElementById(activity.id).removeAttribute("class");
					document.getElementById(activity.id).removeAttribute("data-toggle");
					document.getElementById(activity.id).removeAttribute("data-target");
					document.getElementById(activity.id).removeAttribute("ng-click");
					return "you";
				} else
					return activity.object.target.username;
			} else if (activity.verb == "Watch" || activity.verb == "ReviewPost" || activity.verb == "Review") {
				return activity.object.movie;
			}
		}

		$scope.dateRecorded = function (activity) {
			var date = new Date();

			var activityDate = new Date(activity.object.created_at);

			var timeDiff = Math.abs(date.getTime() - activityDate.getTime());

			if (timeDiff < 86400000 && timeDiff >= 3600000) {
				var diffHours = Math.ceil(timeDiff / 3600000);
				return diffHours + " hours ago";
			} else if (timeDiff < 3600000 && timeDiff >= 60000) {
				var diffMinutes = Math.ceil(timeDiff / 60000);
				return diffMinutes + " minutes ago";
			} else if (timeDiff < 60000) {
				return "Just now";
			} else {
				var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
				return diffDays + " days ago";
			}
		}

		$scope.emptyWatchListMsg = function (watchlist) {
			if (watchlist.length == 0)
				return true;

			else return false;
		}

		$scope.partofRecent = false;

		$scope.activityModal = function (activity, forActor) {


			var x = function (id) {

				if ($rootScope.targets.includes(id))
					return true;
				else return false;
			}

			if (forActor == 'actor') {
				$scope.showProfileDetails(activity.actor);

				if (x($scope.id)) {
					$(document).ready(function () {
						document.getElementById("modal:" + $scope.id).innerHTML = "Unfollow " + $scope.username;
						document.getElementById("modal:" + $scope.id).className = "btn btn-danger";
					})
				} else {
					$(document).ready(function () {
						document.getElementById("modal:" + $scope.id).innerHTML = "Follow " + $scope.username;
						document.getElementById("modal:" + $scope.id).className = "btn btn-primary";
					})
				}
			} else if (activity.verb == "Watch" || activity.verb == "ReviewPost" || activity.verb == "Review") {
				document.getElementById(activity.id).setAttribute("data-target", "#movieDetailsModal");

				//if part of Recent Activity...user has obviously already seen the movie, so remove addtowatchlist button
				if ($scope.currentUser.username == activity.actor.username)
					$scope.partOfRecent = true;
				else $scope.partOfRecent = false;


				for (var i = 0; i < activity.actor.watched.length; i++)
					if (activity.actor.watched[i].title == activity.object.movie) {
						$scope.showMovieDetails(activity.actor.watched[i]);
						break;
					}

			} else if (activity.verb == "Follow") {
				document.getElementById(activity.id).setAttribute("data-target", "#personDetailsModal");
				$http.get(window.location.origin + "/api/users/usernames/" + activity.object.target.username)
					.then(function (response) {

						$scope.showProfileDetails(response.data);

						if (x($scope.id)) {
							$(document).ready(function () {
								document.getElementById("modal:" + $scope.id).innerHTML = "Unfollow " + $scope.username;
								document.getElementById("modal:" + $scope.id).className = "btn btn-danger";
							})
						} else {
							$(document).ready(function () {
								document.getElementById("modal:" + $scope.id).innerHTML = "Follow " + $scope.username;
								document.getElementById("modal:" + $scope.id).className = "btn btn-primary";
							})
						}
					})

			}



		}

		$scope.follow = function (id, hide) {

			var x = function (id) {

				if ($rootScope.targets.includes(id))
					return true;
				else return false;
			}

			if (x(id)) {
				var index = $rootScope.targets.indexOf(id);
				$rootScope.targets.splice(index, 1);

				$http.delete(window.location.origin + "/api/follow/" + $scope.currentUser.id, {
						data: {
							target: id
						},
						headers: {
							'Content-Type': 'application/json;charset=utf-8'
						}
					})
					.then(function (response) {
						if (!hide) {
							document.getElementById("modal:" + id).innerHTML = "Follow " + $scope.username;
							document.getElementById("modal:" + id).className = "btn btn-primary";
						}

					})
			} else {
				$rootScope.targets.push(id);

				$http.post(window.location.origin + "/api/follow/" + $scope.currentUser.id, {
						target: id
					})
					.then(function (response) {
						if (!hide) {
							document.getElementById("modal:" + id).innerHTML = "Unfollow " + $scope.username;
							document.getElementById("modal:" + id).className = "btn btn-danger";
						}

					})
			}
		}

		$(document).ready(
			function () {
				$('input:file').change(
					function () {
						$('input:submit').attr('disabled', true);
						if ($(this).val()) {
							$('input:submit').attr('disabled', false);

						}
					}
				);
			});


		$scope.noSuggestions = function () {
			if ($scope.movieRecs == "") return true;
			else return false;
		}


		$scope.moreRecs = function () {

			$scope.movieRecs = [];

			var rand1 = Math.floor(Math.random() * $scope.currentUser.favoriteMovies.length);
			var rand2 = Math.floor(Math.random() * $scope.currentUser.watched.length);
			var rand3 = Math.floor(Math.random() * $scope.currentUser.watchlist.length);

			if ($scope.currentUser.favoriteMovies.length != 0 && $scope.currentUser.watched.length >= 1) {
				$http.get("https://api.themoviedb.org/3/movie/" + $scope.currentUser.favoriteMovies[rand1].id + "/similar?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=1")
					.then(function (response) {
						$http.get("https://api.themoviedb.org/3/movie/" + $scope.currentUser.watched[rand2].id + "/similar?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=1")
							.then(function (response2) {
								var x = true;

								while (x) {
									$scope.movieRecs = [];
									for (var i = 0; i < 3; i++) {
										var rand = Math.floor(Math.random() * 20);
										while ($scope.inFavorites(response.data.results[rand].title) || $scope.inWatchlist(response.data.results[rand].title) || $scope.inWatched(response.data.results[rand].title))
											rand = Math.floor(Math.random() * 20);

										$scope.movieRecs.push(response.data.results[rand]);
									}

									for (var i = 0; i < 2; i++) {
										var rand = Math.floor(Math.random() * 20);
										while ($scope.inFavorites(response2.data.results[rand].title) || $scope.inWatchlist(response2.data.results[rand].title) || $scope.inWatched(response2.data.results[rand].title))
											rand = Math.floor(Math.random() * 20);

										$scope.movieRecs.push(response2.data.results[rand]);
									}
									//console.log($scope.movieRecs);
									//console.log((new Set($scope.movieRecs)).size !== $scope.movieRecs.length)

									var temp = [];

									for (var i = 0; i < $scope.movieRecs.length; i++)
										temp.push($scope.movieRecs[i].id);


									if ((new Set(temp)).size !== temp.length)
										x = true;
									else x = false;

								}

							})
					})
			} else if ($scope.currentUser.favoriteMovies.length != 0)
				$http.get("https://api.themoviedb.org/3/movie/" + $scope.currentUser.favoriteMovies[rand1].id + "/similar?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=1")
				.then(function (response) {

					var x = true;

					while (x) {
						$scope.movieRecs = [];
						for (var i = 0; i < 5; i++) {

							var rand = Math.floor(Math.random() * 20);
							while ($scope.inFavorites(response.data.results[rand].title) || $scope.inWatchlist(response.data.results[rand].title) || $scope.inWatched(response.data.results[rand].title))
								rand = Math.floor(Math.random() * 20);

							$scope.movieRecs.push(response.data.results[rand]);

						}

						var temp = [];

						for (var i = 0; i < $scope.movieRecs.length; i++)
							temp.push($scope.movieRecs[i].id);


						if ((new Set(temp)).size !== temp.length)
							x = true;
						else x = false;
					}

				})


			else if ($scope.currentUser.watched.length != 0 && $scope.currentUser.watchlist.length >= 1) {
				$http.get("https://api.themoviedb.org/3/movie/" + $scope.currentUser.watched[rand2].id + "/similar?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=1")
					.then(function (response) {
						$http.get("https://api.themoviedb.org/3/movie/" + $scope.currentUser.watchlist[rand3].id + "/similar?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=1")
							.then(function (response2) {

								var x = true;
								while (x) {
									$scope.movieRecs = [];
									for (var i = 0; i < 3; i++) {
										var rand = Math.floor(Math.random() * 20);
										while ($scope.inFavorites(response.data.results[rand].title) || $scope.inWatchlist(response.data.results[rand].title) || $scope.inWatched(response.data.results[rand].title))
											rand = Math.floor(Math.random() * 20);

										$scope.movieRecs.push(response.data.results[rand]);
									}

									for (var i = 0; i < 2; i++) {
										var rand = Math.floor(Math.random() * 20);
										while ($scope.inFavorites(response2.data.results[rand].title) || $scope.inWatchlist(response2.data.results[rand].title) || $scope.inWatched(response2.data.results[rand].title))
											rand = Math.floor(Math.random() * 20);

										$scope.movieRecs.push(response2.data.results[rand]);
									}

									var temp = [];

									for (var i = 0; i < $scope.movieRecs.length; i++)
										temp.push($scope.movieRecs[i].id);


									if ((new Set(temp)).size !== temp.length)
										x = true;
									else x = false;
								}
							})
					})
			} else if ($scope.currentUser.watched.length != 0) {

				$http.get("https://api.themoviedb.org/3/movie/" + $scope.currentUser.watched[rand2].id + "/similar?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=1")
					.then(function (response) {

						var x = true;
						while (x) {
							$scope.movieRecs = [];
							for (var i = 0; i < 5; i++) {

								var rand = Math.floor(Math.random() * 20);
								while ($scope.inFavorites(response.data.results[rand].title) || $scope.inWatchlist(response.data.results[rand].title) || $scope.inWatched(response.data.results[rand].title))
									rand = Math.floor(Math.random() * 20);

								$scope.movieRecs.push(response.data.results[rand]);

							}

							var temp = [];

							for (var i = 0; i < $scope.movieRecs.length; i++)
								temp.push($scope.movieRecs[i].id);


							if ((new Set(temp)).size !== temp.length)
								x = true;
							else x = false;
						}

					})


			} else if ($scope.currentUser.watchlist.length != 0) {
				$http.get("https://api.themoviedb.org/3/movie/" + $scope.currentUser.watchlist[rand3].id + "/similar?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page=1")
					.then(function (response) {
						var x = true;

						while (x) {
							$scope.movieRecs = [];
							for (var i = 0; i < 5; i++) {

								var rand = Math.floor(Math.random() * 20);
								while ($scope.inFavorites(response.data.results[rand].title) || $scope.inWatchlist(response.data.results[rand].title) || $scope.inWatched(response.data.results[rand].title))
									rand = Math.floor(Math.random() * 20);

								$scope.movieRecs.push(response.data.results[rand]);

							}

							var temp = [];

							for (var i = 0; i < $scope.movieRecs.length; i++)
								temp.push($scope.movieRecs[i].id);


							if ((new Set(temp)).size !== temp.length)
								x = true;
							else x = false;
						}

					})


			}
		}

		$scope.moreRecs();


		$scope.infoChanged = false;


		$scope.resetEmail = function () {
			$scope.email = $scope.currentUser.email;
			$scope.infoChanged = false;
		}

		$scope.changePass = function () {

			$scope.infoChanged = true;
			if ($scope.password.length > 0) {
				document.getElementById("acc-password").setAttribute("name", "password");
			} else {
				document.getElementById("acc-password").removeAttribute("name");
				$scope.infoChanged = false;
			}

		}

		$scope.accUpdated = function () {
			alert('Account info updated.');
			$scope.currentUser.email = $scope.email;

		}

		$scope.isFollowing = function (id) {
			if ($rootScope.targets.includes(id))
				return true;
			else return false;

		}
		$scope.isAFollower = function (id) {

			if ($rootScope.followers.includes(id))
				return true;
			else return false;
		}

		console.log($scope.following);
		console.log($scope.followers2);
		console.log($rootScope.searchResults);
		console.log($rootScope.followers);
		console.log($rootScope.targets);

		$scope.writeReview = function () {


		}

		$scope.activityVerb = function (verb) {
			if (verb == "Review")
				return "reviewed";
			else return verb.toLowerCase() + "ed"
		}


	});