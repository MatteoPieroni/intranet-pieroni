(function () {

  'use strict';
  angular
    .module('app')
    .controller('HomeController', homeController);

  homeController.$inject = ['authService', '$scope', '$firebaseAuth', '$firebaseObject', '$firebaseArray'];

  function homeController(authService, $scope, $firebaseAuth, $firebaseObject, $firebaseArray) {
    var vm = this;
    vm.auth = authService;

    if(vm.auth.isAuthenticated) {
    	  // Initialize Firebase
		  var config = {
		    apiKey: "AIzaSyA7XzDXxEuhPoLwD3l02qcHeLWovVCAH-Y",
		    authDomain: "intranet-pieroni.firebaseapp.com",
		    databaseURL: "https://intranet-pieroni.firebaseio.com",
		    projectId: "intranet-pieroni",
		    storageBucket: "intranet-pieroni.appspot.com",
		    messagingSenderId: "775811721929"
		  };
		  firebase.initializeApp(config);

		  var ref = firebase.database().ref('links/');
		  $scope.links = $firebaseObject(ref);

		  $scope.links.$loaded()
		  .then(function() {
		    console.log($scope.links);
		  })
		  .catch(function(err) {
		    console.error(err);
		  });
    }

  }

})();