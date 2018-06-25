(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['$rootScope', '$state', 'amMoment', 'firebaseService', '$firebaseObject', 'uiService', 'Auth', '$transitions', '$trace', 'fireAuthService'];
    
  function run($rootScope, $state, amMoment, firebaseService, $firebaseObject, uiService, Auth, $transitions, $trace, fireAuthService) {
    //$trace.enable("TRANSITION");

    // Set up listener for change in auth state
    Auth.$onAuthStateChanged(function(firebaseUser, toState, toParams, fromState, fromParams) {
      // Redirect to login
      if(!firebaseUser) {
        $state.go('login');
        $rootScope.user = null;
      } else {
        // Get profile info from database query and set to rootscope and localStorage
        var userProfileRef = firebaseService.dbRef('users/' + firebaseUser.uid);
        var userObject = $firebaseObject(userProfileRef);
        userObject.$loaded().then(
          function() {
            $rootScope.user = userObject;
            // Create object to send setSession
            var authData = {
              isAdmin: userObject.isAdmin,
              profile: {
                nome: userObject.nome,
                cognome: userObject.cognome,
                email: userObject.email
              }
            }
            fireAuthService.setSession(authData);
            //console.log($rootScope.user);
          }
        );
        //console.log('signed in');
      }
    });
    // Set up Object to collect various admin states **POSSIBLE TODO set states as children**
    const adminRoutes = {
      to: function (state) { if(state.name === 'admin' || state.name === 'adminLinks' || state.name === 'adminQuote' || state.name === 'adminSms') {return true} else {return false} }
    };
    // Set up control for isAdmin in admin routes change
    $transitions.onEnter(adminRoutes, function($transition) {
      var permissions = fireAuthService.checkPermissions();

      // Check for permissions then call server to check user email (for security reasons)
      if(permissions == false) {
        alert('Sembra che tu non disponga dei permessi per accedere a questa pagina. Se sei un amministratore prova a fare logout e rientrare con le tue credenziali.')
        return $state.target("home");
      }
    });
    // Set up error redirect if user is not signed in
    $transitions.onError({}, function(transition) {
      var error = transition.error().detail;
      //console.log(error);
      if (error === "AUTH_REQUIRED") {
        $state.go("login");
        //console.log(error)
      }
    });

    amMoment.changeLocale('it');
    $rootScope.uiColorClass = uiService.getUiColor;
    $rootScope.$watch(
      // This function returns the value being watched. It is called for each turn of the $digest loop
      function() { uiService.getUiColor(); },
      // This is the change listener, called when the value returned from the above function changes
      function(newValue, oldValue) {
        if ( newValue !== oldValue ) {
          // Only increment the counter if the value changed
          $rootScope.uiColorClass = uiService.getUiColor;
        }
      }
    );
  }

})();