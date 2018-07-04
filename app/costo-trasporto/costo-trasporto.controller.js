(function () {

    'use strict';

    angular
        .module('app')
        .controller('TransCostController', transCostController);

    transCostController.$inject = ['$scope', '$rootScope', 'currentAuth', 'firebaseService', '$firebaseArray'];

    function transCostController($scope, $rootScope, currentAuth, firebaseService, $firebaseArray) {

        var vm = this;
        $scope.firebaseUser = currentAuth;
        // Set loaded state for UI
        $scope.loaded = false;
        // Get firebase already searched
        var ref = firebaseService.dbRef('places/', 20, 'time');
        $scope.searchedPlaces = $firebaseArray(ref);
        $scope.searchedPlaces.$loaded()
            .then(function() {
                $scope.loaded = true;
            })
            .catch(function(err) {
                $scope.errMessage = err;
            });

        var destinationName;
        var totalCost;
        var nearestName;
        var nearestKm;
        var nearestDistanza;
        var readOriginArray;
        var markersArray = [];
        var distanzaTotale;
        var otherOrigins = [];

        $scope.searched = false;

        // Config Object
        var config = {
            origins: {
                origin1: {
                    name: 'Pieroni srl, Diecimo, Lucca',
                    text: 'Diecimo'
                },
                origin2: { 
                    name: 'Pieroni srl, Fornaci di Barga, Lucca',
                    text: 'Fornaci'
                },
                origin3: {
                    name: 'Pieroni srl, via della Canovetta, Lucca',
                    text: 'Lucca'
                }
            },
            mapConfig: {
                center: {
                    lat: 43.955955,
                    lng: 10.502336
                },
                zoom: 10
            },
            div: 'map',
            autocomplete: {
                div: 'autocomplete',
                settings: {
                    componentRestrictions: {
                        country: 'it'
                    }
                }
            },
            icons: {
                origin: 'assets/origIcon.png',
                destination: 'assets/destIcon.png',
                faster: 'assets/fastestIconWhite.png'
            }
        };

        // Call geocoder from Google Maps Api
        var geocoder = new google.maps.Geocoder;
        // Call distance matrix from Google Maps Api
        var service = new google.maps.DistanceMatrixService;
        var bounds = new google.maps.LatLngBounds;

        // Meters to km function
        function mToKm(meters) {
            return meters / 1000;
        };
        // Seconds to minutes
        function sToMin(seconds) {
            return seconds / 60;
        };
        // Compare cost with a minimum
        function minimumCostFn(total, minimum) {
            if (total >= minimum) {
                return total;
            } else {
                return minimum;
            }
        };
        // Round to even
        function roundEven(toRound) {
            return Math.floor(toRound);
        };
        // defineMinimum finds cost per minute when inputted cost per minute and cost of driver per hour
        function defineMinimum(costiVivi, costoOrarioAutista) {
            return costiVivi + (costoOrarioAutista / 60);
        };
        // Find Cost
        function costFinder(tempo) {
            // cost per minimum is defined at 1.4 and cost per hour is defined at 25
            // OLD ONE
            //return (tempo * 2 * defineMinimum(1.4,25)).toFixed(2);
            return (tempo * 2.14 + 24.6).toFixed(2);
        };
        // Minimum function
        function min(input) {
            if (toString.call(input) !== "[object Array]")
                return false;
            return Math.min.apply(null, input);
        }

        // Set up autocomplete field in UI
        var autocomplete = new google.maps.places.Autocomplete((document.getElementById(config.autocomplete.div)), config.autocomplete.settings);
        function getPlace () {
            return autocomplete.getPlace();
        };
        var showGeocodedAddressOnMap = function (asDestination, mapVar, config) {
            var icon = asDestination ? config.icons.destination : config.icons.origin;
            return function (results, status) {
                if (status === 'OK') {
                    mapVar.fitBounds(bounds.extend(results[0].geometry.location));
                    markersArray.push(new google.maps.Marker({
                        map: mapVar,
                        position: results[0].geometry.location,
                        icon: icon
                    }));
                } else {
                    //alert('C\'è stato un problema! Riprova per favore. Errore: ' + status);
                    return null;
                }
            };
        };

        function autoPlaceSelection(arrayToPass, map, config) {
            var place = autocomplete.getPlace();
            //console.log(place)
            var destinationA = place.geometry.location;
            destinationName = place.formatted_address;
            $scope.destinationName = destinationName;
            // Set searched for UI
            $scope.searched = true;

            // Define Object for firebase Db
            var placeToDb = {
                // add time to fix retrieval in db in descending order
                time: new Date().valueOf() * -1,
                user: $rootScope.user.nome + ' ' + $rootScope.user.cognome,
                formatted_address: place.formatted_address
            };

            // Insert searched place in Firebase db
            var newLinkKey = firebaseService.addChild('places');
            var updates = {};
            updates['/places/' + newLinkKey] = placeToDb;
            firebaseService.dbUpdate(updates);
            //console.log(destinationA);

            // function to scope variables
            function setDistances(res, mp, conf) {
                return distanceMatrixFn(res, mp, conf);
            }
            service.getDistanceMatrix({
                origins: arrayToPass,
                destinations: [destinationA],
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            }, function (response, status) {
                if (status !== 'OK') {
                    alert('Error was: ' + status);
                } else {
                    //console.log(response);
                    return setDistances(response, map, config);
                }
            });
        }

        function placeSelection(arrayToPass, map, config, placeSet) {
            var place = placeSet;
            destinationName = place.formatted_address;
            // Set searched for UI
            $scope.searched = true;
            // Firebase db doesn't accept place as it contains a function therefore we need to recalculate geocoding by the formatted address
            geocoder.geocode({
                        'address': destinationName
                    }, function(results, status) {
                        if(status === 'OK') {
                            for (var i=0; i<results.length; i++) {
                                $scope.destinationName = destinationName;

                                // function to scope variables
                                function setDistances(res, mp, conf) {
                                    return distanceMatrixFn(res, mp, conf);
                                }
                                service.getDistanceMatrix({
                                    origins: arrayToPass,
                                    destinations: [results[i].geometry.location],
                                    travelMode: 'DRIVING',
                                    unitSystem: google.maps.UnitSystem.METRIC,
                                    avoidHighways: false,
                                    avoidTolls: false
                                }, function (response, status) {
                                    if (status !== 'OK') {
                                        alert('Error was: ' + status);
                                    } else {
                                        //console.log(response);
                                        return setDistances(response, map, config);
                                    }
                                });
                            }
                        } else {
                            console.log(status)
                            return null;
                        }
                    })
        }
        $scope.reselect = function(placeClicked) {
            //console.log(placeClicked);
            return placeSelection([config.origins.origin1.name, config.origins.origin2.name, config.origins.origin3.name], $scope.map, $scope.config, placeClicked)
        };

        // Loop through array of objects and find same distance with minimum
        function nearestFn (passedArray, minimumDistance, expectedOutput) {
            otherOrigins = [];
            for (var p = 0; p < passedArray.length; p++) {
                if (passedArray[p].distanza == minimumDistance) {
                    //nearestDiv.innerHTML += distanzeArrayi[p].name;
                    expectedOutput = passedArray[p].name;
                    distanzaTotale = roundEven(sToMin(passedArray[p].distanza));
                    var kmTotali = roundEven(mToKm(passedArray[p].km));
                    geocoder.geocode({
                            'address': passedArray[p].indirizzo
                        },
                        fastestMarker());
                    $scope.nearestName = expectedOutput;
                    $scope.nearestDistanza = distanzaTotale;
                    $scope.nearestKm = kmTotali;
                } else {
                    otherOrigins.push({
                        name: passedArray[p].name,
                        distanza: roundEven(sToMin(passedArray[p].distanza)),
                        km: roundEven(mToKm(passedArray[p].km)),
                        cost: costFinder(sToMin(passedArray[p].distanza))
                    });
                }
            }
            // Function to wait to enable click buttons for recent researches for over quota usage of Geocoding Api
            $scope.waiting = true;
            setTimeout(function() {
                $scope.$apply($scope.waiting = false);
            }, 5000)
            $scope.origins = otherOrigins;
        };



        function distanceMatrixFn(item, map, config) {
            var originList = item.originAddresses;
            var destinationList = item.destinationAddresses;
            deleteMarkers(markersArray);

            
            // array for objects with name and distance
            var distanzeArrayi = [];
            // array with distances only
            var onlyDistanze = [];
            // Geocode all addresses from origins
            for (var i = 0; i < originList.length; i++) {
                var results = item.rows[i].elements;
                geocoder.geocode({
                        'address': originList[i]
                    },
                    showGeocodedAddressOnMap(false, map, config));
                // Geocode all adresses from destinations
                for (var j = 0; j < results.length; j++) {
                    geocoder.geocode({
                            'address': destinationList[j]
                        },
                        showGeocodedAddressOnMap(true, map, config));
                    // Push all infos to array
                    distanzeArrayi.push({
                        name: readOriginArray[i],
                        indirizzo: originList[i],
                        distanza: results[j].duration.value,
                        km: results[j].distance.value
                    });
                    // Push only distances to array
                    onlyDistanze.push(results[j].duration.value);
                    //console.log(distanzeArrayi);
                }

            }
            //console.log(onlyDistanze);
            // Get the smallest distance
            var minimaDistanza = min(onlyDistanze);

            // Get smallest distance in array and nearest name
            nearestFn(distanzeArrayi, minimaDistanza, nearestName);

            // Find Cost
            var minimumCost = 40.00;
            //trova i km
            var cost = costFinder(distanzaTotale);
            totalCost = minimumCostFn(cost, minimumCost);
            $scope.$apply($scope.totalCost = totalCost);
        };


        // custom marker for fastest route
        var fastestMarker = function () {
            var image = config.icons.faster;
            return function (results, status) {
                //console.log(status)
                if (status === 'OK') {
                    markersArray.push(new google.maps.Marker({
                        map: $scope.map,
                        position: results[0].geometry.location,
                        animation: google.maps.Animation.DROP,
                        icon: image
                    }));
                } else {
                    alert('C\'è stato un problema! Riprova per favore. Errore: ' + status);
                    return null;
                }
            };
        };

        // Function for clearing markers on map
        function deleteMarkers(markersArray) {
            for (var i = 0; i < markersArray.length; i++) {
                markersArray[i].setMap(null);
            }
            markersArray = [];
        }

        if($scope.firebaseUser) {
            function initMap(config) {

                readOriginArray = [config.origins.origin1.text, config.origins.origin2.text, config.origins.origin3.text];
                var destinationA;

                var destinationIcon = config.icons.destination;
                var originIcon = config.icons.origin;
                // Create Map
                var map = new google.maps.Map(document.getElementById(config.div), config.mapConfig);
                // Get places from Google Maps Api
                var places = new google.maps.places.PlacesService(map);
                // Set autocomplete function return to pass in variables
                function onPlaceChanged() {
                    return autoPlaceSelection([config.origins.origin1.name, config.origins.origin2.name, config.origins.origin3.name], map, config)
                };
                autocomplete.addListener('place_changed', onPlaceChanged);
                return map;
            }

            setTimeout(function() {
                $scope.map = initMap(config);
                $scope.config = config;
            }, 1000);
        }
    }
})();
