angular.module('myApp.DesignCtrl', [])
.controller('DesignCtrl', ['$scope', '$state', function($scope, $state) {
  $("li").removeClass("active");
  $("li.design").addClass("active");
}]);