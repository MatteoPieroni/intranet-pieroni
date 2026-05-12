import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import Zod from "zod";

import { Location } from "../transportCost";
import { mToKm, msToMin } from "@/utils/formatMeasures";
import {
	DestinationIcon,
	FastestIcon,
	SlowestIcon,
} from "@/components/icons/map";

const DestinationSchema = Zod.object({
	resourceName: Zod.string(),
	formattedAddress: Zod.string(),
	location: Zod.object({
		lat: Zod.number(),
		lng: Zod.number(),
	}),
});

let isMapsInitialised = false;

export class InputDriver {
	constructor() {}

	init = async (
		container: HTMLElement,
		listener: (destination: Location) => void,
	) => {
		if (!isMapsInitialised) {
			setOptions({ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS });
			isMapsInitialised = true;
		}

		// @ts-expect-error
		const { PlaceAutocompleteElement } = await importLibrary("places");

		const autocompleteElement = new PlaceAutocompleteElement({
			includedRegionCodes: ["it"],
		});

		container.appendChild(autocompleteElement);

		autocompleteElement.addEventListener(
			"gmp-select",
			async (
				event: google.maps.places.PlaceAutocompleteElementEventMap["gmp-select"],
			) => {
				const data = await this.placeSelected(event);
				listener(data);
			},
		);
	};

	placeSelected = async (
		event: google.maps.places.PlacePredictionSelectEvent,
	) => {
		const { placePrediction } = event;
		const place = placePrediction.toPlace();

		const placeData = await place.fetchFields({
			fields: ["formattedAddress", "location"],
		});
		const destination = await placeData.place.toJSON();

		const parsed = DestinationSchema.parse(destination);

		return {
			id: parsed.resourceName,
			name: parsed.formattedAddress,
			address: parsed.formattedAddress,
			coordinates: {
				latitude: parsed.location.lat,
				longitude: parsed.location.lng,
			},
		};
	};
}

export type MapConfig = {
	center: { latitude: number; longitude: number };
	zoom: number;
	mapId: string;
};

const markersConfig = {
	default: {
		icon: SlowestIcon,
		className: ["map-marker"],
		title: "Piu lento",
	},
	fastest: {
		icon: FastestIcon,
		className: ["fastest", "map-marker"],
		title: "Piu veloce",
	},
	destination: {
		icon: DestinationIcon,
		className: ["destination", "map-marker"],
		title: "Destinazione",
	},
};

export class MapDriver {
	private map: google.maps.Map | undefined = undefined;
	private config: MapConfig | undefined;
	private orderedOrigins: Location[] = [];
	private destination: Location | undefined;
	private markers: google.maps.marker.AdvancedMarkerElement[] = [];
	private line: google.maps.Polyline | undefined = undefined;

	constructor() {}

	public async init(container: HTMLElement, config: MapConfig) {
		if (!isMapsInitialised) {
			setOptions({ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS });
			isMapsInitialised = true;
		}

		this.config = config;

		const { Map } = await importLibrary("maps");

		this.map = new Map(container, {
			center: {
				lat: this.config.center.latitude,
				lng: this.config.center.longitude,
			},
			zoom: this.config.zoom,
			mapId: this.config.mapId,
		});
	}

