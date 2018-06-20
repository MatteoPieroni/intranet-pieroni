(function () {

  'use strict';

  angular
    .module('app')
    .service('lockService', lockService);

  lockService.$inject = ['$window','$state', 'angularAuth0', '$timeout', 'lock', 'firebaseService'];

  function lockService($window, $state, angularAuth0, $timeout, lock, firebaseService) {

    function login() {
      lock.show()
    };
    
    function handleAuthentication(cb) {

      lock.interceptHash();

      lock.on('authenticated', function(authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          setSession(authResult);
          cb();
          /*$state.reload('home').then(function() {
            cb();
          });*/
          $state.transitionTo('home', {}, { reload: true, inherit: false, notify: true });
        } else if (err) {
          $timeout(function() {
            $state.go('home');
          });
          console.log(err);
          alert('Error: ' + err.error + '. Check the console for further details.');
        }
          //localStorage.setItem('accessToken', authResult.accessToken);
      });
    }

    function setSession(authResult) {
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      var scopes = authResult.scope || REQUESTED_SCOPES || '';
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('scopes', JSON.stringify(scopes));
      localStorage.setItem('expires_at', expiresAt);
    }
    
    function logout() {
      // Remove tokens and expiry time from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      localStorage.removeItem('scopes');
      localStorage.removeItem('profile');
      $window.location.href = '/';
    }
    
    function isAuthenticated() {
      // Check whether the current time is past the 
      // access token's expiry time
      let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }

    function userHasScopes(scopes) {
      var grantedScopes = JSON.parse(localStorage.getItem('scopes')).split(' ');
      for (var i = 0; i < scopes.length; i++) {
        if (grantedScopes.indexOf(scopes[i]) < 0) {
          return false;
        }
      }
      return true;
    }
    var userProfile;

    function getProfile() {
      var accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access Token must exist to fetch profile');
      }
      lock.getUserInfo(accessToken, function(error, profile) {
        if (!error) {
          alert("hello " + profile.name);
          localStorage.setItem('profile', JSON.stringify(profile));
        } else {
          console.log("Error fetching profile")
        }
      });
    }

    function setUserProfile(profile) {
      userProfile = profile;
    }

    function getCachedProfile() {
      return userProfile;
    }

    return {
      login: login,
      handleAuthentication: handleAuthentication,
      logout: logout,
      isAuthenticated: isAuthenticated,
      userHasScopes: userHasScopes,
      getProfile: getProfile,
      getCachedProfile: getCachedProfile
    }
  }
})();
