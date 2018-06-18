(function() {
  
  'use strict';
  
  angular
    .module('app')
    .directive('toolbar', toolbar)
    .controller('ToolbarController', toolbarController);
    
  function toolbar() {
    return {
      templateUrl: 'app/navbar/toolbar.html',
      controller: toolbarController,
      controllerAs: 'vm'
    }
  }

  toolbarController.$inject = ['$state', 'lockService', '$scope', '$timeout', 'navbarService'];
    
  function toolbarController($state, lockService, $scope, $timeout, navbarService) {
    var vm = this;
    $scope.state = $state;
    $scope.lock = lockService;

    $scope.isSidebarOpen = navbarService.getStatus;
    $scope.openSidenav = navbarService.open;
    $scope.closeSidenav = navbarService.close;
  };
})();