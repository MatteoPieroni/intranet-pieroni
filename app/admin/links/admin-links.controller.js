(function () {

  'use strict';
  angular
    .module('app')
    .controller('AdminLinksController', adminLinksController)
    .directive('customOnChange', function() {
	  return {
	    restrict: 'A',
	    link: function (scope, element, attrs) {
	      var onChangeFunc = scope.$eval(attrs.customOnChange);
	      element.on('change', onChangeFunc);
	      element.on('$destroy', function() {
	        element.off();
	      });
	    }
	  };
	});

  adminLinksController.$inject = ['authService', '$scope', '$mdDialog', '$firebaseAuth', '$firebaseObject', 'firebaseService'];

  function adminLinksController(authService, $scope, $mdDialog, $firebaseAuth, $firebaseObject, firebaseService) {
    var vm = this;
    vm.auth = authService;

    if(vm.auth.isAuthenticated) {
    	firebaseService.init();
		  var ref = firebase.database().ref('links/');
		  $scope.links = $firebaseObject(ref);
		  // init page dummy link
		  $scope.loadingLinks = true;
		  $scope.links.$loaded()
		  .then(function() {
		  	$scope.loadingLinks = false;
		    console.log($scope.links);
		  })
		  .catch(function(err) {
		    console.error(err);
		  });

		  // Form init
		  $scope.formLinks = {};
		  // initialize color for preview card GREY
		  $scope.formLinks.color = 'grey';
		  // initialize button for modding links
		  $scope.moddingLink = false;

			$scope.getLinkStyle = function(col) {
				return {
					backgroundImage: 'url(assets/' + getColor.normalColor(col) + '.jpg)'
				}
			};
			$scope.getLinkFooterStyle = function(col) {
				return {
					backgroundColor: getColor.darkColor(col)
				}
			};

			$scope.cleanForm = function(formEl) {
		        formEl.id = "";
		        formEl.linkDescription = "";
		        formEl.linkAddress = "";
		        formEl.color = 'grey';
			}

			$scope.showLinkDialog = function(ev) {
				$mdDialog.show({
				  contentElement: '#myDialog',
				  parent: angular.element(document.body),
				  targetEvent: ev,
				  clickOutsideToClose: false,
				  multiple: true
				});
			};

			$scope.nullLink = function() {
				$mdDialog.hide();
	        	$scope.cleanForm($scope.formLinks);
			}
		  
		  // Add Link
		  $scope.addLink = function () {
	        // Create a unique ID
	        var timestamp = new Date().valueOf();

	        var link = {
	            id: timestamp,
	            description: $scope.formLinks.linkDescription,
	            link: $scope.formLinks.linkAddress,
	            color: $scope.formLinks.color
	        };

	        //console.log(link);

	        // Get a key for a new Post.
	        var newLinkKey = firebase.database().ref().child('links').push().key;
	        // Write the new post's data simultaneously in the posts list and the user's post list.
	        var updates = {};
	        updates['/links/' + newLinkKey] = link;
	        $scope.cleanForm($scope.formLinks);
	        console.log('Succesfully added');
	        $mdDialog.hide();
	        return firebase.database().ref().update(updates);
	    };
	    $scope.modLink = function (link) {
	    	$scope.editingLink = angular.copy(link);
	    	$scope.formLinks.id = $scope.editingLink.id;
	        $scope.formLinks.linkDescription = $scope.editingLink.description;
	        $scope.formLinks.linkAddress = $scope.editingLink.link;
	        $scope.formLinks.color = $scope.editingLink.color;
	        $scope.moddingLink = true;
	    };
	    $scope.moddedLink = function() {
	    	var moddingId = $scope.formLinks.id;
	        var link = {
	        	id: $scope.formLinks.id,
	            description: $scope.formLinks.linkDescription,
	            link: $scope.formLinks.linkAddress,
	            color: $scope.formLinks.color
	        };
	        var updates = link;

	        //return firebase.database().ref().update(updates);
	        ref.orderByChild("id").equalTo(moddingId).on("child_added", function (snapshot) {
                //console.log(snapshot.key);
                var linkRef = firebase.database().ref('links/' + snapshot.key);
                //console.log(itemRef);
                linkRef.update(updates);
            });
	        //updates['/links/' + ] = link;
	        $scope.cleanForm($scope.formLinks);
	        $scope.moddingLink = false;

	        console.log('Succesfully modded');
	        $mdDialog.hide();
	    };
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
	    $scope.removeLink = function() {
	    	var moddingId = $scope.formLinks.id;

	        //return firebase.database().ref().update(updates);
	        ref.orderByChild("id").equalTo(moddingId).on("child_added", function (snapshot) {
                //console.log(snapshot.key);
                var linkRef = firebase.database().ref('links/' + snapshot.key);
                //console.log(itemRef);
                linkRef.remove();
            });
	        //updates['/links/' + ] = link;
	        $scope.cleanForm($scope.formLinks);
	        $scope.moddingLink = false;

	        console.log('Succesfully removed');
	    };
    }
  }
})();