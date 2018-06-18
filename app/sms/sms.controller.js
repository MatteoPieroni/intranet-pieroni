(function(){
	'use strict';
	angular
		.module('app')
		.controller('SmsController', smsController);

	smsController.$inject = ['lockService', '$scope', '$http', '$filter', 'moment', '$state', '$mdToast'];

	function smsController(lockService, $scope, $http, $filter, moment, $state, $mdToast) {
		var vm = this;
		$scope.lock = lockService;

		if($scope.lock.isAuthenticated()) {
			// Init SMS Form
			$scope.formSms = {};
			// Function for Cleaning Form
			var cleanForm = function() {
				$scope.formSms.recipient = '';
				$scope.formSms.message = '';
			}

		   	// Objects to collect sent messages and errors
		   	$scope.sentSms = {};
		   	$scope.error = {};

		   	// Function for toasts
       	   	$scope.showSimpleToast = function(text) {
			    $mdToast.show(
			      $mdToast.simple()
			        .textContent(text)
			        .position('bottom left')
			        .hideDelay(3000)
			    );
			};

			$scope.readableTime = function(time) {
				moment(time).fromNow();
			};

			// Function for Sending SMS
		   	$scope.sendSms = function () {
		   		$scope.sending = true;
				// Collecting Form Data
			   	var data = {
			   		"num": $scope.formSms.recipient,
			   		"messaggio": $scope.formSms.message
			   	}

		   		// Post SMS to API
			   	$http.post('/smsapi/send', data).then(
	                 function(response){
	                   // Success Callback
	                   if(response.data != 'NO') {
	                   	   	$scope.message = "Il tuo messaggio a " + response.data + " è stato inviato correttamente";
	                   	   	var newItem = new Date().valueOf();
	                   	   	$scope.sentSms[newItem] = {
	                   	   		number: data.num,
	                   	   		message: data.messaggio,
	                   	   		tempo: newItem
	                   	   	};
	                   	   	var successToast = 'Il tuo messaggio a ' + response.data + ' è stato inviato';
	                   	   	$scope.showSimpleToast(successToast);
		   					$scope.sending = false;
			   				cleanForm();
	                    } else {
	                    	// In case number is wrong
	                   	   	var errorToast = 'C\'è stato un problema, ricontrolla il numero per favore.';
	                   	   	$scope.showSimpleToast(errorToast);
		   					$scope.sending = false;
	                    	//$scope.error.message = "C'è stato un problema, ricontrolla il numero per favore."
	                    }
	                 }, 
	                 function(response){
	                   // Show Error
		           	   	var errorToast = 'C\'è stato un problema con l\'invio del messaggio';
		           	   	$scope.showSimpleToast(errorToast);
	   					$scope.sending = false;
	                 }
		   		);
		   };
		} else {
			$state.go('home');
		}
	}
})();