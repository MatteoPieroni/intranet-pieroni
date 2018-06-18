(function() {
  
  'use strict';
  
  angular
    .module('app')
    .directive('upload', upload)
    .directive('customOnChange', customOnChange);
    
  function upload() {
    return {
      templateUrl: 'app/admin/upload/upload.html',
      controller: uploadController,
      controllerAs: 'vm',
      scope: {
        folder: '@'
      }
    }
  }

  function customOnChange() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var onChangeFunc = scope.$eval(attrs.customOnChange);
        element.on('change', onChangeFunc);
        element.on('$destroy', function() {
          element.off();
        });
      }
    }
  }
})();