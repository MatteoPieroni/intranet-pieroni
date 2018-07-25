(function () {

  'use strict';
  angular
    .module('app')
    .controller('AdminSignsController', adminSignsController);

  adminSignsController.$inject = ['currentAuth', '$scope', '$mdDialog'];

  function adminSignsController(currentAuth, $scope, $mdDialog) {
    var vm = this;
    $scope.firebaseUser = currentAuth;

    $scope.loaded = true;

    if($scope.firebaseUser) {
    	$scope.formSigns = {};

    	$scope.showConfirm = function(ev) {
		    var confirm = $mdDialog.confirm()
		          .title('Sicur* di voler stampare?')
		          .textContent('Hai controllato che non ci siano errori nel testo?')
		          .ariaLabel('Conferma il testo!')
		          .targetEvent(ev)
		          .ok('Scarica pure!')
		          .cancel('No, fammi ricontrollare');

		    $mdDialog.show(confirm).then(function() {
		    	console.log($scope.formSigns.text);
		    	printPdf($scope.formSigns.text);
		    }, function() {
		      return null;
		    });
		  };

    	function printPdf(text) {
		    var textWritten = text.toUpperCase();
		    var docDefinition = {
		        pageOrientation: 'landscape',
		        header: {
		            image: 'header.jpg'
		        },
		        footer: {
		            image: 'footer.jpg'
		        },
		        content: [
		            {
		                //text: 'Si comunica alla gentile clientela che rimarremo chiusi il giorno 8 dicembre ',
		                text: textWritten,
		                style: 'communication'
		         }
		   ],

		        styles: {
		            communication: {
		                fontSize: 47,
		                margin: [118, 134, 118, 0],
		                alignment: 'center'
		            }
		        },
		        defaultStyle: {
		            font: 'SourceSans'
		        }
		    };
		    pdfMake.fonts = {
		        SourceSans: {
		            normal: 'SourceSansPro-Black.otf'
		        }
		    };

		    $mdDialog.show(
		      $mdDialog.alert()
		        .clickOutsideToClose(true)
		        .title('Il tuo file sarà scaricato tra poco!')
		        .ariaLabel('Conferma successo')
		        .ok('Grande!')
		    );
		    pdfMake.createPdf(docDefinition).download();
		};

    }
  }
})();