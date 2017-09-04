'use strict';

app.controller("ConferenceListController", function($scope, $state, $interval, RESTService){

  $scope.calls = [];

  RESTService.getConferenceList().then(
    function (response) {
      $scope.conferences = response.data;
      $scope.msg = undefined;
      if($scope.conferences.length === 0){
        $scope.msg = "There is no conference in progress"
      }
    }, function (err) {
      console.log("err", err);
    }
  );

  $interval(function(){
    RESTService.getConferenceList().then(
      function (response) {
        $scope.conferences = response.data;
        $scope.msg = undefined;
        if($scope.conferences.length === 0){
          $scope.msg = "There is no conference in progress"
        }
      }, function (err) {
        console.log("err", err);
      }
    );
  },1000);

  $scope.resumeCall = function(callSid, conferenceName){
    RESTService.resumeCall(callSid, conferenceName).then(
      function (response) {
        console.log("response", response);
      }, function (err) {
        console.log("err", err);
      }
    );
  }
});