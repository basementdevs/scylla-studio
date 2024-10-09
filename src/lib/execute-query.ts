export interface TracingResult {
	client: string;
	command: string;
	coordinator: string;
	duration: number;
	events: Event[];
	parameters: Parameters;
	request: string;
	started_at: number;
}

export interface Event {
	activity: string;
	event_id: string;
	source: string;
	source_elapsed: number;
	thread: string;
}

export interface Parameters {
	consistency_level: string;
	"param[0]": string;
	query: string;
	serial_consistency_level: string;
}

export interface QueryResult {
	result: Array<Record<string, unknown>>;
	tracing: TracingResult;
}
