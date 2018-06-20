(function () {

  'use strict';
  angular
    .module('app')
    .controller('AdminController', adminController);

  adminController.$inject = ['lockService', '$scope', '$firebaseObject', 'moment', '$http'];

  	function adminController(lockService, $scope, $firebaseObject, moment, $http) {
    	var vm = this;
    	$scope.lock = lockService;

    	if($scope.lock.isAuthenticated()) {
    		 // Set loaded state to show loading svg
		    $scope.loaded = false;

		    $scope.today = {};
			$scope.todayCalendar = new Date();
		    // Set welcome card

		    // Month Cards
		    var time = {
		    	months: {
		    		gennaio: 'january',
			    	febbraio: 'february',
			    	marzo: 'march',
			    	aprile: 'april',
			    	maggio: 'may',
			    	giugno: 'june',
			    	luglio: 'july',
			    	agosto: 'august',
			    	settembre: 'september',
			    	ottobre: 'october',
			    	novembre: 'november',
			    	dicembre: 'december'
			    },
			    hours: {
			    	morning: 'Buongiorno',
			    	afternoon: 'Buon pomeriggio',
			    	evening: 'Buonasera',
			    	night: 'Buonanotte'
			    }
		    }

		    // Date Object
		    function setDateObj () {
		    	var now = moment(new Date()).format('DD,MMMM,HH,mm');
		    	var nowArr = now.split(',');
				$scope.today.day = nowArr[0];
				$scope.today.month = nowArr[1];
				$scope.today.hour = nowArr[2];
				$scope.today.minute = nowArr[3];
				$scope.today.img = time.months[nowArr[1]];
				switch (nowArr[2]) {
					case '07':
					case '08':
					case '09':
					case '10':
					case '11':
						$scope.greeting = time.hours.morning
						break;
					case '12':
					case '13':
					case '14':
					case '15':
					case '16':
					case '17':
						$scope.greeting = time.hours.afternoon
						break;
					case '18':
					case '19':
					case '20':
					case '21':
					case '22':
					case '23':
						$scope.greeting = time.hours.evening
						break;
					case '00':
					case '01':
					case '02':
					case '03':
					case '04':
					case '05':
					case '06':
						$scope.greeting = time.hours.night
						break;
					default:
						$scope.greeting = time.hours.morning
						break;
				}
		    };
		    // Set Background Image Related to Month
		    setDateObj();
		    $scope.welcomeCardBackground = function() {
		    	return {
		    		backgroundImage: 'url(assets/' + $scope.today.img + '.jpg)'
		    	};
		    };
		    // Set icons for different groups
		    var fbGroupsIcons = {
		    	SECRET: 'lock',
		    	OPEN: 'public',
		    	CLOSED: 'lock_open' 
		    }
		    // Get Facebook Workplace Groups from Api
		    $http.post('/fbapi/getgroups').then(
	             function(response){
	               // success callback
	               	$scope.fbGroups = response.data.data;
	               	$scope.fbGroups.forEach(el => {
	               		el.icon = fbGroupsIcons[el.privacy]
	               	});
	               	$scope.loaded = true;
	             }, 
	             function(response){
	               // failure callback,handle error here
	               $scope.loaded = true;
	               $scope.errorFb = response.err;
	             }
	   		);
    	}
    
	}
})();