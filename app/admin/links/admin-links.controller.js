(function () {

  'use strict';
  angular
    .module('app')
    .controller('AdminLinksController', adminLinksController);

  adminLinksController.$inject = ['currentAuth', '$scope', '$mdDialog', '$firebaseObject', 'firebaseService'];

  function adminLinksController(currentAuth, $scope, $mdDialog, $firebaseObject, firebaseService) {
    var vm = this;
    $scope.firebaseUser = currentAuth;

    $scope.loaded = false;

    if($scope.firebaseUser) {
		// Get Firebase Links
		var ref = firebaseService.dbRef('links/');
		$scope.links = $firebaseObject(ref);
		$scope.links.$loaded()
			.then(function() {
				$scope.loaded = true;
			})
			.catch(function(err) {
				$scope.errMessage = err;
			});

		// Form init
		$scope.formLinks = {};
		// initialize color for preview card GREY
		$scope.formLinks.color = 'grey';
		// initialize button for modding links
		$scope.moddingLink = false;

		// Function for getting link color
		$scope.getLinkStyle = function(col) {
			return {
				backgroundImage: 'linear-gradient(to right, #' + getColor.normalColor(col) + ' 0%, #' + getColor.darkColor(col) + ' 100%)'
			}
		};

		// Function for cleaning form
		$scope.cleanForm = function(formEl) {
	        formEl.id = "";
	        formEl.linkDescription = "";
	        formEl.linkAddress = "";
	        formEl.color = 'grey';
		}

		// Init Dialog for adding/editing links
		$scope.showLinkDialog = function(ev) {
			$mdDialog.show({
			  contentElement: '#myDialog',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose: false,
			  multiple: true
			});
		};

		// Cancel current action in adding/editing link dialog
		$scope.nullLink = function() {
			$mdDialog.hide();
        	$scope.cleanForm($scope.formLinks);
		}
		  
	  	// Add Link
	  	$scope.addLink = function () {
	        // Create a unique ID
	        var timestamp = new Date().valueOf();

	        // Get form data
	        var link = {
	            id: timestamp,
	            description: $scope.formLinks.linkDescription,
	            link: $scope.formLinks.linkAddress,
	            color: $scope.formLinks.color
	        };

	        // Get a key for a new Post.
		    var newLinkKey = firebaseService.addChild('links');
		    // Get update data
	        var updates = {};
	        // Set update data to form data
	        updates['/links/' + newLinkKey] = link;
	        // Update Data
	        firebaseService.dbUpdate(updates);
	        // Clean form
	        $scope.cleanForm($scope.formLinks);
	        console.log('Succesfully added');
	        // Hide Dialog
	        $mdDialog.hide();
	    };

	    // Select link to edit and copy values to form
	    $scope.modLink = function (link) {
	    	$scope.editingLink = angular.copy(link);
	    	$scope.formLinks.id = $scope.editingLink.id;
	        $scope.formLinks.linkDescription = $scope.editingLink.description;
	        $scope.formLinks.linkAddress = $scope.editingLink.link;
	        $scope.formLinks.color = $scope.editingLink.color;
	        // Set to true for UI buttons
	        $scope.moddingLink = true;
	    };
	    // Save edited link to firebase
	    $scope.moddedLink = function() {
	    	var moddingId = $scope.formLinks.id;
	        var link = {
	        	id: $scope.formLinks.id,
	            description: $scope.formLinks.linkDescription,
	            link: $scope.formLinks.linkAddress,
	            color: $scope.formLinks.color
	        };
	        var updates = link;
	        // Update record using Id
	        firebaseService.updateById(moddingId, 'links/', updates)
	        // Clean form
	        $scope.cleanForm($scope.formLinks);
	        // Set to false
	        $scope.moddingLink = false;

	        console.log('Succesfully modded');
	        // Hide dialog
	        $mdDialog.hide();
	    };
	    // Dialog for confirming Remove Action
	    $scope.showRemoveConfirmation = function(ev) {
			var confirm = $mdDialog.confirm()
	          .title('Sei sicuro di voler cancellare il link?')
	          .textContent('Il link sarà eliminato e non potrà essere recuperato. Dovrai crearne uno nuovo.')
	          .ariaLabel('Cancella il link')
	          .targetEvent(ev)
	          .ok('Rimuovi il link!')
	          .cancel('Annulla')
	          .openFrom({
		          top: -50,
		          width: 0,
		          height: 80
		        })
		        .closeTo({
		          left: 1500,
		          width:0
		        })

			    $mdDialog.show(confirm).then(function() {
			      $scope.removeLink();
			    }, function() {
			    });
	    }
	    // Function for removing link from database
	    $scope.removeLink = function() {
	    	// Get Id
	    	var moddingId = $scope.formLinks.id;

	        //return firebase.database().ref().update(updates);
	        /*ref.orderByChild("id").equalTo(moddingId).on("child_added", function (snapshot) {
                //console.log(snapshot.key);
                var linkRef = firebase.database().ref('links/' + snapshot.key);
                //console.log(itemRef);
                linkRef.remove();
            });*/
            firebaseService.removeById(moddingId, 'links/');
	        //updates['/links/' + ] = link;
	        // Clean form
	        $scope.cleanForm($scope.formLinks);
	        $scope.moddingLink = false;

	        console.log('Succesfully removed');
	    };
    }
  }
})();