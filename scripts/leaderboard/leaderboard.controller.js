(function() {
  'use strict';

  angular.module('puzzle15').controller('LeaderboardController', LeaderboardController);

  LeaderboardController.$inject = ['storageService'];

  function LeaderboardController(storageService) {
    var leaderboard = this;

    leaderboard.results = storageService.load();
  }

})();
