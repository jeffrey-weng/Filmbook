angular.module('filmApp').controller('MoviesController',
	function ($scope, $rootScope, $http) {


		//populate currentUser's following
		if ($rootScope.targets.length == 0) {
			$http.get(window.location.origin + "/api/users/")
				.then(function (response) {
					$scope.searchResults = [];
					for (var i = 0; i < response.data.length; i++)
						$scope.searchResults.push(response.data[i]);

					$http.get(window.location.origin + "/api/follow/" + $scope.currentUser.id)
						.then(function (response) {
							$scope.followingList = [];
							for (var i = 0; i < response.data.length; i++)
								$scope.followingList.push(response.data[i]);

							$scope.followingList.forEach(function (value) {
								$rootScope.targets.push(value.target);
							})

							// console.log($rootScope.targets.length);  
						});
				});
		}

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

		const monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];

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
				return activity.object.target.username;
			} else if (activity.verb == "Watch") {
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
			} else if (activity.verb == "Watch") {
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

		$scope.follow = function (id) {

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

						document.getElementById("modal:" + id).innerHTML = "Follow " + $scope.username;
						document.getElementById("modal:" + id).className = "btn btn-primary";


					})
			} else {
				$rootScope.targets.push(id);

				$http.post(window.location.origin + "/api/follow/" + $scope.currentUser.id, {
						target: id
					})
					.then(function (response) {
						console.log("Exuected2");
						document.getElementById("modal:" + id).innerHTML = "Unfollow " + $scope.username;
						document.getElementById("modal:" + id).className = "btn btn-danger";


					})
			}
		}

		$scope.inWatchlist = function (movieTitle) {

			for (var i = 0; i < $scope.currentUser.watchlist.length; i++) {
				if ($scope.currentUser.watchlist[i].title == movieTitle)
					return true;
			}
			return false;

		}

		$scope.inWatched = function (movieTitle) {
			for (var i = 0; i < $scope.currentUser.watched.length; i++) {
				if ($scope.currentUser.watched[i].title == movieTitle)
					return true;
			}
			return false;
		}

		$scope.inFavorites = function (movieTitle) {

			for (var i = 0; i < $scope.currentUser.favoriteMovies.length; i++) {
				if ($scope.currentUser.favoriteMovies[i].title == movieTitle)
					return true;
			}
			return false;
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

	$scope.calculateFavGenres = function(){
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
		return $scope.favGenres;

	}

		$scope.writeReview = function () {


		}


	});