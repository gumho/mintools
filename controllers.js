var cidrApp = angular.module('cidrApp', []);

cidrApp.controller('CidrCtrl', function ($scope) {
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