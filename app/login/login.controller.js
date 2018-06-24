(function () {

  'use strict';

  angular
    .module('app')
    .controller('LoginController', loginController);

  loginController.$inject = ['$scope', 'Auth', 'currentAuth', '$state'];

  function loginController($scope, Auth, currentAuth, $state) {

    var vm = this;

    $scope.auth = Auth;
    $scope.firebaseUser = currentAuth;

    $scope.formFire = {};
    $scope.fireLogin = function() {
      var user = $scope.formFire.user;
      var pass = $scope.formFire.pass;

      Auth.$signInWithEmailAndPassword(user, pass).then(function(firebaseUser) {
          console.log("Signed in as:", firebaseUser.user.email);
        }).catch(function(error) {
          console.error("Authentication failed:", error);
      });
    }
    Auth.$onAuthStateChanged(function(firebaseUser, toState, toParams, fromState, fromParams) {
      if(firebaseUser) {
        $state.go('home');
        console.log('Signed In')
      }
    });
  }

})();