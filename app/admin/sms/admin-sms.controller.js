(function(){
	'use strict';
	angular
		.module('app')
		.controller('AdminSmsController', adminSmsController);

	adminSmsController.$inject = ['lockService', '$scope', '$http', '$filter', 'moment'];

	function adminSmsController(lockService, $scope, $http, $filter, moment) {
		var vm = this;
		$scope.lock = lockService;

		// Set for UI loading
		$scope.loaded = false;
		if(lockService.isAuthenticated()) {
			// Prepare object to get data from Api
		    $scope.smsHistory = {};

		    // Function for getting history from Api
		   	function getHistory (dateFirst, dateLast) {
		   		// Set data structure for call with dates
			    var data = {
			   		"dateFirst": dateFirst,
			   		"dateLast": dateLast
			    };
			    // Call Skebby Api
		   		$http.post('/smsapi/gethistory', data).then(
					function(response){
						// success callback
						//console.log(response);
						$scope.smsHistory = response.data.smshistory;
						$scope.loaded = true;
					}, 
					function(response){
						// failure callback,handle error here
						alert('C\'è stato un problema nella raccolta dei dati. Prova a ricaricare la pagina o contatta l\'amministratore');
					}
	   			);
		   	}
		   	// Set default dates over 1 week
		   	var defaultDateFirst = moment(new Date()).subtract(7, 'days').format('YYYYMMDDHHmmss');
		   	var defaultDateLast = moment(new Date()).format('YYYYMMDDHHmmss');
		   	// First call to Api on page load
		   	getHistory(defaultDateFirst, defaultDateLast);

		   	// Get date from toolbar
		   	$scope.myDate = new Date();

		   	// Set the minimum date to 6 months (max Api data retention)
			$scope.minDate = new Date(
				$scope.myDate.getFullYear(),
				$scope.myDate.getMonth() - 6,
				$scope.myDate.getDate()
			);
			// Set max date to now
			$scope.maxDate = new Date(
				$scope.myDate.getFullYear(),
				$scope.myDate.getMonth(),
				$scope.myDate.getDate()
			);
			// Object for collecting form data
			var dateRange = {};
			// Ui for disabling last date until first date is selected
			$scope.dateSelected = false;

			// Function for clearing form after the Api gets called from date form
			function clearDate () {
				$scope.dateSelected = false;
			}
			// Format first date data for Api call
			$scope.dateFirstSelected = function(date) {
				$scope.dateSelected = true;
				dateRange.firstDate = moment(date).format('YYYYMMDDHHmmss');
			}
			// Function to call Api using defined dates
			$scope.updateDate = function(date) {
				// Format last date for Api call
				dateRange.lastDate = moment(date).format('YYYYMMDDHHmmss');
				getHistory(dateRange.firstDate, dateRange.lastDate);
				clearDate();
			}
		}
	}
})();	