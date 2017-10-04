"use strict";
app.controller("HomeController", function(
  $scope,
  $state,
  $interval,
  $location,
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

  $scope.click = function(number){
    $location.path("/userList/" + number);
  }
});
