"use strict";
app.controller("CallListController", function(
  $scope,
  $state,
  $interval,
  RESTService
) {
  $scope.calls = [];
  $scope.transferNumbers = [];

  function getCallList() {
    if ($scope.transferNumbers.length < 1) {
      RESTService.getUsers().then(
        function(response) {
          $scope.transferNumbers = response.data.users;
        },
        function(err) {
          console.log("Error to retrieve users", err);
        }
      );
    }
    RESTService.getCallList().then(
      function(response) {
        $scope.calls = response.data;
        $scope.msg = undefined;
        if ($scope.calls.length === 0) {
          $scope.msg = "There is no call in progress";
        } else {
          angular.forEach($scope.transferNumbers, function(transferNoVal){
            transferNoVal.status = "free";
          });
          angular.forEach($scope.calls, function(callVal, callKey) {
            angular.forEach($scope.transferNumbers, function(
              transferNoVal,
              transferNoKey
            ) {
              if (transferNoVal.number === callVal.to) {
                transferNoVal.status = "busy";
              }
            });
          });
        }
      },
      function(err) {
        console.log("err", err);
      }
    );
  }

  getCallList();

  $interval(function() {
    getCallList();
  }, 1000);

  $scope.createConference = function(user1, call) {
    let params = {};
    params.user1 = user1;

    params.clientNo = call.to;
    params.clientCallSid = call.sid;

    angular.forEach($scope.calls, function(value, key) {
      if (value.sid === call.parentCallSid) {
        params.user2No = value.to;
        params.user2CallSid = value.sid;

        RESTService.createConference(params).then(
          function(response) {
            console.log("response", response);
          },
          function(err) {
            console.log("err", err);
          }
        );
      }
    });
  };

  $scope.dropCall = function(call) {
    RESTService.dropCall(call.sid).then(
      function(response) {
        console.log("response", response);
      },
      function(err) {
        console.log("err", err);
      }
    );
  };
});
