(function () {
  'use strict';

  angular
    .module('app')
    .service('navbarService', navbarService);

    function navbarService () {
      var sidenavStatus;

      function init() {
        sidenavStatus = false;
      }

      function getStatus() {
        return sidenavStatus;
      }

      function open() {
        sidenavStatus = true;
      }

      function close() {
        sidenavStatus = false;
      };

      return {
        getStatus: getStatus,
        init: init,
        open: open,
        close: close
      }
    };

})();