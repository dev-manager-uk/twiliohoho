"use strict";

app.controller("ConferenceListController", function(
  $scope,
  $state,
  $interval,
  RESTService
) {
  $scope.transferNumbers = [];

  function getConferenceList() {
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
    RESTService.getConferenceList().then(
      function(response) {
        $scope.conferences = response.data;
        $scope.msg = undefined;
        if ($scope.conferences.length === 0) {
          $scope.msg = "There is no conference in progress";
        } else {
          angular.forEach($scope.conferences, function(confVal, confKey) {
            angular.forEach(confVal.participants, function(participant){
              angular.forEach($scope.transferNumbers, function(transferNoVal) {
                if (transferNoVal.number === participant.to) {
                  transferNoVal.status = "busy";
                }
              });
            });
          });
        }
      },
      function(err) {
        console.log("err", err);
      }
    );
  }

  getConferenceList();

  $interval(function() {
    getConferenceList();
  }, 1000);

  $scope.resumeCall = function(callSid, conferenceName) {
    RESTService.resumeCall(callSid, conferenceName).then(
      function(response) {
        console.log("response", response);
      },
      function(err) {
        console.log("err", err);
      }
    );
  };

  $scope.joinConference = function(conferenceName, callNo){
    RESTService.createCallAndJoinConference(conferenceName, callNo).then(
      function(response) {
        console.log("response", response);
      },
      function(err) {
        console.log("err", err);
      }
    );
  }
});
