(function () {
  'use strict';

  angular
    .module('app')
    .service('uiService', uiService);

    function uiService () {

      var disabledStatus = false;

      function getDisabledStatus() {
        return disabledStatus;
      };
      function setDisabledStatus(newStatus) {
        disabledStatus = newStatus;
      };

      function toggleUiColor() {
        let uiColorSet = JSON.parse(localStorage.getItem('ui_color'));
        uiColorSet = !uiColorSet;
        localStorage.setItem('ui_color', uiColorSet);
      }

      function getUiColor() {
        if (localStorage.getItem('ui_color')) {
          let uiColorSet = JSON.parse(localStorage.getItem('ui_color'));
          return uiColorSet;
        } else {
          var uiColorStatus = false;
          localStorage.setItem('ui_color', uiColorStatus);
          return uiColorStatus;
        }
      }

      return {
        getUiColor: getUiColor,
        toggleUiColor: toggleUiColor,
        getDisabledStatus: getDisabledStatus,
        setDisabledStatus: setDisabledStatus
      }
    };

})();