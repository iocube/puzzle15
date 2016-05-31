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
          scope.counter = '00:00';

          counterPromise = $interval(function() {
            seconds += 1;

            var minutes = parseInt(seconds / 60),
                secs = seconds % 60;

            scope.counter = addLeadingZeros(minutes) + ':' + addLeadingZeros(secs);
          }, 1000);
        }

        function stopCounter() {
            $interval.cancel(counterPromise);
        }

        function getCounter() {
          return seconds;
        }

        function addLeadingZeros(number) {
          if (number < 10) {
            return '0' + String(number);
          }
          return number;
        }

        scope.$on('$destroy', function() {
          stop(timeCounterPromise);
        });
      }
    };

    return directive;
  }

})();
