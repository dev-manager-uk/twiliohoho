"use strict";
app.controller("ResetUsersController", function(
  $scope,
  $state,
  $location,
  RESTService
) {

  function updateUsers(){
    $scope.users = [];
    RESTService.getUsers().then(
      function(response) {
        $scope.users = response.data.users;
      },
      function(err) {
        console.log("Error to retrieve users", err);
      }
    );
  }

  updateUsers();

  $scope.refreshList = function(){
    RESTService.refreshList().then(
      function(response){
        console.log("res", response);
        updateUsers();
      },
      function(err){
        console.log("Error to retrieve users", err);
      }
    );
  }
});
