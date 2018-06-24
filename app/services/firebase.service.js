(function () { 
  'use strict'; 
 
  angular 
    .module('app') 
    .service('firebaseService', firebaseService); 
 
    function firebaseService () {
      function dbRef(child) { 
        return firebase.database().ref(child) 
      } 
      function dbChild(child) { 
        return firebase.database().ref().child(child) 
      } 
      function dbUpdate(update) { 
        return firebase.database().ref().update(update) 
      }
      function addChild(parent) {
        return firebase.database().ref().child(parent).push().key;
      }
      function getChildBy$Id(ID, parent) {
        dbRef(parent).orderByChild("$id").equalTo(ID)
      }
      function updateById(ID, parent, newData) {
        dbRef(parent).orderByChild("id").equalTo(ID).on("child_added", function (snapshot) {
            var itemRef = firebase.database().ref(parent + snapshot.key);
            itemRef.update(newData);
        });
      }
      function removeById(ID, parent) {
        dbRef(parent).orderByChild("id").equalTo(ID).on("child_added", function (snapshot) {
            var itemRef = firebase.database().ref(parent + snapshot.key);
            itemRef.remove();
        });
      }
      function removeByUrl(url, parent, cb) {
        dbRef(parent).orderByChild("url").equalTo(url).on("child_added", function (snapshot) {
            var itemRef = firebase.database().ref(parent + snapshot.key);
            itemRef.remove().then(
              cb()
            ).catch(function(error) {
              alert('C\'è stato un problema con la rimozione dell\'immagine. Prova ancora o contatta l\'amministratore. Errore:' + error);
            });
        });
      }
      // we could do additional work here too 
      return {
        dbRef: dbRef,
        dbChild: dbChild, 
        dbUpdate: dbUpdate,
        addChild: addChild,
        getChildBy$Id: getChildBy$Id,
        updateById: updateById,
        removeById: removeById,
        removeByUrl: removeByUrl
      } 
    };  
})();