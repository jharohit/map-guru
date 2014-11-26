'use strict';

/**
 * @ngdoc overview
 * @name mapGuruApp
 * @description
 * # mapGuruApp
 *
 * Main module of the application.
 */
angular
  .module('mapGuruApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/game', {
        templateUrl: 'views/game.html',
        controller: 'GameCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/about'
      });
  })
  .controller('HeaderCtrl');
