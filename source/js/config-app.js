/**
 * Defines states, constants for application
 */
define([
  'js/app',
  'lazy-load-service',
  'api-call',
  'api-interceptor',
], function (app) {
  'use strict';

  app.constant('CONFIG', {
    isLocal: true,
    resources: {
      states: '/js/_global-resources/lazy-load/lazy-load.json'
    }
  });

  app.config(
    [ '$stateProvider', '$controllerProvider', '$urlRouterProvider',
      '$httpProvider', '$provide', '$compileProvider', '$filterProvider', 'CONFIG',
      function ($stateProvider, $controllerProvider, $urlRouterProvider,
                $httpProvider, $provide, $compileProvider, $filterProvider, CONFIG) {

        //LAZY LOAD
        app.$stateProvider = $stateProvider;
        app.$controllerProvider = $controllerProvider;
        app.$provide = $provide;
        app.$compileProvider = $compileProvider;
        app.$filterProvider = $filterProvider;


        //HTTP INTERCEPTOR
        $httpProvider.defaults.headers.patch = {'Content-Type': 'application/json;charset=utf-8'};
        $httpProvider.interceptors.push('apiInterceptor');


        //UI ROUTES
        app.$stateProvider
          .state('main-wrapper', {
            templateUrl: 'js/_main-wrapper/main-wrapper.html',
            abstract: true,
            controller: 'mainWrapperCtrl',
            resolve: {
              'loadDependencies': function ($stateParams, lazyLoadService) {
                return lazyLoadService.loadDependencies('main-wrapper');
              }
            }
          })

          .state('start', {
            parent: 'main-wrapper',
            url: '/start',
            templateUrl: 'js/start/start.html',
            controller: 'startCtrl',
            resolve: {
              'loadDependencies': function ($stateParams, lazyLoadService) {
                return lazyLoadService.loadDependencies('start');
              }
            }
          })

          .state('about', {
            parent: 'main-wrapper',
            url: '/about',
            templateUrl: 'js/about/about.html',
            controller: 'aboutCtrl',
            resolve: {
              'loadDependencies': function ($stateParams, lazyLoadService) {
                return lazyLoadService.loadDependencies('about');
              }
            }
          })

        $urlRouterProvider.otherwise('/start');

      }
    ]
  );

  app.run([
  	'$rootScope', '$state', '$stateParams', 'CONFIG',
  	function ($rootScope, $state, $stateParams, CONFIG) {

    //STATE CHANGE
    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;

    });
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$translateChangeSuccess', function(event, data) {
    });

    }
  ]);

});
