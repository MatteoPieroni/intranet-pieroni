(function() {
  
  'use strict';
  
  angular
    .module('app')
    .directive('navbar', navbar)
    .controller('NavbarController', navbarController);
    
  function navbar() {
    return {
      templateUrl: 'app/navbar/navbar.html',
      controller: navbarController,
      controllerAs: 'vm'
    }
  }

  navbarController.$inject = ['$state', '$rootScope', '$scope', '$timeout', 'navbarService', '$log', '$firebaseAuth', 'fireAuthService'];
    
  function navbarController($state, $rootScope, $scope, $timeout, navbarService, $log, $firebaseAuth, fireAuthService) {
    var vm = this;
    // Set for links
    $scope.state = $state;
    $scope.authObj = $firebaseAuth();

    // Check if sidebar is open
    $scope.isSidebarOpen = navbarService.getStatus;
    // Init sidebar as closed
    navbarService.init();

    // Function for logging out
    $scope.fireLogout = function() {
      fireAuthService.removeSession();
      $scope.authObj.$signOut();
    }
  };
})();