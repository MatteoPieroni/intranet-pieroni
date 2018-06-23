(function () {

  'use strict';
  angular
    .module('app')
    .controller('HomeController', homeController);

  homeController.$inject = ['$rootScope', '$scope', '$firebaseObject', 'lockService', 'firebaseService', 'moment'];

  function homeController($rootScope, $scope, $firebaseObject, lockService, firebaseService, moment) {
    var vm = this;
    $scope.lock = lockService;

    // Set body class
    $rootScope.bodyClass = 'not-authenticated';

    firebaseService.init();

    // Lock login on page load
    $scope.lock.login();

    // Set loaded state to show loading svg
    $scope.loaded = false;
    $scope.today = {};
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

    if($scope.lock.isAuthenticated()) {

    	$rootScope.bodyClass = 'authenticated';
    	
    	// Get Firebase Links
		var ref = firebaseService.dbRef('links/');
		$scope.links = $firebaseObject(ref);
		// Get Firebase Quote
		var quoteRef = firebaseService.dbRef('quote/');
		$scope.quote = $firebaseObject(quoteRef);

		// Define functions to get colors associated with links
		$scope.getLinkStyle = function(col) {
			return {
				backgroundImage: 'linear-gradient(to right, #' + getColor.normalColor(col) + ' 0%, #' + getColor.darkColor(col) + ' 100%)'
			}
		};

		// Set loaded state to hide loading svg and catch errors
		$scope.links.$loaded()
		.then(function() {
			$scope.quote.$loaded()
			.then(function() {
				$scope.loaded = true;
			})
			.catch(function(err) {
				console.error(err);
				alert('C\è stato un errore! Esci e rientra o contatta l\'amministratore. Descrizione errore: ' + err);
			});
		})
		.catch(function(err) {
			console.error(err);
			alert('C\è stato un errore! Esci e rientra o contatta l\'amministratore. Descrizione errore: ' + err);
		});
    }
  }
})();