angular.module('myApp.PhotographyCtrl', [])
.controller('PhotographyCtrl', ['$scope', '$state', function($scope, $state) {
  $("li").removeClass("active");
  $("li.photography").addClass("active");
}]);