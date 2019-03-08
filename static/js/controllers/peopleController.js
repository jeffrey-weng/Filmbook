angular.module('filmApp')

.run(function($rootScope,$http){
$rootScope.targets=[]; //initializing this array with list of users currentUser is following. Available to all controllers.
$rootScope.searchResults=[];
$rootScope.followingList=[];

$http.get(window.location.origin + "/api/users/")
.then(function (response) {

     for(var i=0;i<response.data.length;i++){
     $rootScope.searchResults.push(response.data[i]);
     }

     var x = function(value){

          if($rootScope.targets.includes(value._id))
          return true;
          else return false;
      }

     $http.get(window.location.origin + "/api/follow/"+$scope.currentUser.id)
     .then(function (response) {
          for(var i=0;i<response.data.length;i++)
           $rootScope.followingList.push(response.data[i]);

           $rootScope.followingList.forEach(function(value){
               $rootScope.targets.push(value.target);
             })

             console.log($rootScope.targets.length);


             $rootScope.searchResults.forEach(function(value){
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

})


.controller('PeopleController',
	function ($scope, $rootScope, $http) {


        var x = function(value){

          if($rootScope.targets.includes(value._id))
          return true;
          else return false;
      }

      //"refresh" currentUser's following list whenever this page is loaded

function init(){
      $rootScope.targets=[];
$rootScope.searchResults=[];
$rootScope.followingList=[];


      $http.get(window.location.origin + "/api/users/")
      .then(function (response) {
      
          for(var i=0;i<response.data.length;i++){
               $rootScope.searchResults.push(response.data[i]);
               }
      
           var x = function(value){
      
                if($rootScope.targets.includes(value._id))
                return true;
                else return false;
            }
      
           $http.get(window.location.origin + "/api/follow/"+$scope.currentUser.id)
           .then(function (response) {
                for(var i=0;i<response.data.length;i++)
                 $rootScope.followingList.push(response.data[i]);
      
                 $rootScope.followingList.forEach(function(value){
                     $rootScope.targets.push(value.target);
                   })
      
                   console.log($rootScope.targets.length);
      
      
                   $rootScope.searchResults.forEach(function(value){
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
     }
     init();


     //People page will update if need be every 10 seconds (maybe not a good idea)
     setInterval(function(){
             
          $http.get(window.location.origin + "/api/users/")
          .then(function (response) {
               
               //get most recent list of users
               var temp=[];
               for(var i=0;i<response.data.length;i++)
               temp.push(response.data[i]);

               //compare with current list of users and see if they're different

               if(temp.length!=$rootScope.searchResults.length){
                    $rootScope.searchResults=temp;
               }
               else{
                var listOfIds=[];

               for(var i=0;i<temp.length;i++)
                    listOfIds.push(temp[i]._id);

               //use includes method for comparison
              for(var i=0;i<temp.length;i++){
                    if(!listOfIds.includes($rootScope.searchResults[i]._id)){
                       $rootScope.searchResults=temp;
                       break;
                    }
                    else continue;
               }        
               }       
               
     })},10000);


        $scope.onSearchChange = function(){
          $rootScope.searchResults.forEach(function(value){
               $(document).ready(function(){
                 
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


          
        $scope.follow = function(person){

          var x=function(person){
               
               if(typeof person=="object"){

               if($rootScope.targets.includes(person._id))
               return true;
               else return false;
               }

               else{
                    if($rootScope.targets.includes(person))
                    return true;
                    else return false;  
               }
           }

           if(typeof person=="object"){
          if(x(person)){
               var index = $rootScope.targets.indexOf(person._id);
               $rootScope.targets.splice(index,1);

            $http.delete(window.location.origin + "/api/follow/"+$scope.currentUser.id,{data: {target:person._id}, headers: {'Content-Type': 'application/json;charset=utf-8'}})
            .then(function(response){
            document.getElementById(person._id).innerHTML="Follow";
            document.getElementById(person._id).className="btn btn-primary";

            })
          }

          else{
               $rootScope.targets.push(person._id);

               $http.post(window.location.origin + "/api/follow/"+$scope.currentUser.id,{target:person._id})
               .then(function(response){
                    document.getElementById(person._id).innerHTML="Unfollow";
                    document.getElementById(person._id).className="btn btn-danger";
                    })
          }
     }

     else{
          if(x(person)){
               var index = $rootScope.targets.indexOf(person);
               $rootScope.targets.splice(index,1);

            $http.delete(window.location.origin + "/api/follow/"+$scope.currentUser.id,{data: {target:person}, headers: {'Content-Type': 'application/json;charset=utf-8'}})
            .then(function(response){
            document.getElementById(person).innerHTML="Follow";
            document.getElementById(person).className="btn btn-primary";

            })
          }

          else{
               $rootScope.targets.push(person);

               $http.post(window.location.origin + "/api/follow/"+$scope.currentUser.id,{target:person})
               .then(function(response){
                    document.getElementById(person).innerHTML="Unfollow";
                    document.getElementById(person).className="btn btn-danger";
                    })
          }
     }



        }
        const genres = [ {
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
       }];


           $scope.showProfileDetails = function(person){

            $scope.id=person._id;
            $scope.avatar=person.avatar;
            $scope.username=person.username;
          

            $scope.favMovies="";

            for(var i=0;i<person.favoriteMovies.length;i++){
               if((i==person.favoriteMovies.length-1))
               $scope.favMovies+=person.favoriteMovies[i].title;
               else
               $scope.favMovies+=person.favoriteMovies[i].title+", ";
            }

            $scope.watched="";

            for(var i=0;i<person.watched.length;i++){
            if((i==person.watched.length-1))
            $scope.watched+=person.watched[i].title;
            else
            $scope.watched+=person.watched[i].title+", ";
            }

            var temp={};
            for(var i=0;i<person.watched.length;i++)
                 for(var j=0;j<person.watched[i].genre_ids.length;j++)
                 if(!temp[person.watched[i].genre_ids[j]])
                 temp[person.watched[i].genre_ids[j]]=1;
                 else
                 temp[person.watched[i].genre_ids[j]]=temp[person.watched[i].genre_ids[j]]+1;

            var frequencies=[];
            for(var key in temp){
               frequencies.push(temp[key]); //holds the frequencies of genres watched
            }
            frequencies.sort();
            frequencies.reverse();
           //console.log(frequencies);
            frequencies.splice(3,frequencies.length-3); //holds top 3 frequencies
            var top3=[];
      
            for( var key in temp){
                 if(frequencies.includes(temp[key])){
                 top3.push(key); //contains top 3 genre IDs
               
                 }
                      
            }
            $scope.favGenres="";

            var count=0;
            //console.log(frequencies);
            //console.log(top3);

            for(var i=0;i<genres.length;i++){
                 if(top3.includes(genres[i].id.toString())){
                      if(count==2){
                      $scope.favGenres+=genres[i].name;
                      break;}
                      else
                      $scope.favGenres+=genres[i].name+", ";
                      count++;
                 }
            }

            $scope.watchlist="";

            for(var i=0;i<person.watchlist.length;i++){
            if((i==person.watchlist.length-1))
            $scope.watchlist+=person.watchlist[i].title;
            else
            $scope.watchlist+=person.watchlist[i].title+", ";
            }
        }

        $scope.isFollowing = function(id){
          if($rootScope.targets.includes(id))
          return true;
          else return false;

        }


    });