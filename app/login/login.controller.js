(function () {

  'use strict';

  angular
    .module('app')
    .controller('LoginController', loginController);

  loginController.$inject = ['$rootScope', '$scope', 'Auth', 'currentAuth', '$state', '$timeout'];

  function loginController($rootScope, $scope, Auth, currentAuth, $state, $timeout) {

    var vm = this;

    // Set body class
    $rootScope.bodyClass = 'not-authenticated';

    $scope.auth = Auth;
    $scope.firebaseUser = currentAuth;
    // Init loader as false for login UI
    $scope.loginLoader = false;
    // Object for form data
    $scope.formFire = {};
    // Function for logging in
    $scope.fireLogin = function() {
      var user = $scope.formFire.user;
      var pass = $scope.formFire.pass;
      // Clear errors if after error
      $scope.error = false;
      $scope.errorAuth = '';
      $scope.loginLoader = true;

      Auth.$signInWithEmailAndPassword(user, pass).then(function(firebaseUser) {
          //console.log("Signed in as:", firebaseUser.user.email);
          $scope.loginLoader = false;
        }).catch(function(error) {
          if(error.code === "auth/wrong-password") {
            $scope.error = true;
            $scope.errorAuth = 'Non siamo riusciti a trovare questa combinazione di email e password. Ricontrolla i dati e riprova!'
          }
          console.error("Authentication failed:", error);
      });
    };
    // Init reset as false for UI
    $scope.resetting = false;
    $scope.resetLoader = false;
    $scope.resetForm = {};
    // Function for showing resetting UI
    $scope.showReset = function() {
      $scope.resetting = true;
    }
    // Function for sending password
    $scope.resetPassword = function() {
      var email = $scope.resetForm.emailReset;
      $scope.resetLoader = true;
      Auth.$sendPasswordResetEmail(email).then(function() {
        $scope.resetMessage = "Ti abbiamo inviato una mail per il reset della password!";
        $scope.resetForm.emailReset = '';
        $scope.resetLoader = false;
        $timeout( function(){
          $scope.resetMessage = '';
          $scope.resetting = false;
        }, 3000 );
      }).catch(function(error) {
        $scope.resetMessage = "Sembra esserci stato un errore. Contatta l'amministratore! Descrizione dell'errore: " + error;
        $scope.resetLoader = false;
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