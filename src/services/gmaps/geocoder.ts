import * as Types from './driver/types';

// Config Object
export const config = {
  origins: [
    {
      name: 'Pieroni srl, Diecimo, Lucca',
      text: 'Diecimo'
    },
    {
      name: 'Pieroni srl, Fornaci di Barga, Lucca',
      text: 'Fornaci'
    },
    {
      name: 'Pieroni srl, via della Canovetta, Lucca',
      text: 'Lucca'
    }
  ],
  distanceMatrixOptions: {
    travelMode: 'DRIVING',
    avoidHighways: false,
    avoidTolls: false
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

const gmaps = window.google && window.google.maps;

if (!gmaps) {
  throw new Error('Qualcosa non va con Google Maps');
}

export const TransportCost = class {
  private Driver: Types.TDriver;

  constructor(driver: Types.TDriver, config: Types.IConfig) {
    this.Driver = new driver(gmaps, config);
  }

  initialise: () => void = () => {
    this.Driver.initAutocomplete();
    this.Driver.initMap();
  }
}
