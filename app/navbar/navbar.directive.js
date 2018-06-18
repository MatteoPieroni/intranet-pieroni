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

  navbarController.$inject = ['$state', 'lockService', '$scope', '$timeout', 'navbarService', '$log'];
    
  function navbarController($state, lockService, $scope, $timeout, navbarService, $log) {
    var vm = this;
    $scope.state = $state;
    $scope.lock = lockService;
    $scope.isSidebarOpen = navbarService.getStatus;
    navbarService.init();
  };
})();