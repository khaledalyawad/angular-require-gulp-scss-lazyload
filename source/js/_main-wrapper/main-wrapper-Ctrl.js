'use strict';

define(['js/app'], function(app) {
  return app.$controllerProvider.register('mainWrapperCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    function($scope, $rootScope, $state) {
      console.log("obj");
    }
  ]);
});
