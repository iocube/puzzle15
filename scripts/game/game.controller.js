(function() {
  'use strict';

  angular.module('puzzle15').controller('GameController', GameController);

  GameController.$inject = [];

  function GameController() {
    var gc = this;
    gc.message = 'Welcome, players!';
  }
})();
