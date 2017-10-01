"use strict";
app.controller("HomeController", function(
  $scope,
  $state,
  $interval,
  $stateParams,
  RESTService
) {

  $scope.selectedUser = null;

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
        if($stateParams.user === usersVal.text){
          $scope.selectedUser = usersVal;
        }
      });
      angular.forEach($scope.calls, function(callVal, callKey) {
        angular.forEach($scope.users, function(usersVal) {
          if (usersVal.number === callVal.to) {
            usersVal.status = "busy";
          }
          if($stateParams.user === usersVal.text){
            $scope.selectedUser = usersVal;
          }
        });
      });
    });  
  }

  $scope.call = function(userCalled, userCalling){
    console.log("calling...");
    console.log(userCalled);
    console.log(userCalling);
  }

  $scope.transfer = function(userNumber){
    console.log("tranfering...", userNumber);
  }
});
