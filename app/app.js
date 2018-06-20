(function () {

  'use strict';

  angular
    .module('app', ['auth0.auth0', 'ui.router', 'ngMaterial', 'ngMessages', 'firebase', 'file-model', 'angularMoment', 'auth0.lock'])
    .config(config);

  config.$inject = [
    '$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    'angularAuth0Provider',
    'lockProvider',
    '$mdDateLocaleProvider'
  ];
  var REQUESTED_SCOPES = 'openid profile read:data write:data';

  function config(
    $stateProvider,
    $locationProvider,
    $urlRouterProvider,
    angularAuth0Provider,
    lockProvider,
    $mdDateLocaleProvider,
    $rootScope
  ) {

    $stateProvider
      .state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'app/login/login.html',
        controllerAs: 'vm'
      })
      .state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'app/home/home.html',
        controllerAs: 'vm'
      })
      .state('sms', {
        url: '/sms',
        controller: 'SmsController',
        templateUrl: 'app/sms/sms.html',
        controllerAs: 'vm'
      })
      .state('callback', {
        url: '/callback',
        controller: 'CallbackController',
        templateUrl: 'app/callback/callback.html',
        controllerAs: 'vm'
      })
      .state('admin', {
        url: '/admin',
        controller: 'AdminController',
        templateUrl: 'app/admin/admin.html',
        controllerAs: 'vm',
        onEnter: checkForScopes(['write:data'])
    })
      .state('adminLinks', {
        url: '/admin/links',
        controller: 'AdminLinksController',
        templateUrl: 'app/admin/links/links.html',
        controllerAs: 'vm',
        onEnter: checkForScopes(['write:data'])
    })
      .state('adminQuote', {
        url: '/admin/quote',
        controller: 'AdminQuoteController',
        templateUrl: 'app/admin/quote/quote.html',
        controllerAs: 'vm',
        onEnter: checkForScopes(['write:data'])
    })
      .state('adminSms', {
        url: '/admin/sms',
        controller: 'AdminSmsController',
        templateUrl: 'app/admin/sms/sms.html',
        controllerAs: 'vm',
        onEnter: checkForScopes(['write:data'])
    });
    lockProvider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN,
      options: {
        allowAutocomplete: true,
        allowShowPassword: true,
        autofocus:true,
        avatar:null,
        container: 'lock-container',
        language: 'it',
        auth: {
          redirect: true,
          redirectUrl: AUTH0_CALLBACK_URL,
          responseType: 'token id_token',
          sso: true,
          params: {
              scope: 'openid profile read:data write:data'
          }
        },
        theme: {
          logo: 'http://www.pieroni.it/wp-content/uploads/2015/05/pieroni_logo_definitivo_V2.png',
          primaryColor: '#ee8900'
        },
        languageDictionary: {
          emailInputPlaceholder: 'miamail@pieroni.it',
          passwordInputPlaceholder: 'La tua password',
          title: 'Benvenuto/a!'
        }
      }
    });
    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN/*,
      responseType: 'token id_token',
      audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
      redirectUri: AUTH0_CALLBACK_URL,
      scope: REQUESTED_SCOPES*/
    });

    $mdDateLocaleProvider.firstDayOfWeek = 1; 
 
    $mdDateLocaleProvider.months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'dicembre']; 
    $mdDateLocaleProvider.shortMonths = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']; 
    $mdDateLocaleProvider.days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']; 
    $mdDateLocaleProvider.shortDays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

    function checkForScopes(scopes) {
      return function checkAuthentication($transition$) {
        var $state = $transition$.router.stateService;
        var auth = $transition$.injector().get('authService');
        if (!auth.isAuthenticated() || !auth.userHasScopes(scopes)) {
          return $state.target('home');
        }
      }
    }

    $urlRouterProvider.otherwise('/');

    $locationProvider.hashPrefix('');

    /// Comment out the line below to run the app
    // without HTML5 mode (will use hashes in routes)
    $locationProvider.html5Mode(true);
  }

})();
