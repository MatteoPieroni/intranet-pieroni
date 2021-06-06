import { css, SerializedStyles } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { ISyncStatuses } from '../../services/catalogues-api/catalogues-service';
import { useEscKey } from '../../shared/hooks';
import { IJob, Queue } from '../../utils/queue';
import { CloseIcon, ErrorIcon, LoadingIcon, SuccessIcon, SyncIcon, UploadIcon } from '../icons/Icon';

interface IQueueVisualiserProps {
	queue: Queue<'sync' | 'upload'>;
	isOpen: boolean;
	close: () => void;
}

interface IJobCardProps {
	job: IJob<'sync' | 'upload'>;
	queue: Queue<'sync' | 'upload'>;
}

const statusColours = {
	'in-progress': '#000',
	errored: 'red',
	succeeded: 'green',
}

const StyledPanel = styled.div<{ isOpen: boolean }>`
	position: fixed;
	height: 100vh;
	right: -30vw;
	width: 30vw;
	top: 0;
	padding: 2rem;
	background: #fff;
	box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
	z-index: 5;
	transition: all .3s ease-in-out;

	h2 {
		margin-bottom: 2rem;
		font-size: 1.5rem;
		font-weight: bold;
	}

	.close-button {
		position: absolute;
    right: 1.5rem;
    font-size: 1.5rem;
    top: 1.5rem;
	}
	
	${(props): SerializedStyles => props.isOpen && css`
		right: 0px;
	`}
`;

const StyledCard = styled.div<{ status: ISyncStatuses }>`
	display: flex;
	margin-bottom: 1rem;
	border-bottom: 1px solid #c6d4e8;
	padding-bottom: 1rem;

	.type {
		margin-right: 1rem;
	}

	.card-header {
		flex: 1;
	}

	.status {
		color: ${(props): string => statusColours[props.status]};
		${(props): string => props.status === 'in-progress' && `animation: rotation .5s infinite linear;`}
	}

	@keyframes rotation {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(359deg);
		}
	}
`;

const statusIconsMapping = {
	'in-progress': {
		icon: LoadingIcon,
		label: 'In corso',
	},
	errored: {
		icon: ErrorIcon,
		label: 'Fallito',
	},
	succeeded: {
		icon: SuccessIcon,
		label: 'Completato',
	}
}

const JobCard: React.FC<IJobCardProps> = ({ job, queue }) => {
	const [localJob, setLocalJob] = useState(job);

	useEffect(() => {
		queue.listen(job.id, (job) => {
			setLocalJob({ ...job });
		});
	}, []);

	const Icon = statusIconsMapping[localJob.status].icon;

	return (
		<StyledCard status={localJob.status}>
			{localJob.type === 'sync' ? (
				<SyncIcon className="type" aria-label="Sincronizzazione" />
			) : (
				<UploadIcon className="type" aria-label="Caricamento file" />
			)}
			<p className="card-header"><strong>{localJob.label}</strong></p>
			<Icon className="status" aria-label={statusIconsMapping[localJob.status].label} />
		</StyledCard>
	);
}

export const QueueVisualiser: React.FC<IQueueVisualiserProps> = ({ queue, isOpen, close }) => {
	useEscKey(close);

	return (
		<StyledPanel isOpen={isOpen}>
			<button className="close-button" onClick={close}><CloseIcon aria-label="Chiudi coda" /></button>
			<h2>Lavori in coda</h2>
			<ul>
				{Object.values(queue.queue).map(job => (
					<li key={job.id}>
						<JobCard queue={queue} job={job} />
					</li>
				))}
			</ul>
		</StyledPanel>
	)
};