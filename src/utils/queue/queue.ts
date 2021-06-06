import { ISyncStatuses } from "../../services/catalogues-api/catalogues-service";

export type IJob<T> = {
	id: string;
	label: string;
	type: T;
	status: ISyncStatuses;
	listener?: (job: IJob<T>) => void;
};

export type IJobsQueue<T> = {
	[id: string]: IJob<T>;
}

export class Queue<T> {
	public queue: IJobsQueue<T>;

	constructor() {
		this.queue = {};
	}

	public push(job: Pick<IJob<T>, 'id' | 'label' | 'type'>): void {
		this.queue[job.id] = { ...job, status: 'in-progress' };
	}

	public update(id: string, jobStatus: ISyncStatuses): void {
		this.queue[id].status = jobStatus;

		this.queue[id]?.listener?.(this.queue[id]);
	}

	public listen(id: string, listener: (job: IJob<T>) => void): void {
		this.queue[id].listener = listener;
	}
}