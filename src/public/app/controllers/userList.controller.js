"use strict";
app.controller("userListController", function(
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
          $scope.msg = undefined;
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
            if(usersVal.hasOwnProperty('conferenceSid')){
              delete usersVal.conferenceSid;
            }
            if(usersVal.hasOwnProperty('friendlyName')){
              delete usersVal.friendlyName;
            }
            if(usersVal.hasOwnProperty('callSid')){
              delete usersVal.callSid;
            }
            angular.forEach($scope.conferences, function(confVal, confKey) {
              angular.forEach(confVal.participants, function(participant) {
                if(selectedUserTmp.hasOwnProperty('number')){
                  if(selectedUserTmp.number === participant.to){
                    selectedUserTmp.conferenceSid = confVal.sid;
                    selectedUserTmp.friendlyName = confVal.friendlyName;
                  }
                }
                if(usersVal.number === participant.to){
                  usersVal.conferenceSid = confVal.sid;
                  usersVal.friendlyName = confVal.friendlyName;
                  usersVal.callSid = participant.callSid;
                }
              });
            });
          });
          angular.forEach($scope.calls, function(callVal, callKey) {
            angular.forEach($scope.users, function(usersVal) {
              if (usersVal.number === callVal.to) {
                usersVal.status = "busy";
              }
              if ($stateParams.user === usersVal.text) {
                selectedUserTmp = usersVal;
                selectedUserTmp.callSid = callVal.sid;
              }
            });
          });
          if(!selectedUserTmp.hasOwnProperty('number')){
            $scope.msg = "There is no user selected";
          }
          $scope.selectedUser = selectedUserTmp;
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

  $scope.joinConference = function(UserNo) {
    console.log("tranfering...", UserNo);
    let isRequestDone = false;
    if(!$scope.selectedUser.hasOwnProperty('conferenceSid')){
      console.log("Trying to create conference");
      let params = {};
      params.user1 = UserNo;

      params.user2No = $scope.selectedUser.number;
      params.user2CallSid = $scope.selectedUser.callSid;
      angular.forEach($scope.calls, function(value, key) {
        if (value.parentCallSid === $scope.selectedUser.callSid) {
          console.log("found call");
          isRequestDone = true;
          params.clientNo = value.to;
          params.clientCallSid = value.sid;
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
    }else{
      console.log("Move to conference");
      let data = {
        conferenceSid: $scope.selectedUser.conferenceSid,
        conferenceName: $scope.selectedUser.friendlyName,
        callNo: UserNo
      };
      isRequestDone = true;
      RESTService.createCallAndJoinConference(data).then(
        function(response) {
          console.log("response", response);
        },
        function(err) {
          console.log("err", err);
        }
      );
    }

    setTimeout(function() {
      if(!isRequestDone){
        $scope.joinConference(UserNo);
      }
    }, 500);
  };

  $scope.resumeCall = function(callSid, confName, confSid) {
    let data = {
      "callSid": callSid,
      "conferenceName": confName,
      "conferenceSid": confSid
    }
    RESTService.resumeCall(data).then(
      function(response) {
        console.log("response", response);
      },
      function(err) {
        console.log("err", err);
      }
    );
  };

});
