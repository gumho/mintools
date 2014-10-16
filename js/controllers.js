var minApp = angular.module('minApp', ['ngRoute', 'angulartics', 'angulartics.google.analytics']);

minApp.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/home.html',
      controller: 'AppCtrl'
    })
    .when('/cidr-calculator', {
      templateUrl: 'templates/cidr-calculator.html',
      controller: 'CidrCtrl'
    })
    .when('/unix-permissions-calculator', {
      templateUrl: 'templates/unix-permissions-calculator.html',
      controller: 'UnixCtrl'
    })
});

minApp.controller('AppCtrl', function($scope) {});

minApp.controller('UnixCtrl', function($scope) {
  $scope.perm = [false, false, false, false, false, false, false, false, false];

  function setUnset(bits) {
    var num_trues = 0;
    for(var i in bits) {
      var val = bits[i];
      if($scope.perm[val]) {
        num_trues += 1;
      };
    }

    if(num_trues == 3) {
      for(var i in bits) {
        var idx = bits[i];
        $scope.perm[idx] = false;
      }
    }
    else {
      for(var i in bits) {
        var idx = bits[i];
        $scope.perm[idx] = true;
      }
    }
  }

  $scope.selectRead = function() { setUnset([0, 3, 6]); }
  $scope.selectWrite = function() { setUnset([1, 4, 7]); }
  $scope.selectExecute = function() { setUnset([2, 5, 8]); }
  $scope.selectUser = function() { setUnset([0, 1, 2]); }
  $scope.selectGroup = function() { setUnset([3, 4, 5]); }
  $scope.selectOther = function() { setUnset([6, 7, 8]); }

  $scope.outputOctal = function() {
    var bitmask = $scope.perm.map(function(b) { return b ? 1 : 0});
    var output = '';
    output += parseInt(bitmask.slice(0, 3).join(''), 2);
    output += parseInt(bitmask.slice(3, 6).join(''), 2);
    output += parseInt(bitmask.slice(6, 9).join(''), 2);
    return output;
  }

});

minApp.controller('CidrCtrl', function($scope) {
  $scope.calculate = function(input) {
    if(input == '') {
      $scope.output = '';
      return;
    }

    var split = input.split('/');
    if(split.length != 2) {
      $scope.output = 'That does not look like valid CIDR notation! Example: 192.168.1.1/24';
      return;
    }

    var ip = split[0];
    if(!is_valid_ip(ip)) {
      $scope.output = "That does not look like a valid IP";
      return;
    }

    var cidr = split[1];
    if(!is_valid_cidr(cidr)) {
      $scope.output = "Mask bits should be between 1 and 32";
      return;
    }

    var mask = IPAddr.from_cidr(cidr);
    var ip = new IPAddr(ip);
    var range = ip.get_range_from_mask(mask);

    $scope.output = range.start + ' - ' + range.end;
  }
});
