'use strict';

define(['js/app'], function(app) {

	app.service('apiCall', ['CONFIG', '$q', '$http', function(CONFIG, $q, $http){

		this.call = function(options){
			if(!options || !options.URL){ return; }
			var url    = options.URL;
			var params = options.params;
			var method = options.method || 'GET';
			var cache  = options.cache  || false;
			var deferred = $q.defer();

			if(method == 'GET') {
				$http.get(url, {cache: cache, params: params})
				.success( function(data, status, headers){
					deferred.resolve(data, status, headers);
				})
				.error( function(data, status, headers){
					deferred.reject(data, status, headers);
				});
			}
			else if(method == 'POST') {
				$http.post(url, {cache: cache})
				.success(function(data, status, headers){
					deferred.resolve(data, status, headers);
				})
				.error(function(data, status, headers){
					deferred.reject(data, status, headers);
				});
			}

			return deferred.promise;
		};

	}]);

});
