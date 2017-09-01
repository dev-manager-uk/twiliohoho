'use strict';

app.service("RESTService", function ($http, $q) {
  this.getCallList = function () {
    let defer = $q.defer();
    $http({
      method: 'GET',
      url: '/Call-List'
    }).then(function (response) {
      defer.resolve(response);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  }

  this.getConferenceList = function () {
    let defer = $q.defer();
    $http({
      method: 'GET',
      url: '/Conference-List'
    }).then(function (response) {
      defer.resolve(response);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  }

  this.createConference = function (params) {
    let defer = $q.defer();
    $http({
      method: 'POST',
      url: '/Create-Conference',
      data: params
    }).then(function (response) {
      defer.resolve(response);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  }

  this.dropCall = function (callSid) {
    let defer = $q.defer();
    $http({
      method: 'POST',
      url: '/Drop-Call',
      data: {
        "callSid": callSid
      }
    }).then(function (response) {
      defer.resolve(response);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  }
});