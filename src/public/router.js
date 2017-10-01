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
	.state('home',{
    url: '/:user',
		views: {
	  	'main': {
				templateUrl: 'app/views/home.html',
				controller: 'HomeController'
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
  });

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
});