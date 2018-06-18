(function(){
	'use strict';
	angular
		.module('app')
		.controller('AdminSmsController', adminSmsController);

	adminSmsController.$inject = ['authService', '$scope', '$http', '$filter', 'moment'];

	function adminSmsController(authService, $scope, $http, $filter, moment) {
		var vm = this;
		vm.auth = authService;

		if(vm.auth.isAuthenticated()) {
		   $scope.smsHistory = {};

		   	function getHistory (dateFirst, dateLast) {
			   var data = {
			   	"dateFirst": dateFirst,
			   	"dateLast": dateLast
			   };
		   		$http.post('/smsapi/gethistory', data).then(
	             function(response){
	               // success callback
	               	//console.log(response);
	               	$scope.smsHistory = response.data.smshistory;
	             }, 
	             function(response){
	               // failure callback,handle error here
	             }
	   			);
		   	}
		   	var defaultDateFirst = moment(new Date()).subtract(7, 'days').format('YYYYMMDDHHmmss');
		   	var defaultDateLast = moment(new Date()).format('YYYYMMDDHHmmss');
		   	getHistory(defaultDateFirst, defaultDateLast);
		   	$scope.myDate = new Date();

			  $scope.minDate = new Date(
			    $scope.myDate.getFullYear(),
			    $scope.myDate.getMonth() - 6,
			    $scope.myDate.getDate()
			  );

			  $scope.maxDate = new Date(
			    $scope.myDate.getFullYear(),
			    $scope.myDate.getMonth(),
			    $scope.myDate.getDate()
			  );
			  var dateRange = {}
			  $scope.dateSelected = false;
			  function clearDate () {
			  		$scope.dateSelected = false;
			  	}
			  $scope.dateFirstSelected = function(date) {
			  	$scope.dateSelected = true;
			  	dateRange.firstDate = moment(date).format('YYYYMMDDHHmmss');
			  }
			  $scope.updateDate = function(date) {
			  	dateRange.lastDate = moment(date).format('YYYYMMDDHHmmss');
			  	getHistory(dateRange.firstDate, dateRange.lastDate);
			  	clearDate();
			  }

		}
	}
})();	