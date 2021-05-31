import React, { useEffect, useState } from "react";
import { Worker, Viewer, LocalizationMap, ViewerProps } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import { ErrorViewer } from "./error-viewer";

import itIT from './it_IT.json';

export const ViewerWithFixedError: React.FC<ViewerProps> = (props) => {
	const [_, throwReactChatchableError] = useState('');

	// Create new plugin instance
	const defaultLayoutPluginInstance = defaultLayoutPlugin();

	useEffect(() => {
		const originalRejectionHandler = window.onunhandledrejection;

		const throwError = (event: PromiseRejectionEvent): void => {
			throwReactChatchableError(() => {
				throw new Error('Error in promise')
			});
		};

		window.onunhandledrejection = throwError;

		return (): void => {
			window.onunhandledrejection = originalRejectionHandler;
		}
	}, [])

	return (
		<Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.min.js">
			<Viewer
				localization={(itIT as unknown) as LocalizationMap}
				plugins={[
						defaultLayoutPluginInstance,
				]}
				onDocumentLoad={console.log}
				renderError={ErrorViewer}
				{...props}
			/>
		</Worker>
	);
}