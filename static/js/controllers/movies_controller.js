angular.module('filmApp').controller('MoviesController',
	function ($scope, $http) {

		var today = new Date();
		var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

		$scope.movieType = 'movie in popular';
		$scope.displayType = 2; //set default display to top rated movies

		$scope.genres = ["ACTION","ADVENTURE","ANIMATION","COMEDY","CRIME","DOCUMENTARY",
			"DRAMA","FAMILY","FANTASY","HISTORY","HORROR","MUSIC","MYSTERY",
			"ROMANCE","SCIENCE FICTION","TV MOVIE","THRILLER","WAR","WESTERN"];

		//Initial index values for each movie list
		$scope.popularIndex = 4;
		$scope.theaterIndex = 4;
		$scope.topRatedIndex = 4;
		$scope.searchIndex = 3;

		//"Load more" function for popular movies
		$scope.getMorePopular = function() {
			for(var i=$scope.popularIndex; i<$scope.popularIndex+3; i++){
				$http.get("https://api.themoviedb.org/3/movie/popular?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page="+i)
					.then(function (response) {
						$scope.popular = $scope.popular.concat(response.data.results);
					});
			}

			$scope.popularIndex = i;

		};

		//"Load more" function for movies in theaters
		$scope.getMoreTheater = function() {
			for(var i=$scope.theaterIndex; i<$scope.theaterIndex+3; i++){
				$http.get("https://api.themoviedb.org/3/movie/now_playing?api_key=c62258e5fcc86f114d95f2bd79b40c28&language=en-US&page="+i)
					.then(function (response) {
						$scope.theater = $scope.theater.concat(response.data.results);
					});
			}

			$scope.theaterIndex = i;

		};

		//"Load more" function for top rated movies
		$scope.getMoreTopRated = function() {
			for(var i=$scope.topRatedIndex; i<$scope.topRatedIndex+3; i++){
				$http.get("https://api.themoviedb.org/3/discover/movie?api_key=c62258e5fcc86f114d95f2bd79b40c28&sort_by=vote_count.desc&page="+i)
					.then(function (response) {
						$scope.rated = $scope.rated.concat(response.data.results);
					});
			}

			$scope.topRatedIndex = i;

		};

		//"Load more" function for searched movies
		$scope.getMoreSearch = function(movieSearchText) {

			//If movie search text is not a genre name
			if(!($scope.genres.indexOf(movieSearchText.toUpperCase()) > -1))
			{
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


		$scope.showMovieDetails = function (movie) {
			$scope.movieTitle = movie.title;
			$scope.movieDescription = movie.overview;
			$scope.moviePosterPath = movie.poster_path;
		};

		$scope.addToWatchList = function () {

			if($scope.currentUser.watchlist.length!=0)
			if(!$scope.currentUser.watchlist.every(function(value){
				return $scope.movieTitle!==value.title
			})) {
				alert("Movie already in watchlist.");
				return;
			}

			$scope.currentUser.watchlist.push({
				title:$scope.movieTitle,
				overview:$scope.movieDescription,
				poster_path:$scope.moviePosterPath
			});

			$http.put(window.location.origin+'/api/users/'+$scope.currentUser.id, {watchlist:$scope.currentUser.watchlist});

			alert("Movie added to watchlist.");
			//console.log($scope.currentUser);
		
		};

		$scope.removeFromWatchList = function () {


			$scope.currentUser.watchlist.push({
				title:$scope.movieTitle,
				overview:$scope.movieDescription,
				poster_path:$scope.moviePosterPath
			});

			$http.put(window.location.origin+'/api/users/'+$scope.currentUser.id, {watchlist:$scope.currentUser.watchlist});

			alert("Movie removed from watchlist.");
			//console.log($scope.currentUser);
		
		};



	});