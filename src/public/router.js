app
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise("/404/");

  $stateProvider
	.state('404',{
    url: '/404/',
		views: {
	  	'main': {
				templateUrl: 'app/views/404.html'
	  	}
		}
	})
  .state('callList',{
    url: '/calls',
		views: {
	  	'main': {
				templateUrl: 'app/views/callList.html',
				controller: 'CallListController'
	  	}
		}
	})
	.state('conferenceList',{
    url: '/conferences',
		views: {
	  	'main': {
				templateUrl: 'app/views/conferenceList.html',
				controller: 'ConferenceListController'
	  	}
		}
	})
	.state('userList',{
    url: '/userList/:user',
		views: {
	  	'main': {
				templateUrl: 'app/views/userList.html',
				controller: 'userListController'
	  	}
		}
	})
	.state('home',{
    url: '/',
		views: {
	  	'main': {
				templateUrl: 'app/views/home.html',
				controller: 'HomeController'
	  	}
		}
  });

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
});