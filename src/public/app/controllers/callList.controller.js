'use strict';

app.controller("CallListController", function ($scope, $state, $interval, RESTService) {

  $scope.calls = [];

  $scope.transferNumbers = [
    {
      number: "sip:101@tweb.sip.us1.twilio.com",
      text:"101",
      status: "free"
    },
    {
      number: "sip:102@tweb.sip.us1.twilio.com",
      text:"102",
      status: "free"
    },
    {
      number: "sip:103@tweb.sip.us1.twilio.com",
      text:"103",
      status: "free"
    },
    {
      number: "sip:104@tweb.sip.us1.twilio.com",
      text:"104",
      status: "free"
    },
    {
      number: "sip:105@tweb.sip.us1.twilio.com",
      text:"105",
      status: "free"
    }
  ];

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
        else{
          // angular.forEach($scope.calls, function (value, key) {
          //   if (value.to === call.parentCallSid) {
          //   }
          // });
        }
      }, function (err) {
        console.log("err", err);
      }
    );
  }, 1000);

  $scope.createConference = function (user1, call) {
    let params = {};
    params.user1 = user1
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