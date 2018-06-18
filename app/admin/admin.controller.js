(function () {

  'use strict';
  angular
    .module('app')
    .controller('AdminController', adminController)
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

  adminController.$inject = ['authService', '$scope', '$firebaseAuth', '$firebaseObject', '$firebaseArray'];

    	  // Initialize Firebase
		  if (!firebase.apps.length) {
		  	var config = {
			    apiKey: "AIzaSyA7XzDXxEuhPoLwD3l02qcHeLWovVCAH-Y",
			    authDomain: "intranet-pieroni.firebaseapp.com",
			    databaseURL: "https://intranet-pieroni.firebaseio.com",
			    projectId: "intranet-pieroni",
			    storageBucket: "intranet-pieroni.appspot.com",
			    messagingSenderId: "775811721929"
			  };
			  firebase.initializeApp(config);
			}
  function adminController(authService, $scope, $firebaseAuth, $firebaseObject, $firebaseArray) {
    var vm = this;
    vm.auth = authService;
    // Get profile Info from Auth0
    vm.profile;

    if(vm.auth.isAuthenticated) {

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
		  // initialize button for saving links
		  $scope.moddingLink = false;

			$scope.getLinkStyle = function(col) {
				return {
					backgroundColor: getColor.normalColor(col)
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
		        formEl.linkText = "";
		        formEl.color = 'grey';
			}
		  
		  // Add Link
		  $scope.addLink = function () {
	        // Create a unique ID
	        var timestamp = new Date().valueOf();

	        var link = {
	            id: timestamp,
	            description: $scope.formLinks.linkDescription,
	            link: $scope.formLinks.linkAddress,
	            link_text: $scope.formLinks.linkText,
	            color: $scope.formLinks.color
	        };

	        //console.log(link);

	        // Get a key for a new Post.
	        var newLinkKey = firebase.database().ref().child('links').push().key;
	        // Write the new post's data simultaneously in the posts list and the user's post list.
	        var updates = {};
	        updates['/links/' + newLinkKey] = link;
	        return firebase.database().ref().update(updates);
	        console.log('Succesfully added');
	        $scope.cleanForm($scope.formLinks);
	    };
	    $scope.modLink = function (link) {
	    	$scope.editingLink = angular.copy(link);
	    	$scope.formLinks.id = $scope.editingLink.id;
	        $scope.formLinks.linkDescription = $scope.editingLink.description;
	        $scope.formLinks.linkAddress = $scope.editingLink.link;
	        $scope.formLinks.linkText = $scope.editingLink.link_text;
	        $scope.formLinks.color = $scope.editingLink.color;
	        $scope.moddingLink = true;
	    };
	    $scope.moddedLink = function() {
	    	var moddingId = $scope.formLinks.id;
	        var link = {
	        	id: $scope.formLinks.id,
	            description: $scope.formLinks.linkDescription,
	            link: $scope.formLinks.linkAddress,
	            link_text: $scope.formLinks.linkText,
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
	    };
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
	    var imageQuoteRef = firebase.database().ref('quote/files')
	    $scope.images = $firebaseObject(imageQuoteRef);
	    $scope.fileSelected = false;
	    $scope.selectFile = function() {
	    	var files = event.target.files[0].name;
	    	var button = document.querySelector('.file-upload-label');
	    	button.innerHTML = files;
	    	button.style.backgroundColor = '#4caf50'
	    }
	    var storage = firebase.storage();
		var storageRef = storage.ref();
		var quoteFileRef = storageRef.child('quote/');
		$scope.uploadFile = function(file) {
			console.log("Let's upload a file!");
			console.log(file);
			//console.log($scope.quoteFile);
			var id = new Date().valueOf();
			var uploadTask = storageRef.child('quote/' + id + file.name).put(file);

			uploadTask.on('state_changed', function(snapshot){
			  // Observe state change events such as progress, pause, and resume
			  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			  console.log('Upload is ' + progress + '% done');
			}, function(error) {
			  // Handle unsuccessful uploads
			}, function() {
			  // Handle successful uploads on complete
			  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
			  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
			    console.log('File available at', downloadURL);
			    // Get a key for a new Post.
		        var newLinkKey = firebase.database().ref().child('quote/files/').push().key;
		        // Write the new post's data simultaneously in the posts list and the user's post list.
		        var updates = {};
		        updates['quote/files/' + newLinkKey] = {url: downloadURL};
		        return firebase.database().ref().update(updates);
			  });
			});
	    };
	    $scope.selectImage = function(url) {
	    	var updates = {};
	    	updates['quote/active/'] = url;
	    	return firebase.database().ref().update(updates)
	    }
    }
  }
})();