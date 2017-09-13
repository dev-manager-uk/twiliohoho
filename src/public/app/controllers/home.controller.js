"use strict";
app.controller("HomeController", function(
  $scope,
  $state,
  $interval,
  RESTService
) {
  RESTService.getUsers().then(
    function(response) {
      $scope.users = response.data.users;
    },
    function(err) {
      console.log("Error to retrieve users", err);
    }
  );

  updateCalls();

  $interval(function() {
    updateCalls();
  }, 2000);

  function updateCalls(){
    RESTService.getCallList().then(function(response) {
      $scope.calls = response.data;
      angular.forEach($scope.users, function(usersVal) {
        usersVal.status = "free";
      });
      angular.forEach($scope.calls, function(callVal, callKey) {
        angular.forEach($scope.users, function(usersVal) {
          if (usersVal.number === callVal.to) {
            usersVal.status = "busy";
          }
        });
      });
    });  
  }
});
