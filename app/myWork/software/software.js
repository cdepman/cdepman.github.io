angular.module('myApp.SoftwareCtrl', [])
.controller('SoftwareCtrl', ['$scope', '$state', function($scope, $state) {
  $("li").removeClass("active");
  $("li.software").addClass("active");
}]);