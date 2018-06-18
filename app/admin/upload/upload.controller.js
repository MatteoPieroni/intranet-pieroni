
  angular
    .module('app')
    .controller('UploadController', uploadController);

    uploadController.$inject = ['authService', '$scope','$firebaseObject', 'firebaseService', 'uploadService'];
    
  function uploadController(authService, $scope, $firebaseObject, firebaseService, uploadService) {
    var vm = this;
    vm.auth = authService;

    if(vm.auth.isAuthenticated) {

	    $scope.uploading = false;
	    $scope.upload = function() {
	    	$scope.uploading = true;
	    }

    firebaseService.init();
    var folder = $scope.folder;
    var formData = $scope.formdata;
    var imageQuoteRef = firebaseService.dbRef($scope.folder);
	    $scope.images = $firebaseObject(imageQuoteRef);
      $scope.fileSelected = false;
      $scope.selectButtonText = 'Scegli un\'immagine';

      $scope.selectFile = function() {
        var fileName = event.target.files[0].name;
        var button = document.querySelector('.file-upload-label');
        button.innerHTML = fileName;
        button.style.backgroundColor = '#4caf50'
      }

      $scope.backAfterSelect = function() {
        var button = document.querySelector('.file-upload-label');
        button.innerHTML = $scope.selectButtonText;
        button.style.backgroundColor = 'rgb(250,250,250)';
      }


	    $scope.selectImage = function(image) {
	    	uploadService.setObj(image);
	    	uploadService.setSelectedStatus(true);
	    }


      var storage = firebase.storage();
      var storageRef = storage.ref();
      var quoteFileRef = storageRef.child('quote/');
      $scope.uploadFile = function(file) {
        console.log("Let's upload a file!");
        console.log(file);
        //console.log($scope.quoteFile);
        var id = new Date().valueOf();
        var uploadTask = storageRef.child(folder + '/' + id + file.name).put(file);

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
              var newLinkKey = firebase.database().ref().child($scope.folder + '/').push().key;
              // Write the new post's data simultaneously in the posts list and the user's post list.
              var updates = {};
              updates[$scope.folder + '/' + newLinkKey] = {url: downloadURL};

              $scope.backAfterSelect();
              $scope.uploading = false;

              return firebase.database().ref().update(updates);
          });
        });
      };
    }
  };