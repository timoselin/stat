
angular
	.module('statisticApp')
	.factory('dataa', ['$http', function($http){
		var o = {
    		//data: []
			allCollections: [],
			currentCollection: {
				index: Number,
				dataEntries: []
			}
  		};

		o.getAllCollections = function(forced) {
			if(forced) {
				return $http.get('/inserts').success(function(data){
					angular.copy(data, o.allCollections);
				});
			} else {
				if(o.allCollections.length == 0) {
					return $http.get('/inserts').success(function(data){
						angular.copy(data, o.allCollections);
					});
				}
			}
  		};
		
		o.createCollection = function(dataa) {
  			return $http.post('/inserts', dataa)
				.success(function(data){
					o.allCollections.push(data);
  				})
				.error(function(data, status){
					console.log("error status");
				});
		};

		o.getDataEntries = function(trimTitle) {
    		var force = false;
			o.getAllCollections(force);
			return $http.get('/inserts/' + trimTitle).then(function(res){
				selectCollection(trimTitle);
				o.currentCollection.dataEntries = res.data;
    		});
  		};
		
		o.createDataEntry = function(trimmedTitle, set) {
  			return $http.post('/inserts/' + trimmedTitle + '/dataset', set)
			  .success(function(dataEntry){
				  o.currentCollection.dataEntries.push(dataEntry);
			  });
		};

		// selectCollection for resolving index of needed collection in allCollections
		function selectCollection(trimTitle) {
			for (var i = 0; i < o.allCollections.length; i++) {
				if(trimTitle === o.allCollections[i].trimTitle) {
					o.currentCollection.index = i;
					break;
				}
			}
		}

		return o;
		
	}]);