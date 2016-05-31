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
      templateUrl: 'scripts/game/control.html',
      link: function(scope) {
        var controls = {
          'ArrowDown': {'code': 40, 'classname': 'fa fa-arrow-circle-o-down control-arrow-down'},
          'ArrowUp': {'code': 38, 'classname': 'fa fa-arrow-circle-o-up control-arrow-up'},
          'ArrowLeft': {'code': 37, 'classname': 'fa fa-arrow-circle-o-left control-arrow-left'},
          'ArrowRight': {'code': 39, 'classname': 'fa fa-arrow-circle-o-right control-arrow-right'}
        };
        scope.classname = controls[scope.key].classname;

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
