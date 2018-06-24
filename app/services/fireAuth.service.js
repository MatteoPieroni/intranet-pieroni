(function () {

  'use strict';

  angular
    .module('app')
    .service('fireAuthService', fireAuthService);

  fireAuthService.$inject = ['$window', '$http', '$state'];

  function fireAuthService($window, $http, $state) {

    function setSession(authResult) {
      // Set items for fast retrieving
      localStorage.setItem('isAdmin', authResult.isAdmin);
      localStorage.setItem('profile', JSON.stringify(authResult.profile));
    }
    
    function removeSession() {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('profile');
    }

    function checkPermissions(email) {
      var isAdmin = localStorage.getItem('isAdmin');
      // If isAdmin = true we call the server to see if the email corresponds to the administrators (SECURITY)
      if(isAdmin === 'true') {
          $http.post('/permissionsapi', email).then(
          function(response) {
            if(response === 'PERMITTED') {
              return true;
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
    };

    return {
      setSession: setSession,
      removeSession: removeSession,
      checkPermissions: checkPermissions
    }
  }
})();