	public async calculateDistances({
		origins,
		destination,
	}: {
		origins: Location[];
		destination: Location;
	}) {
		this.destination = destination;

		const { RouteMatrix } = await google.maps.importLibrary("routes");

		const request: google.maps.routes.ComputeRouteMatrixRequest = {
			origins: origins.map((o) => ({
				lat: o.coordinates.latitude,
				lng: o.coordinates.longitude,
			})),
			destinations: [
				{
					lat: destination.coordinates.latitude,
					lng: destination.coordinates.longitude,
				},
			],
			travelMode: "DRIVING",
			units: google.maps.UnitSystem.METRIC,
			fields: ["distanceMeters", "durationMillis"],
		};

		const { matrix } = await RouteMatrix.computeRouteMatrix(request);

		const calculatedRoutes = matrix.rows.map((row, i) => {
			if (!row.items[0].durationMillis || !row.items[0].distanceMeters) {
				throw new Error("No duration or distance");
			}

			// gmaps returns the value in milliseconds
			const duration = Math.ceil(msToMin(row.items[0].durationMillis));
			// gmaps returns the value in metres
			const km = Math.floor(mToKm(row.items[0].distanceMeters));

			return {
				id: origins[i].id,
				duration,
				km,
			};
		});

		const orderedRoutes = calculatedRoutes.sort(
			(a, b) => a.duration - b.duration,
		);

		this.orderedOrigins = orderedRoutes
			.map((route) => origins.find((o) => o.id === route.id))
			.filter((o): o is Location => o !== undefined);

		this.paint();

		return orderedRoutes;
	}

	private paint = async () => {
		this.clearMap();

		if (!this.destination || !this.orderedOrigins.length || !this.map) {
			return;
		}

		const [fastestOrigin, ...restOrigins] = this.orderedOrigins;

		const markers = [];

		for (const origin of restOrigins) {
			const marker = await this.getMarker(origin.coordinates, "default");
			markers.push(marker);
		}

		const fastestMarker = await this.getMarker(
			fastestOrigin.coordinates,
			"fastest",
		);
		markers.push(fastestMarker);

		const destinationMarker = await this.getMarker(
			this.destination.coordinates,
			"destination",
		);
		markers.push(destinationMarker);

		this.markers = markers;

		await this.drawLine();
		await this.extendBounds();
	};

	private getMarker = async (
		address: {
			latitude: number;
			longitude: number;
		},
		type: "default" | "fastest" | "destination",
	) => {
		const { AdvancedMarkerElement } = await importLibrary("marker");

		const icon = markersConfig[type].icon;
		const classNames = markersConfig[type].className;
		const title = markersConfig[type].title;

		const parser = new DOMParser();

		// A marker with a custom inline SVG.
		const pinSvg = parser.parseFromString(
			icon,
			"image/svg+xml",
		).documentElement;
		pinSvg.classList.add(...classNames);

		const marker = new AdvancedMarkerElement({
			map: this.map,
			position: { lat: address.latitude, lng: address.longitude },
			title,
			anchorLeft: "-50%",
			anchorTop: "-50%",
		});
		marker.append(pinSvg);

		return marker;
	};

	private clearMap: () => void = () => {
		this.markers.forEach((marker) => {
			marker.map = null;
		});
		this.markers = [];

		if (this.line) {
			this.line.setMap(null);
			this.line = undefined;
		}
	};

	private extendBounds = async () => {
		if (!this.destination || !this.orderedOrigins.length || !this.map) {
			return;
		}

		const { LatLngBounds } = await importLibrary("core");

		const bounds = new LatLngBounds();
		for (const position of [...this.orderedOrigins, this.destination]) {
			this.map.fitBounds(
				bounds.extend({
					lat: position.coordinates.latitude,
					lng: position.coordinates.longitude,
				}),
				60,
			);
		}
	};

	private drawLine = async () => {
		if (!this.map || !this.orderedOrigins.length || !this.destination) {
			return;
		}

		const { Polyline } = await importLibrary("maps");

		const [fastestOrigin] = this.orderedOrigins;

		const path = new Polyline({
			map: this.map,
			// TODO: switch to lat, lng
			path: [
				{
					lat: fastestOrigin.coordinates.latitude,
					lng: fastestOrigin.coordinates.longitude,
				},
				{
					lat: this.destination.coordinates.latitude,
					lng: this.destination.coordinates.longitude,
				},
			],
			strokeColor: "#1e9542",
			strokeOpacity: 1.0,
			strokeWeight: 2,
		});

		this.line = path;
	};
}
