import React from "react";
import { Worker, Viewer, LocalizationMap } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Global, css } from "@emotion/core";

import { useStorageFile } from "../../shared/hooks";
import { Loader } from "../loader";
import { Modal } from "../modal";

import itIT from './it_IT.json';
import { IModalProps } from "../modal/modal";

interface IPdfViewerProps {
	url: string;
}

const modalCss = css`
	.pdf-viewer-modal {
    top: 2rem;
    left: 5vw;
		padding: 0;
		width: 90vw;
    height: calc(100vh - 4rem);
    transform: none;
    overflow: hidden;
	}
`;

export const PdfViewer: React.FC<IPdfViewerProps & Partial<IModalProps>> = ({ url, closeModal }) => {
	const props = useStorageFile(url);

	// Create new plugin instance
	const defaultLayoutPluginInstance = defaultLayoutPlugin();

	return (
		<>
			<Global styles={modalCss} />
			<Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.min.js">
				<Modal isOpen={!!url} closeModal={closeModal} className="pdf-viewer-modal">
					{!props ? (
						<Loader />
					) : (
							<Viewer
								localization={(itIT as unknown) as LocalizationMap}
								plugins={[
										defaultLayoutPluginInstance,
								]}
								{...props}
							/>
					)}
				</Modal>
			</Worker>
		</>
	);
}