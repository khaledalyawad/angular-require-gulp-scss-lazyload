define(['lodash', 'js/app', 'require'], function (_, app, requirejs) {

    'use strict';
    app.service('lazyLoadService', ['$http', '$q', 'CONFIG', 'apiCall',
        function (http, q, CONFIG, apiCall) {
            var self = this;

            this.loadDependencies = function (stateName) {
                var deferred = q.defer();

                //apiCall implementation
               apiCall.call({
                  URL: CONFIG.resources.states,
                  cache: true
               }).then(function(data, status, headers) {
                  if( data && _.has(data, stateName) ){
                      self.loadDependenciesFromArray( _.get(data, stateName), deferred );
                  } else {
                      deferred.resolve();
                  }
               }, function(data, status, headers) {

               });


                return deferred.promise;
            };

            this.loadDependenciesFromArray = function (depArr, deferred) {
                if(depArr && depArr.length) {
                    requirejs(depArr, function () {
                        if(CONFIG.isLocal){ console.log('requirejs loaded', depArr); }
                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }
            };

            this.lazyloadResource = function(path) {
              var deferred = q.defer();

              //apiCall implementation
             apiCall.call({
                URL: path,
                cache: true
             }).then(function(data) {
                deferred.resolve(data);
             }, function(error) {

             });

              return deferred.promise;
            }
        }
    ]);

    /*
        USAGE: https://alexfeinberg.wordpress.com/2014/04/26/delay-load-anything-angular/

        RESOLVE

     resolve: {
         'loadDependencies': function ($stateParams, lazyLoadService) {
            return lazyLoadService.loadDependencies('stateName');
         },
     }

        DIRECTIVE

     define(['app'], function(app) {

         'use strict';
         //app.$compileProvider is used to lazy-register directives
         app.$compileProvider.directive('Directive',

        SERVICE

     define(['app'], function(app) {
         'use strict';

         //app.$provide is used to lazy-register services
         app.$provide.service('Service',

        CONTROLLER

     define(['app'], function(app) {

         'use strict';
         //app.$controllerProvider is used to lazy-register controllers.
         app.$controllerProvider.register('Controller', ['$scope', 'Service',
            function (scope, svc) {

     */

});
