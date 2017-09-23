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

  this.resumeCall = function (data) {
    let defer = $q.defer();
    $http({
      method: 'POST',
      url: '/Join-Client-Conference',
      data: data
    }).then(function (response) {
      defer.resolve(response);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  }

  this.getUsers = function(){
    let defer = $q.defer();
    $http({
      method: 'GET',
      url: '/Get-Users',
    }).then(function (response) {
      defer.resolve(response);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  }

  this.createCallAndJoinConference = function (data) {
    let defer = $q.defer();
    $http({
      method: 'POST',
      url: '/Create-Call-Join-Conference',
      data: data
    }).then(function (response) {
      defer.resolve(response);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  }
});