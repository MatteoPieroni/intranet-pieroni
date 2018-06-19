(function () {
  'use strict';

  angular
    .module('app')
    .service('firebaseService', firebaseService);

    function firebaseService () {
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyA7XzDXxEuhPoLwD3l02qcHeLWovVCAH-Y",
        authDomain: "intranet-pieroni.firebaseapp.com",
        databaseURL: "https://intranet-pieroni.firebaseio.com",
        projectId: "intranet-pieroni",
        storageBucket: "intranet-pieroni.appspot.com",
        messagingSenderId: "775811721929"
      };
      function init () {
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        };
      }
      function dbRef(child) {
        return firebase.database().ref(child)
      }
      function dbChild(child) {
        return firebase.database().ref().child(child)
      }
      function dbUpdate(update) {
        return firebase.database().ref().update(update)
      }
      // we could do additional work here too
      return {
        init: init,
        dbRef: dbRef,
        dbChild: dbChild,
        dbUpdate: dbUpdate
      }
    };

})();