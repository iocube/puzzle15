(function() {
  'use strict';

  angular.module('puzzle15', ['ui.router', 'ngStorage']);
  angular.module('puzzle15').config(app);

  angular.module('puzzle15')
    .constant('MAXIMUM_BOARD_SIZE', 10)
    .constant('MINIMUM_BOARD_SIZE', 4)
    .constant('TOTAL_PICTURES', 15);

  app.$inject = ['$locationProvider', '$stateProvider'];

  function app($locationProvider, $stateProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'scripts/game/game.html',
        controller: 'GameController as gc'
      })
      .state('leaderboard', {
        url: '/leaderboard',
        templateUrl: 'scripts/leaderboard/leaderboard.html',
        controller: 'LeaderboardController as leaderboard'
      });
  }
})();
