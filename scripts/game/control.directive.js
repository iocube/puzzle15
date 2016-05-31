(function() {
  'use strict';

  angular.module('puzzle15').directive('control', control);
  control.$inject = [];

  function control() {
    var directive = {
      restrict: 'E',
      scope: {
        key: '@',
        action: '&'
      },
      link: function(scope) {
        var controls = {
          'ArrowDown': 40,
          'ArrowUp': 38,
          'ArrowLeft': 37,
          'ArrowRight': 39
        };

        var controlsReversed = reverse(controls);

        var onKeyPress = function(event) {
          if (controlsReversed.hasOwnProperty(event.keyCode) &&
            scope.key === controlsReversed[event.keyCode]) {
            event.preventDefault();
            scope.action();
            scope.$apply();
          }
        };

        document.addEventListener('keydown', onKeyPress);

        scope.$on('$destroy', function() {
          document.removeEventListener('keydown', onKeyPress);
        });
      }
    };

    return directive;
  }

  function reverse(obj) {
    var keys = Object.keys(obj),
      inverted = {},
      val;

    keys.forEach(function(key) {
      val = obj[key];
      inverted[val] = key;
    });

    return inverted;
  }
})();
