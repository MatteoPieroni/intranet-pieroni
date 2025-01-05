import * as Types from './types';
import { mToKm, sToMin } from '../../../utils/formatMeasures';

const Driver = class {
  private config: Types.IConfig;
  private GeocoderService: Types.TGeocoder;
  private DistanceMatrixService: Types.TDistanceMatrixService;
  private BoundsService: Types.TBounds;
  private AutocompleteService: Types.TAutocompleteService;
  private Autocomplete: Types.TAutocomplete | undefined;
  private MapService: Types.TMapService;
  private Map: Types.TMap | undefined;
  private UnitSystem: Types.TUnitSystem;
  private MarkerService: Types.TMarker;
  private Animation: Types.TAnimation;
  private Current: Types.TCurrent;
  private Listeners: Types.TListener[];

  constructor(mapsService: Types.TMaps, config: Types.IConfig) {
    this.config = config;
    this.GeocoderService = new mapsService.Geocoder();
    this.DistanceMatrixService = new mapsService.DistanceMatrixService();
    this.BoundsService = new mapsService.LatLngBounds();
    this.AutocompleteService = mapsService.places.Autocomplete;
    this.MapService = mapsService.Map;
    this.MarkerService = mapsService.Marker;
    this.UnitSystem = mapsService.UnitSystem.METRIC;
    this.Animation = mapsService.Animation;
    this.Listeners = [];

    this.Current = {
      origins: [...this.config.origins],
      routes: [],
      currentMarkers: [],
    };
  }

  public initAutocomplete: () => void = () => {
    const {
      autocomplete: { div, settings },
    } = this.config;

    this.Autocomplete = new this.AutocompleteService(
      document.getElementById(div),
      settings
    );
    this.Autocomplete?.addListener('place_changed', this.placeSelection);
  };

  public initMap: () => void = () => {
    const { div, mapConfig } = this.config;

    this.Map = new this.MapService(document.getElementById(div), mapConfig);
  };

  public subscribe: (listener: Types.TListener) => void = (listener) =>
    (this.Listeners = [...this.Listeners, listener]);

  private dispatch: () => void = () =>
    this.Listeners.forEach((listener) => listener(this.Current));

  private geocodePromise: (
    place: Types.IGeocodePromise
  ) => Promise<Types.IGeocodeResults[]> = (place) => {
    return new Promise((resolve, reject) => {
      this.GeocoderService.geocode(place, (results, status) => {
        if (status !== 'OK') {
          reject('There has been an error');
        } else {
          resolve(results);
        }
      });
    });
  };

  private getDistanceMatrixPromise: (
    distanceObject: Types.IDistanceObject
  ) => Promise<Types.IDistanceMatrixResults> = (distanceObject) => {
    return new Promise((resolve, reject) => {
      this.DistanceMatrixService.getDistanceMatrix(
        distanceObject,
        (response, status) => {
          if (status !== 'OK') {
            reject(status);
          } else {
            resolve(response);
          }
        }
      );
    });
  };

  private showGeocodedAddressOnMap: (
    address: Types.IGeocodePromise,
    asDestination: boolean,
    fastest?: boolean
  ) => Promise<void> = async (address, asDestination, fastest) => {
    const {
      icons: { destination, origin, faster },
    } = this.config;
    const { currentMarkers } = this.Current;

    const icon = asDestination ? destination : fastest ? faster : origin;

    try {
      const results = await this.geocodePromise(address);

      this.Map?.fitBounds(
        this.BoundsService.extend(results[0].geometry.location)
      );
      this.Current = {
        ...this.Current,
        // push the markers in place, we want an animation for the quicker route
        currentMarkers: [
          ...currentMarkers,
          new this.MarkerService({
            map: this.Map,
            position: results[0].geometry.location,
            icon: icon,
            ...(fastest && { animation: this.Animation.DROP }),
          }),
        ],
      };
    } catch (e) {
      console.error(e);
    }
  };

  private clearMarkers: () => void = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.Current.currentMarkers.forEach((marker: any) => marker.setMap(null));
    this.Current.currentMarkers = [];
  };

  private setDistances: (distanceMatrix: Types.IDistanceMatrixResults) => void =
    async (distanceMatrix) => {
      const { originAddresses, destinationAddresses, rows } = distanceMatrix;
      const { origins } = this.Current;

      this.clearMarkers();

      // Geocode all addresses from origins
      originAddresses.forEach(async (address) => {
        await this.showGeocodedAddressOnMap(
          {
            address: address,
          },
          false
        );
      });

      // Geocode all addresses from destination
      destinationAddresses.forEach(async (address) => {
        await this.showGeocodedAddressOnMap(
          {
            address: address,
          },
          true
        );
      });

      const calculatedRoutes = rows.map(({ elements }, i): Types.IRoute => {
        // gmaps returns the value in seconds
        const duration = Math.floor(sToMin(elements[0].duration.value));
        // gmaps returns the value in metres
        const km = Math.floor(mToKm(elements[0].distance.value));
        const cost = this.calculateCost(duration);

        return {
          name: origins[i].name,
          address: originAddresses[i],
          duration,
          km,
          cost,
        };
      });

      this.Current = {
        ...this.Current,
        routes: calculatedRoutes,
      };
    };

  private calculateQuickestRoute: () => Types.IRoute = () => {
    const { routes } = this.Current;

    if (!routes) {
      throw new Error();
    }

    // we set the aggregator to equal the route on the first run
    // then we compare the duration for each route with the existing one
    // and swap if the new one if faster
    return routes.reduce<Types.IRoute>(
      (quickest, route) =>
        quickest
          ? quickest.duration <= route.duration
            ? quickest
            : route
          : route,
      // TODO: fix reduce types
      null as unknown as Types.IRoute
    );
  };

  private calculateCost: (routeMinutes: number) => string = (routeMinutes) => {
    const { costPerMinute, hourBase, minimumCost } = this.config.costs;

    // if car is 1 minute => truck is 1.5 minutes
    const truckMinutes = routeMinutes * 1.5;

    const costToRun = truckMinutes * costPerMinute;

    // Find Cost
    const cost = costToRun + hourBase;
    // total or minimum
    const resultingCost = minimumCost <= cost ? cost : minimumCost;

    return resultingCost.toFixed(2);
  };

  public placeSelection: () => Promise<void> = async () => {
    const place = this.Autocomplete?.getPlace();
    const {
      geometry: { location },
      formatted_address: destinationName,
    } = place;
    const { distanceMatrixOptions } = this.config;
    const { origins } = this.Current;
    const originsNames = origins.map((origin) => origin.name);

    // set destination
    this.Current = {
      ...this.Current,
      destination: destinationName,
    };

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
      // show the marker for quickest route on the map
      await this.showGeocodedAddressOnMap(
        { address: quickestRoute.address },
        false,
        true
      );
    } catch (e) {
      console.error(e);
    }
    // set total
    this.Current = {
      ...this.Current,
      cost: quickestRoute.cost,
    };

    this.dispatch();
  };
};

export { Driver };
