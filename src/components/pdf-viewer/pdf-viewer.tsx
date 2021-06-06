import React from "react";
import { Global, css } from "@emotion/core";

import { useConfig, useStorageFile } from "../../shared/hooks";
import { Loader } from "../loader";
import { Modal } from "../modal";

import { IModalProps } from "../modal/modal";
import { ErrorBoundary } from "../error-boundary/error-boundary";
import { ViewerWithFixedError } from "./viewer-with-fixed-error";
import { IFile } from "../../services/firebase/db";
import { IEnrichedFile } from "../../utils/file-system";

interface IPdfViewerProps {
	file: IFile | IEnrichedFile;
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

export const PdfViewer: React.FC<IPdfViewerProps & Partial<IModalProps>> = ({ file, closeModal }) => {
	const { isInternal, apiUrl } = useConfig();
	const shownUrl = isInternal ? `${apiUrl}/file/${file.filename}` : file.storeUrl;
	const props = useStorageFile(shownUrl);

	return (
		<>
			<Global styles={modalCss} />
			<Modal isOpen={!!shownUrl} closeModal={closeModal} className="pdf-viewer-modal">
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