(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['$rootScope', 'lockService', 'amMoment', 'firebaseService', 'uiService'];
    
  function run($rootScope, lockService, amMoment, firebaseService, uiService) {
    //authService.handleAuthentication();
    lockService.handleAuthentication(firebaseService.init);
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