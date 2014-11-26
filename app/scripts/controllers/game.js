'use strict';

/**
 * @ngdoc function
 * @name mapGuruApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mapGuruApp
 */
angular.module('mapGuruApp')
  .controller('GameCtrl', function ($scope) {

    geolocation();
  	init();

  	function init(){

  		//initial points
  		$scope.points = {
  			correctAnswers: 0,
  			wrongAnswers: 0
  		};

      $scope.answerWrong = null;
      $scope.answerCorrect = null;
      $scope.myLocation = {
        longitude: 0,
        latitude: 0
      };

      $scope.mapList = mapListGenerator();
  	}

    function geolocation(){
      //my location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          $scope.$apply(function(){
            $scope.myLocation = {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude
            };
          });
        });
      }
    }

    $scope.setPlayerName = function(){
      $scope.playerNameSet = true;
    };

    $scope.resetGame = function(){
      init();
    };

    $scope.resetPlayerName = function(){
      $scope.playerNameSet = false;
      $scope.playerName = '';
      init();
    };

    $scope.resetGeolocation = function(){
      geolocation();
    };

    $scope.triggerNewMapSet = function(){
        $scope.mapList =  mapListGenerator();
    };

    $scope.isThisClosest = function(distanceFromMe){
      console.log(distanceFromMe,$scope.nearestDistance);
      if(distanceFromMe === $scope.nearestDistance){
        $scope.points.correctAnswers +=1;
        $scope.answerWrong =false;
        $scope.answerCorrect = true;
      } else {
        $scope.points.wrongAnswers +=1;
        $scope.answerWrong =true;
        $scope.answerCorrect = false;
      }

      $scope.mapList =  mapListGenerator();

    };

    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI/180);
    }

    //better solution: http://stackoverflow.com/questions/6878761/javascript-how-to-create-random-longitude-and-latitudes
    function getRandomInRange(from, to, fixed) {
        return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
        // .toFixed() returns string, so ' * 1' is a trick to convert to number
    }

    function mapListGenerator(){

      var maps = [];
      $scope.nearestDistance = 41000; //greater than Earth's circumference in KM

      for(var i=0;i<5;i++){

        //Two ways to make sure oceans do not show up - either you take an image and run it to check what is the pixel value to rule out any ocean views. But the faster
        //easier way is to just restrict your search to northern hemisphere and rule out pacific ocean areas too! (sorry South America and Australia!) - unfortunately there is still atlantic!

        var latitude = getRandomInRange(0,90,3);
        var longitude = getRandomInRange(-140,180,3);

        var distanceFromMe = getDistanceFromLatLonInKm(latitude,longitude,$scope.myLocation.latitude,$scope.myLocation.longitude);
        //check whether this point is nearer than the previous or not
        if(distanceFromMe < $scope.nearestDistance){
          $scope.nearestDistance = distanceFromMe;
        }

        //Keeping in northern hemisphere since most of landmass is there (sorry australia!) 
        var staticMapImage = {
          index: i,
          distanceFromMe: distanceFromMe,
          latitude: latitude,
          longitude: longitude,
          path: 'https://maps.googleapis.com/maps/api/staticmap?center='+latitude+','+longitude+'&zoom=10&size=400x400&maptype=roadmap'
        };

        maps.push(staticMapImage);
      }

      return maps;
    }

    
  });
