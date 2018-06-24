(function () {

  'use strict';

  angular
    .module('app')
    .controller('LoginController', loginController);

  loginController.$inject = ['$rootScope', '$scope', 'Auth', 'currentAuth', '$state'];

  function loginController($rootScope, $scope, Auth, currentAuth, $state) {

    var vm = this;

    // Set body class
    $rootScope.bodyClass = 'not-authenticated';

    $scope.auth = Auth;
    $scope.firebaseUser = currentAuth;

    $scope.formFire = {};
    $scope.fireLogin = function() {
      var user = $scope.formFire.user;
      var pass = $scope.formFire.pass;

      Auth.$signInWithEmailAndPassword(user, pass).then(function(firebaseUser) {
          //console.log("Signed in as:", firebaseUser.user.email);
        }).catch(function(error) {
          if(error.code === "auth/wrong-password") {
            $scope.error = true;
            $scope.errorAuth = 'Non siamo riusciti a trovare questa combinazione di email e password. Ricontrolla i dati e riprova!'
          }
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