angular.module('myApp.WritingCtrl', [])
.controller('WritingCtrl', ['$scope', '$state', function($scope, $state) {
  $("li").removeClass("active");
  $("li.writing").addClass("active");
}]);