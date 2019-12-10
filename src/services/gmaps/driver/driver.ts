import * as Types from './types';
import { costFinder, mToKm, sToMin } from '../../../utils/formatMeasures';

const Driver = class {
  private config: Types.IConfig;
  private GeocoderService: Types.TGeocoder;
  private DistanceMatrixService: Types.TDistanceMatrixService;
  private BoundsService: Types.TBounds;
  private AutocompleteService: Types.TAutocompleteService;
  private Autocomplete: Types.TAutocomplete;
  private MapService: Types.TMapService;
  private Map: Types.TMap;
  private UnitSystem: Types.TUnitSystem;
  private MarkerService: Types.TMarker;
  private Animation: Types.TAnimation;
  private Current: Types.TCurrent;

  constructor(mapsService: Types.TMaps, config: Types.IConfig) {
    this.config = config;
    this.GeocoderService = new mapsService.Geocoder;
    this.DistanceMatrixService = new mapsService.DistanceMatrixService;
    this.BoundsService = new mapsService.LatLngBounds;
    this.AutocompleteService = mapsService.places.Autocomplete;
    this.MapService = mapsService.Map;
    this.MarkerService = mapsService.Marker;
    this.UnitSystem = mapsService.UnitSystem.METRIC;
    this.Animation = mapsService.Animation;

    this.Current = {
      origins: [
        ...this.config.origins
      ],
      currentMarkers: []
    }
  }

  public initAutocomplete: () => void = () => {
    const { autocomplete: { div, settings } } = this.config;

    this.Autocomplete = new this.AutocompleteService((document.getElementById(div)), settings);
    this.Autocomplete.addListener('place_changed', this.placeSelection)
  }

  public initMap: () => void = () => {
    const { div, mapConfig } = this.config;

    this.Map = new this.MapService(document.getElementById(div), mapConfig);
  }

  private geocodePromise: (place: Types.IGeocodePromise) => Promise<Types.IGeocodeResults[]> = (place) => {
    return new Promise((resolve, reject) => {
      this.GeocoderService.geocode(place, (results, status) => {
        if (status !== 'OK') {
          reject('There has been an error');
        } else {
          resolve(results);
        }
      });
    });
  }

  private getDistanceMatrixPromise: (distanceObject: Types.IDistanceObject) => Promise<Types.IDistanceMatrixResults> = (distanceObject) => {
    return new Promise((resolve, reject) => {
      console.log(distanceObject)
      this.DistanceMatrixService.getDistanceMatrix(distanceObject, (response, status) => {
        if (status !== 'OK') {
          reject(status);
        } else {
          console.log(response);
          resolve(response);
        }
      });
    });
  }

  // this function returns the callback passed to geocoder binding the icon for the result
  private showGeocodedAddressOnMap: (address: Types.IGeocodePromise, asDestination: boolean, fastest?: boolean) => Promise<void> = async (address, asDestination, fastest) => {
    const { icons: { destination, origin, faster } } = this.config;
    const { currentMarkers } = this.Current;

    const icon = asDestination ? destination : fastest ? faster : origin;

    try {
      const results = await this.geocodePromise(address);

      this.Map.fitBounds(this.BoundsService.extend(results[0].geometry.location));
      this.Current = {
        ...this.Current,
        // push the markers in place, we want an animation for the quicker route
        currentMarkers: [
          ...currentMarkers,
          new this.MarkerService({
            map: this.Map,
            position: results[0].geometry.location,
            icon: icon,
            ...(fastest && { animation: this.Animation.DROP })
          })
        ]
      }

    } catch (e) {
      console.log(e);
    }
  };

  private setDistances: (distanceMatrix: Types.IDistanceMatrixResults) => void = async (distanceMatrix) => {
    const { originAddresses, destinationAddresses, rows } = distanceMatrix;
    const { origins } = this.Current;

    console.log('set distances', distanceMatrix)

    // deleteMarkers(markersArray);

    // Geocode all addresses from origins
    originAddresses.forEach(async address => {
      await this.showGeocodedAddressOnMap(
        {
          'address': address,
        },
        false,
      );
    })

    // Geocode all addresses from destination
    destinationAddresses.forEach(async address => {
      await this.showGeocodedAddressOnMap(
        {
          'address': address
        },
        true,
      );
    })

    const calculatedRoutes = rows.map(({ elements }, i): Types.IRoute => {
      // gmaps returns the value in seconds
      const duration = Math.floor(sToMin(elements[0].duration.value));
      // gmaps returns the value in metres
      const km = Math.floor(mToKm(elements[0].distance.value));
      const cost = this.calculateCost(duration);

      return ({
        name: origins[i].name,
        address: originAddresses[i],
        duration,
        km,
        cost,
      })
    });

    this.Current = {
      ...this.Current,
      routes: calculatedRoutes,
    };
  }

  private calculateQuickestRoute: () => Types.IRoute = () => {
    const { routes } = this.Current;

    // we set the aggregator to equal the route on the first run
    // then we compare the duration for each route with the existing one
    // and swap if the new one if faster 
    return routes.reduce((quickest, route) => quickest ? (quickest.duration <= route.duration ? quickest : route) : route, null)
  }

  private calculateCost: (routeKm: number) => string = (routeKm) => {
    const minimumCost = '40.00';
    // Find Cost
    const cost = costFinder(routeKm);
    // total or minimum
    return parseFloat(minimumCost) <= parseFloat(cost) ? cost : minimumCost;
  }

  public placeSelection: () => Promise<void> = async () => {
    const place = this.Autocomplete.getPlace();
    //console.log(place)
    const { geometry: { location }, formatted_address: destinationName } = place;
    const { distanceMatrixOptions } = this.config;
    const { origins } = this.Current;
    const originsNames = origins.map(origin => origin.name);

    // Define Object for firebase Db
    // let placeToDb = {
    //   // add time to fix retrieval in db in descending order
    //   time: new Date().valueOf() * -1,
    //   user: $rootScope.user.nome + ' ' + $rootScope.user.cognome,
    //   formatted_address: place.formatted_address
    // };

    // // Insert searched place in Firebase db
    // let newLinkKey = firebaseService.addChild('places');
    // let updates = {};
    // updates['/places/' + newLinkKey] = placeToDb;
    // firebaseService.dbUpdate(updates);
    // get distances
    const distanceMatrix = await this.getDistanceMatrixPromise({
      origins: originsNames,
      destinations: [location],
      ...distanceMatrixOptions,
      unitSystem: this.UnitSystem,
    });
    // show distances on map and set to state
    this.setDistances(distanceMatrix);

    // get quickest route
    const quickestRoute = this.calculateQuickestRoute();
    try {
      await this.showGeocodedAddressOnMap({ address: quickestRoute.address }, false, true)
    } catch (e) {
      console.log(e);
    }
    // get total
    this.Current = {
      ...this.Current,
      cost: this.calculateCost(quickestRoute.km),
    };

    console.log(this.Current)
  }

};

export { Driver };
