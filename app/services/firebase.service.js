(function () {
  'use strict';

  angular
    .module('app')
    .service('firebaseService', firebaseService);

    function firebaseService () {
      function init () {
        // Initialize Firebase
        if (!firebase.apps.length) {
          var config = {
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: ""
          };
          firebase.initializeApp(config);
        }
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
