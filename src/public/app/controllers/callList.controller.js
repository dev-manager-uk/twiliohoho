'use strict';
app.controller("CallListController", function ($scope, $state, $interval, RESTService) {

  $scope.calls = [];

  RESTService.getCallList().then(
    function (response) {
      $scope.calls = response.data;
      $scope.msg = undefined;
      if ($scope.calls.length === 0) {
        $scope.msg = "There is no call in progress"
      }
    }, function (err) {
      console.log("err", err);
    }
  );

  $interval(function () {
    RESTService.getCallList().then(
      function (response) {
        $scope.calls = response.data;
        $scope.msg = undefined;
        if ($scope.calls.length === 0) {
          $scope.msg = "There is no call in progress"
        }
      }, function (err) {
        console.log("err", err);
      }
    );
  }, 1000);

  $scope.createConference = function (user1, call) {
    let params = {};
    params.user1 = user1;

    params.clientNo = call.to;
    params.clientCallSid = call.sid;

    angular.forEach($scope.calls, function (value, key) {
      if (value.sid === call.parentCallSid) {
        params.user2No = value.to;
        params.user2CallSid = value.sid;

        RESTService.createConference(params).then(
          function (response) {
            console.log("response", response);
         }, function (err) {
            console.log("err", err);
          }
        );
      }
    });
  }

  $scope.dropCall = function(call){
    RESTService.dropCall(call.sid).then(
      function (response) {
        console.log("response", response);
      }, function (err) {
        console.log("err", err);
      }
    );
  }
});