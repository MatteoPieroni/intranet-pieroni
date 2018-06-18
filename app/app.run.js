(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['$rootScope', 'lockService', 'amMoment', 'firebaseService'];
    
  function run($rootScope, lockService, amMoment, firebaseService) {
    //authService.handleAuthentication();
    lockService.handleAuthentication(firebaseService.init);
    amMoment.changeLocale('it');
  }

})();