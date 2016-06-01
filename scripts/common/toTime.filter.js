angular.module('puzzle15').filter('toTime', toTime);
toTime.$inject = [];

function toTime() {
  return function(seconds) {
    var minutes = parseInt(seconds / 60),
        secs = seconds % 60;

    return addLeadingZeros(minutes) + ':' + addLeadingZeros(secs);
  };
}

function addLeadingZeros(number) {
  if (number < 10) {
    return '0' + String(number);
  }

  return number;
}
