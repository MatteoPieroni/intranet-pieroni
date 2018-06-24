(function () {

  'use strict';
  angular
    .module('app')
    .controller('AdminQuoteController', adminQuoteController);

  adminQuoteController.$inject = ['currentAuth', '$scope', '$mdDialog', '$firebaseObject', 'firebaseService', 'uploadService', '$mdToast'];

  function adminQuoteController(currentAuth, $scope, $mdDialog, $firebaseObject, firebaseService, uploadService, $mdToast) {
    var vm = this;
    $scope.firebaseUser = currentAuth;

    if($scope.firebaseUser) {
    	// Get Quote reference from Firebase and assign to $scope
		var quoteRef = firebaseService.dbRef('quote');
		$scope.quotes = $firebaseObject(quoteRef);
		
		// Init loading state to show loading
		$scope.loaded = false;

		$scope.quotes.$loaded()
		  .then(function() {
		  	// Set loaded state as loaded
		  	$scope.loaded = true;
		    //console.log($scope.quotes);
		  })
		  .catch(function(err) {
		  	// Set up error to show
		  	$scope.errQuote = err;
		  });

		// Set up form Object
		$scope.formQuote = {};	

	   	// Function for toasts
   	   	$scope.showSimpleToast = function(text) {
		    $mdToast.show(
		      $mdToast.simple()
		        .textContent(text)
		        .position('bottom left')
		        .hideDelay(3000)
		    );
		};

		// Set up null action for button cancel
		$scope.nullModText = function() {
			$mdDialog.hide();
        	$scope.formQuote.text = "";
		}

		// Show Dialog for quote text edit
		$scope.openQuoteTextMod = function(ev) {
			$mdDialog.show({
			  contentElement: '#quote-text-dialog',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose: false,
			  multiple: true
			});
		};

		// Set up function to edit quote text
	    $scope.modQuoteText = function (quote) {
	    	//console.log(quote);
	    	$scope.editingQuote = angular.copy(quote);
	    	$scope.formQuote.text = $scope.editingQuote.text;
	    };

	    // Function to save Quote text
	    $scope.saveQuoteText = function() {
	    	var updates = {}
	    	var active = {
	    		text: $scope.formQuote.text,
	    		// Re-set same url
	    		url: $scope.quotes.active.url
	    	};
	    	updates['quote/active/'] = active;

	    	console.log('Succesfully modded');
	    	var successToast = 'Testo correttamente modificato';
	        $scope.showSimpleToast(successToast);
	        $mdDialog.hide();
	    	
	    	firebaseService.dbUpdate(updates)
	    }

	    // Show dialog for quote img edit
		$scope.openQuoteImageMod = function(ev) {
			$mdDialog.show({
			  contentElement: '#quote-image-dialog',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose: false,
			  multiple: true
			});
		};

		// Watch for selected img to update disabled save button
		$scope.$watch(function () {
			return uploadService.getSelectedStatus();
		}, function (newVal) {
			$scope.selectedQuoteImage = uploadService.getSelectedStatus();
		});

		// Set up of null function to cancel quote img edit
		$scope.nullModImage = function() {
			$mdDialog.hide();
			// Empty form object
        	$scope.formQuote.url = "";
        	// Unselect image
        	uploadService.setSelectedStatus(false);
		}

		// Function to save quote image
	    $scope.saveQuoteImage = function() {
	    	var updates = {};
	    	// Get Object exposed by uploadService
	    	var uploadedObj = uploadService.getObj();
	    	var active = {
	    		// Re-set same text
	    		text: $scope.quotes.active.text,
	    		url: uploadedObj.url
	    	};
	    	updates['quote/active/'] = active;

	    	console.log('Succesfully modded');
	    	var successToast = 'Immagine impostata';
	        $scope.showSimpleToast(successToast);
	        $mdDialog.hide();
        	// Unselect image
        	uploadService.setSelectedStatus(false);

	    	firebaseService.dbUpdate(updates)
	    }

	    // Set deleting status for UI progress
	    $scope.deleting = false;
	    // Function to delete image in list
	    $scope.deleteImage = function() {
	    	$scope.deleting = true;
	    	var uploadedObj = uploadService.getObj();
	    	uploadService.deleteFileInList(uploadedObj.url, function() {
	    		firebaseService.removeByUrl(uploadedObj.url, 'images/', function() {
	    			$scope.deleting = false;
		        	// Unselect image
		        	uploadService.setSelectedStatus(false);
			    	var successToast = 'Immagine correttamente eliminata';
			        $scope.showSimpleToast(successToast);
	    		});
	    	});
	    }

    }
  }
})();