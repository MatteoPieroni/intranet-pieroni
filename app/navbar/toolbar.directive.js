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
      controllerAs: 'vm',
      resolve: {
        // controller will not be loaded until $requireSignIn resolves
        // Auth refers to our $firebaseAuth wrapper in the factory below
        "currentAuth": ["Auth", function(Auth) {
          // $requireSignIn returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireSignIn();
        }]
      }
    }
  }

  toolbarController.$inject = ['$state', '$scope', '$rootScope', '$timeout', 'navbarService', 'uiService'];
    
  function toolbarController($state, $scope, $rootScope, $timeout, navbarService, uiService) {
    var vm = this;
    // Set for links in toolbar
    $scope.state = $state;

    // Watch for user to be inserted in $rootScope and set for UI show
    $scope.firebaseUser = $rootScope.user;
    $rootScope.$watch(
      // This function returns the value being watched. It is called for each turn of the $digest loop
      'user',
      // This is the change listener, called when the value returned from the above function changes
      function(newValue, oldValue, scope) {
        if ( newValue !== oldValue ) {
          // Only increment the counter if the value changed
          $scope.firebaseUser = $rootScope.user;
        }
      }, false
    );

    /*var logos = {
      true: 'https://firebasestorage.googleapis.com/v0/b/intranet-pieroni.appspot.com/o/logo%2Flogo-bianco-nero.png?alt=media&token=e9cdbc53-3fda-4d10-b415-d0ef8ac48aaa',
      false: 'https://firebasestorage.googleapis.com/v0/b/intranet-pieroni.appspot.com/o/logo%2Flogo-colore.png?alt=media&token=1c9372cf-adaf-4c93-bbf1-f99dbdf1d467'
    }
    // Logo init before watching for changes
    function logoInit() {
      if($scope.uiColorStatus === false) {
        $scope.logo = logos.false;
      } else if ($scope.uiColorStatus === true) {
        $scope.logo = logos.true;
      }
    }
    logoInit();*/ // DISCARDED FOR FLASHING RENDERING REASONS

    // Enable dark UI
    $scope.uiColorToggler = uiService.toggleUiColor;
    $scope.uiColorStatus = uiService.getUiColor();

    /*$scope.$watch(
      // This function returns the value being watched. It is called for each turn of the $digest loop
      'uiColorStatus',
      // This is the change listener, called when the value returned from the above function changes
      function(newValue, oldValue, scope) {
        if ( newValue !== oldValue ) {
          // Only increment the counter if the value changed
          if($scope.uiColorStatus === false) {
            $scope.logo = logos.false;
          } else if ($scope.uiColorStatus === true) {
            $scope.logo = logos.true;
          }
        }
      }, false
    );*/ // DISCARDED FOR FLASHING RENDERING REASONS

    $scope.isSidebarOpen = navbarService.getStatus;
    $scope.openSidenav = navbarService.open;
    $scope.closeSidenav = navbarService.close;
  };
})();