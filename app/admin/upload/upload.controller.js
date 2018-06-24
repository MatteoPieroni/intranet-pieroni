
  angular
    .module('app')
    .controller('UploadController', uploadController);

  uploadController.$inject = ['$scope','$firebaseObject', 'firebaseService', 'uploadService', 'uiService', '$interval'];
    
  function uploadController($scope, $firebaseObject, firebaseService, uploadService, uiService, $interval) {
    var vm = this;

    // Set uploadRequest Status for UI
    $scope.uploadRequest = false;

    $scope.upload = function() {
    	$scope.uploadRequest = true;
    }

    $scope.unUpload = function() {
      $scope.uploadRequest = false;
    }

    // Get folder to upload image on firebase
    var folder = $scope.folder;
    // Get form data
    var formData = $scope.formdata;
    // Get ref of folder to save url on Firebase Db
    var fileRef = firebaseService.dbRef($scope.folder);
    $scope.files = $firebaseObject(fileRef);
    // Set selected status for UI
    $scope.selectedFile = false;
    
    // Set button text
    $scope.selectButtonText = 'Scegli un\'immagine';

    // Function for selecting file on button (scope outside $scope see directive)
    $scope.selectFile = function() {
      if(event.target.files[0].name !== undefined || event.target.files[0].name !== null || event.target.files[0].name !== '') {
        var fileName = event.target.files[0].name;
        var fileNameCut = fileName.substring(0, 9)
        var button = document.querySelector('.file-upload-label');
        button.innerHTML = fileNameCut;
        button.style.backgroundColor = '#4caf50';
      } else {
        console.log('No file selected...')
      }
    }

    // Re-set button after uploading
    $scope.backAfterSelect = function() {
      var button = document.querySelector('.file-upload-label');
      button.innerHTML = $scope.selectButtonText;
      button.style.backgroundColor = 'rgb(250,250,250)';
    }

    // Function for clicking in list
    $scope.selectFileInList = function(file) {
      // Serve file for use in specific controller
    	uploadService.setObj(file);
      // Set status to true for UI
    	uploadService.setSelectedStatus(true);
    }

    // Get storage ref on firebase
    var storage = firebase.storage();
    var storageRef = storage.ref();
    
    // Set up uploading for UI uploading indicator
    $scope.uploading = false;
    // Function to upload file
    $scope.uploadFile = function(file) {
      console.log("Let's upload a file!");
      console.log(file);
      $scope.uploading = true;
      
      // Create id to append to name to avoid same names
      var id = new Date().valueOf();
      if(file !== null && typeof file === 'object') {
        // set upload function to variable and execute on state change to do callbacks and listen for promises
        var uploadTask = storageRef.child(folder + '/' + id + file.name).put(file);

        uploadTask.on('state_changed', function(snapshot){
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log($scope.uploading)        
          console.log('Upload is ' + progress + '% done');
        }, function(error) {
          // Handle unsuccessful uploads
          alert('Sembra esserci stato un problema. Riprova o contatta l\'amministratore');
          return;
        }, function() {
          // Handle successful uploads on complete
          // Get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            //console.log('File available at', downloadURL);
            // Post new file to firebase db
            var newLinkKey = firebase.database().ref().child($scope.folder + '/').push().key;
            var updates = {};
            updates[$scope.folder + '/' + newLinkKey] = {url: downloadURL};

            $scope.backAfterSelect();
            $scope.uploading = false;

            return firebase.database().ref().update(updates);
          });
        });
      } else {
        console.log('No file selected...')
      }
    };
  };