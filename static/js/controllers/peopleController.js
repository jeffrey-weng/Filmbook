angular.module('filmApp').controller('PeopleController',
	function ($scope, $http) {

        $scope.searchResults = [];
        $scope.followingList = [];
        $scope.targets=[];


        var x = function(value){

          if($scope.targets.includes(value._id))
          return true;
          else return false;
      }
        $scope.onSearchChange = function(){
          $scope.searchResults.forEach(function(value){
               $(document).ready(function(){
                    // your code
                    if(x(value)){
                          console.log("Exuected");
                         document.getElementById(value._id).innerHTML="Unfollow";
                         document.getElementById(value._id).className="btn btn-danger";
                         }
                         else{
                              console.log("Exuected2");
                         document.getElementById(value._id).innerHTML="Follow";
                         document.getElementById(value._id).className="btn btn-primary";
                         }
                    });
               
          });
        }

      $http.get(window.location.origin + "/api/users/")
				.then(function (response) {

                         for(var i=0;i<response.data.length;i++)
                         $scope.searchResults.push(response.data[i]);

                         var x = function(value){

                              if($scope.targets.includes(value._id))
                              return true;
                              else return false;
                          }

                         $http.get(window.location.origin + "/api/follow/"+$scope.currentUser.id)
                         .then(function (response) {
                              for(var i=0;i<response.data.length;i++)
                               $scope.followingList.push(response.data[i]);

                               $scope.followingList.forEach(function(value){
                                   $scope.targets.push(value.target);
                                 })

                                 console.log($scope.targets.length);


                                 $scope.searchResults.forEach(function(value){
                                   $(document).ready(function(){
                                        // your code
                                        if(x(value)){
                                              console.log("Exuected");
                                             document.getElementById(value._id).innerHTML="Unfollow";
                                             document.getElementById(value._id).className="btn btn-danger";
                                             }
                                             else{
                                                  console.log("Exuected2");
                                             document.getElementById(value._id).innerHTML="Follow";
                                             document.getElementById(value._id).className="btn btn-primary";
                                             }
                                        });
                                   
                              });
                                  
                          });     
                });
          
        $scope.follow = function(person){

          var x=function(person){

               if($scope.targets.includes(person._id))
               return true;
               else return false;
           }

          if(x(person)){
               var index = $scope.targets.indexOf(person._id);
               $scope.targets.splice(index,1);

            $http.delete(window.location.origin + "/api/follow/"+$scope.currentUser.id,{data: {target:person._id}, headers: {'Content-Type': 'application/json;charset=utf-8'}})
            .then(function(response){
            document.getElementById(person._id).innerHTML="Follow";
            document.getElementById(person._id).className="btn btn-primary";

            })
          }

          else{
               $scope.targets.push(person._id);

               $http.post(window.location.origin + "/api/follow/"+$scope.currentUser.id,{target:person._id})
               .then(function(response){
                    document.getElementById(person._id).innerHTML="Unfollow";
                    document.getElementById(person._id).className="btn btn-danger";
                    })
          }
        }

           $scope.showProfileDetails = function(person){

            $scope.id=person._id;
            $scope.avatar=person.avatar;
            $scope.username=person.username;
            $scope.favMovies=person.favoriteMovies;
            $scope.favGenres=person.favoriteGenres;
           

            $scope.watchlist="";

            for(var i=0;i<person.watchlist.length;i++){
            if((i==person.watchlist.length-1))
            $scope.watchlist+=person.watchlist[i].title;
            else
            $scope.watchlist+=person.watchlist[i].title+", ";
            }

            $scope.watched="";

            for(var i=0;i<person.watched.length;i++){
            if((i==person.watched.length-1))
            $scope.watched+=person.watched[i].title;
            else
            $scope.watched+=person.watched[i].title+", ";
            }


        }
    });