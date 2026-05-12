import { InputDriver, MapConfig, MapDriver } from "./driver/new-driver";

// Config Object
export const mapConfig = {
	origins: [
		{
			name: "Pieroni srl, Diecimo, Lucca",
			address: "Pieroni srl, Diecimo, Lucca",
			id: "Diecimo",
			coordinates: {
				latitude: 43.95545625179135,
				longitude: 10.50189202868833,
			},
		},
		{
			name: "Pieroni srl, via della Canovetta, Lucca",
			address: "Pieroni srl, via della Canovetta, Lucca",
			id: "Lucca",
			coordinates: {
				latitude: 43.86263827514731,
				longitude: 10.521366784508059,
			},
		},
	],
	distanceMatrixOptions: {
		travelMode: "DRIVING",
		avoidHighways: false,
		avoidTolls: false,
	},
	mapConfig: {
		center: {
			latitude: 43.9084255,
			longitude: 10.5158615,
		},
		zoom: 13,
		mapId: "76b18e78ad699c4b99e86c27",
	},
	div: "map",
	autocomplete: {
		div: "autocomplete-container",
		settings: {
			componentRestrictions: {
				country: "it",
			},
		},
	},
};

export type Location = {
	id: string;
	name: string;
	address: string;
	coordinates: {
		latitude: number;
		longitude: number;
	};
};

type Route = {
	name: string;
	km: number;
	duration: number;
	cost: string;
};

export type TransportState = {
	routes: Route[];
	destination: string | undefined;
};

type Listener = () => void;

type Config = {
	mapConfig: MapConfig;
	origins: Location[];
	costs?: CostConfig;
};

type CostConfig = {
	costPerMinute: number;
	hourBase: number;
	minimumCost: number;
};

export const TransportCost = class {
	private InputDriver: InputDriver;
	private MapDriver: MapDriver;
	private Listeners: Listener[];
	private config: Config;
	private State: TransportState = {
		routes: [],
		destination: undefined,
	};

	constructor(
		inputDriver: typeof InputDriver,
		mapDriver: typeof MapDriver,
		config: Config,
	) {
		this.InputDriver = new inputDriver();
		this.MapDriver = new mapDriver();
		this.Listeners = [];
		this.config = config;
	}

	public initialise = (
		inputContainer: HTMLElement,
		mapContainer: HTMLElement,
		costConfig: CostConfig,
	) => {
		this.InputDriver.init(inputContainer, this.onInputLocation);
		this.MapDriver.init(mapContainer, this.config.mapConfig);
		this.config.costs = costConfig;
	};

	private onInputLocation = async (location: Location) => {
		this.State.destination = location.address;
		this.calculateTotalCost(location);
	};

	private calculateTotalCost = async (destination: Location) => {
		const routes = await this.MapDriver.calculateDistances({
			origins: this.config.origins,
			destination,
		});

		const routesWithCost = routes.map((route) => ({
			...route,
			name: this.config.origins.find((o) => o.id === route.id)?.name || "",
			cost: this.calculateCost(route.duration),
		}));
		this.State.routes = routesWithCost;

		this.emit();
	};

	private calculateCost = (routeMinutes: number) => {
		if (!this.config?.costs) {
			throw new Error("Costs not configured");
		}

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

	private emit = () => {
		this.State = { ...this.State };
		this.Listeners.forEach((listener) => listener());
	};

	public getState = () => this.State;

	public subscribe = (listener: Listener) => {
		this.Listeners = [...this.Listeners, listener];
		return () => this.unsubscribe(listener);
	};

	public unsubscribe = (listener: Listener) => {
		this.Listeners = [...this.Listeners].filter(
			(inListener) => inListener.toString() === listener.toString(),
		);
	};
};
