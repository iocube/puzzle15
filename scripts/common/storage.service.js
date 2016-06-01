(function() {
  'use strict';

  angular.module('puzzle15').factory('storageService', storageService);
  storageService.$inject = ['$localStorage'];

  function storageService($localStorage) {
    function save(bestResults) {
      $localStorage.bestResults = JSON.stringify(bestResults);
    }

    function load() {
      if (!angular.isDefined($localStorage.bestResults)) {
        return [];
      }
      return JSON.parse($localStorage.bestResults);
    }

    return {
      save: save,
      load: load
    };
  }
})();
