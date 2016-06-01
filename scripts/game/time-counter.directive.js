(function() {
  'use strict';

  angular.module('puzzle15').directive('timeCounter', timeCounter);
  timeCounter.$inject = ['$interval'];

  function timeCounter($interval) {
    var directive = {
      restrict: 'E',
      scope: {
        start: '=?',
        stop: '=?',
        getCounter: '=?'
      },
      templateUrl: 'scripts/game/time-counter.html',
      link: function(scope) {
        var counterPromise,
          seconds = 0;

        scope.start = startCounter;
        scope.stop = stopCounter;
        scope.getCounter = getCounter;

        function startCounter() {
          seconds = 0;

          counterPromise = $interval(function() {
            seconds += 1;
            scope.counter = seconds;
          }, 1000);
        }

        function stopCounter() {
            $interval.cancel(counterPromise);
        }

        function getCounter() {
          return seconds;
        }

        scope.$on('$destroy', function() {
          stop(counterPromise);
        });
      }
    };

    return directive;
  }

})();
