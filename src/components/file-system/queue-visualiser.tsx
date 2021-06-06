import React, { useEffect, useState } from 'react';
import { IJob, Queue } from '../../utils/queue';

interface IQueueVisualiserProps {
	queue: Queue<'sync' | 'upload'>;
}

const JobCard: React.FC<{ job: IJob<'sync' | 'upload'>; queue: Queue<'sync' | 'upload'> }> = ({ job, queue }) => {
	const [localJob, setLocalJob] = useState(job);

	useEffect(() => {
		queue.listen(job.id, (job) => {
			setLocalJob({ ...job });
		});
	}, []);

	return (
		<p>{localJob.label} - {localJob.status}</p>
	);
}

export const QueueVisualiser: React.FC<IQueueVisualiserProps> = ({ queue }) => {
	return (
		<div>
			{Object.values(queue.queue).map(job => <JobCard key={job.id} queue={queue} job={job} />)}
		</div>
	)
};