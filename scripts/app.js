(function() {
  'use strict';

  angular.module('puzzle15', ['ui.router']);
  angular.module('puzzle15').config(app);

  app.$inject = ['$locationProvider', '$stateProvider'];

  function app($locationProvider, $stateProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'scripts/game/game.html',
        controller: 'GameController as gc'
      });
  }
})();
