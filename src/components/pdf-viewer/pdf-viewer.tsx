import React from "react";
import { Global, css } from "@emotion/core";

import { useStorageFile } from "../../shared/hooks";
import { Loader } from "../loader";
import { Modal } from "../modal";

import { IModalProps } from "../modal/modal";
import { ErrorBoundary } from "../error-boundary/error-boundary";
import { ViewerWithFixedError } from "./viewer-with-fixed-error";

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

	return (
		<>
			<Global styles={modalCss} />
			<Modal isOpen={!!url} closeModal={closeModal} className="pdf-viewer-modal">
				{!props ? (
					<Loader />
				) : (
					<ErrorBoundary>
						<ViewerWithFixedError {...props} />
					</ErrorBoundary>
				)}
			</Modal>
		</>
	);
}