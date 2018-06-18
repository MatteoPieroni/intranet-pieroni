(function () {

  'use strict';
  angular
    .module('app')
    .controller('AdminQuoteController', adminQuoteController);

  adminQuoteController.$inject = ['authService', '$scope', '$mdDialog', '$firebaseAuth', '$firebaseObject', 'firebaseService', 'uploadService'];

  function adminQuoteController(authService, $scope, $mdDialog, $firebaseAuth, $firebaseObject, firebaseService, uploadService) {
    var vm = this;
    vm.auth = authService;

    if(vm.auth.isAuthenticated) {

    	firebaseService.init();

    	var formContent = {};

		var quoteRef = firebaseService.dbRef('quote');
		$scope.quotes = $firebaseObject(quoteRef);
		// init page dummy link
		$scope.loadingLinks = true;
		  $scope.quotes.$loaded()
		  .then(function() {
		  	$scope.loadingLinks = false;
		    //console.log($scope.quotes);
		  })
		  .catch(function(err) {
		    console.error(err);
		  });
		// Form init
		$scope.formQuote = {};

		  // initialize button for saving links
	 	$scope.moddingQuote = false;


		$scope.nullModText = function() {
			$mdDialog.hide();
        	$scope.formQuote.text = "";
		}

		$scope.openQuoteTextMod = function(ev) {
			$mdDialog.show({
			  contentElement: '#quote-text-dialog',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose: false,
			  multiple: true
			});
		};


	    $scope.modQuoteText = function (quote) {
	    	console.log(quote);
	    	$scope.editingQuote = angular.copy(quote);
	    	$scope.formQuote.text = $scope.editingQuote.text;
	        //$scope.formQuote.active = $scope.editingQuote.active.url;
	        $scope.moddingQuote = true;
	    };

	    $scope.saveQuoteText = function() {
	    	var updates = {}
	    	var active = {
	    		text: $scope.formQuote.text,
	    		url: $scope.quotes.active.url
	    	};
	    	updates['quote/active/'] = active;

	    	console.log('Succesfully modded');
	        $mdDialog.hide();
	    	
	    	firebaseService.dbUpdate(updates)
	    }

		$scope.openQuoteImageMod = function(ev) {
			$mdDialog.show({
			  contentElement: '#quote-image-dialog',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose: false,
			  multiple: true
			});
		};
			$scope.$watch(function () {
			return uploadService.getSelectedStatus();
			}, function (newVal) {
				$scope.selectedQuoteImage = uploadService.getSelectedStatus();
			});

		$scope.nullModImage = function() {
			$mdDialog.hide();
        	$scope.formQuote.url = "";
        	$scope.selectedQuoteImage = false;
		}

	    $scope.saveQuoteImage = function() {
	    	var updates = {};
	    	var uploadedObj = uploadService.getObj();
	    	var active = {
	    		text: $scope.quotes.active.text,
	    		url: uploadedObj.url
	    	};
	    	updates['quote/active/'] = active;

	    	console.log('Succesfully modded');
	        $mdDialog.hide();

	    	firebaseService.dbUpdate(updates)
	    }

    }
  }
})();