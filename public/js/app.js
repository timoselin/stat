// js/app.js
// Application main

var app = angular.module('statisticApp', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$stateProvider
    .state('home', {
    	url: '/collections',
      	templateUrl: '/home.html',
      	controller: 'MainCtrl',
		resolve: {
        	dataPromise: ['dataa', function(dataa){
        	return dataa.getAllCollections(true);
		}]}
    });
	
	$stateProvider
    .state('inserts', {
    	url: '/collections/{trimTitle}/measurements',
      	templateUrl: '/inserts.html',
      	controller: 'InsertCtrl',
		resolve: {
        	data: ['$stateParams', 'dataa', function($stateParams, dataa) {
         		return dataa.getDataEntries($stateParams.trimTitle);
        	}]
      	}
    });

	$stateProvider
    .state('views', {
    	url: '/collections/{trimTitle}/measurements/{dataNbr}',
      	templateUrl: '/views.html',
      	controller: 'ViewCtrl',
		resolve: {
        	data: ['$stateParams', 'dataa', function($stateParams, dataa) {
         		return dataa.getDataEntries($stateParams.trimTitle);
        	}]
      	}
    });

	$stateProvider
    .state('views2', {
    	url: '/collections/{trimTitle}/measurements/{dataNbr}/linechart',
      	templateUrl: '/views2.html',
      	controller: 'ViewCtrl'
      	}
    );

	$stateProvider
    .state('views3', {
    	url: '/collections/{trimTitle}/measurements/{dataNbr}/barchart',
      	templateUrl: '/views3.html',
      	controller: 'ViewCtrl'
      	}
    );

	$stateProvider
    .state('views4', {
    	url: '/collections/{trimTitle}/measurements/{dataNbr}/piechart',
      	templateUrl: '/views4.html',
      	controller: 'ViewCtrl'
      	}
    );

	$urlRouterProvider.otherwise('/collections');
}]);
