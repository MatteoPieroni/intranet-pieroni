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
  private Listeners: Types.TListener[];

  constructor(driver: Types.TDriver, config: Types.IConfig) {
    this.Driver = new driver(gmaps, config);
    this.Driver.subscribe(this.listenToChanges);
    this.Listeners = [];
  }

  public initialise: () => void = () => {
    this.Driver.initAutocomplete();
    this.Driver.initMap();
  }

  private listenToChanges: (data: Types.TCurrent) => void = (data) => this.Listeners.forEach(listener => listener(data));

  public subscribe: (listener: Types.TListener) => void = (listener) => this.Listeners = [...this.Listeners, listener];

  public unsubscribe: (listener: Types.TListener) => void = (listener) => this.Listeners = [...this.Listeners].filter(inListener => inListener.toString() === listener.toString());
}
