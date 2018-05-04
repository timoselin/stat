angular
	.module('statisticApp')
	.controller('ViewCtrl', ['$scope', 'dataa', '$location', function($scope, dataa, $location){
		var dataEntries = dataa.currentCollection.dataEntries;
		$scope.MeaName = $location.path().split("/")[4]||"Unknown";

		// Generate objects for line chart and bar chart. Each object will have two elements: date and value.
		$scope.dataObj = [];
		if(dataEntries.length > 0) {
			for (i = 0; i < dataEntries.length; i++) {
				if ($scope.MeaName === dataEntries[i].key) {
					var tmpObj = {};
					tmpObj.value = dataEntries[i].val;
					tmpObj.date = new Date(dataEntries[i].date);
					$scope.dataObj.push(tmpObj);
				}
			}
		}

		// Make an array of values for pieChart
		$scope.graphData = [];
		if($scope.dataObj.length > 0) {
			for (i = 0; i < $scope.dataObj.length; i++) {
				$scope.graphData.push($scope.dataObj[i].value);
			}
		}
	}]);

angular
	.module('statisticApp')
	.controller('InsertCtrl', ['$scope', 'dataa', function($scope, dataa){
		var dataEntries = dataa.currentCollection.dataEntries;
		$scope.title = dataa.allCollections[dataa.currentCollection.index].title;
		$scope.keyTable = dataa.allCollections[dataa.currentCollection.index].keyTable;
		$scope.trimmedTitle = dataa.allCollections[dataa.currentCollection.index].trimTitle;

		function getKeyData(keyName) {
			var tmpArray = [];
			var tmpObj = {};
			for (var i = 0; i < dataEntries.length; i++) {
				if (keyName === dataEntries[i].key) {
					tmpObj.val = dataEntries[i].val;
					tmpObj.date = dataEntries[i].date;
					tmpArray.push(tmpObj);
					tmpObj = {};
				}
			}
			return tmpArray;
		}

		$scope.viewData = [];
		for (i = 0; i < $scope.keyTable.length; i++) {
			$scope.viewData.push(getKeyData($scope.keyTable[i]));
		}

		$scope.createDataEntry = function(){
			if(!$scope.val || $scope.val === '') { return; }

			var d = new Date();

			dataa.createDataEntry($scope.trimmedTitle, {
				key: $scope.measNbr,
				val: $scope.val,
				date: d
			}).success(function(set) {
				for (i = 0; i < $scope.keyTable.length; i++) {
					if (set.key === $scope.keyTable[i]) {
						$scope.viewData[i].push(set);
					}
				}
			});
			$scope.val = '';
		};
	}]);

angular
	.module('statisticApp')
	.controller('MainCtrl', ['$scope', 'dataa', function($scope, dataa){
		$scope.datatable = dataa.allCollections;
		$scope.keys = [];

		$scope.update = function(){
			$scope.keys.push({});
		}

		$scope.createCollection = function(){
			if(!$scope.keys[0] || $scope.keys[0] === '') { 
				alert("Atleast first measurement must be given");
				return;
			};

			// If title not given, then generate one  
			if(!$scope.title || $scope.title === '') { 
				var text = "";
    			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

				for ( var i=0; i < 10; i++ ) {
        			text += possible.charAt(Math.floor(Math.random() * possible.length));
				}
				$scope.title = text;
			};

			var measArray = [];
			for (i = 0; i < $scope.keys.length - 1; i++) {
				measArray[i] = $scope.keys[i].name;
			}
			
			dataa.createCollection({
        		title: $scope.title,
				keyTable: measArray,
				dataEntry: []
    		}).then(
				function(result) {
					console.log("success");
				},
				function(err) {
					alert("Identical measurement names are not allowed!");
				});

			$scope.title = '';
			$scope.keys = [];
		};
	}]);