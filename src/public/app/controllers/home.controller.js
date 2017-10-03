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

  function updateCalls() {
    RESTService.getCallList().then(function(response) {
      $scope.calls = response.data;
      RESTService.getConferenceList().then(
        function(response) {
          $scope.conferences = response.data;
          let selectedUserTmp = {};
          angular.forEach($scope.users, function(usersVal) {
            usersVal.status = "free";
            if ($stateParams.user === usersVal.text) {
              selectedUserTmp = usersVal;
              if(selectedUserTmp.hasOwnProperty('conferenceSid')){
                delete selectedUserTmp.conferenceSid;
              }
              if(selectedUserTmp.hasOwnProperty('friendlyName')){
                delete selectedUserTmp.friendlyName;
              }
            }
          });
          angular.forEach($scope.calls, function(callVal, callKey) {
            angular.forEach($scope.users, function(usersVal) {
              if (usersVal.number === callVal.to) {
                usersVal.status = "busy";
              }
              if ($stateParams.user === usersVal.text) {
                selectedUserTmp = usersVal;
              }
            });
          });
          angular.forEach($scope.conferences, function(confVal, confKey) {
            angular.forEach(confVal.participants, function(participant) {
              if(selectedUserTmp.hasOwnProperty('number')){
                if(selectedUserTmp.number === participant.to){
                  selectedUserTmp.conferenceSid = confVal.sid;
                  selectedUserTmp.friendlyName = confVal.friendlyName;
                }
              }
            });
          });
          $scope.selectedUser = selectedUserTmp;
          console.log("$scope.selectedUser", $scope.selectedUser);
          console.log("selectedUserTmp", selectedUserTmp);
        },
        function(err) {
          console.log("err", err);
        }
      );
    });
  }

  $scope.call = function(userCalled, userCalling) {
    console.log("calling...");
    let data = {
      called: userCalled,
      user: userCalling
    };
    RESTService.callBetweenClients(data).then(
      function(response) {
        console.log("completed");
      },
      function(err) {
        console.log("err", err);
      }
    );
  };

  $scope.transfer = function(userNumber) {
    console.log("tranfering...", userNumber);
  };

  $scope.joinConference = function(UserNo) {
    if(!$scope.selectedUser.hasOwnProperty('conferenceSid')){
      console.log("User has no conference!!");
      return;
    }
    let data = {
      conferenceSid: $scope.selectedUser.conferenceSid,
      conferenceName: $scope.selectedUser.friendlyName,
      callNo: UserNo
    };
    RESTService.createCallAndJoinConference(data).then(
      function(response) {
        console.log("response", response);
      },
      function(err) {
        console.log("err", err);
      }
    );
  };
});
