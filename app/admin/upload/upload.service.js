(function () {
  'use strict';

  angular
    .module('app')
    .service('uploadService', uploadService);

    function uploadService () {
      var obj = {};
      var selectedStatus = false;
      function setObj (newObj) {
        obj = newObj;
      };
      function getObj () {
        return obj;
      };
      function getSelectedStatus() {
        return selectedStatus;
      };
      function setSelectedStatus(newStatus) {
        selectedStatus = newStatus;
      };
      // we could do additional work here too
      return {
        setObj: setObj,
        getObj: getObj,
        getSelectedStatus: getSelectedStatus,
        setSelectedStatus: setSelectedStatus
      }
    };

})();