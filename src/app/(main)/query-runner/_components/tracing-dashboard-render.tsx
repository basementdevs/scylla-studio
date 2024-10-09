"use client";

import { TracingResult } from "@scylla-studio/actions/execute-query";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@scylla-studio/components/ui/card";
import { ScrollArea } from "@scylla-studio/components/ui/scroll-area";
import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

export default function QueryDashboard({
	tracingInfo,
}: { tracingInfo: TracingResult }) {
	const [data, setData] = useState<TracingResult>(tracingInfo);

	// State variables for various datasets
	const [shardData, setShardData] = useState<
		{ name: string; events: number; totalTime: number }[]
	>([]);
	const [activityDurationData, setActivityDurationData] = useState<any[]>([]);
	const [activityKeys, setActivityKeys] = useState<string[]>([]);
	const [eventsPerThreadData, setEventsPerThreadData] = useState<any[]>([]);
	const [activityFrequencyData, setActivityFrequencyData] = useState<any[]>([]);
	const [eventsOverTimeData, setEventsOverTimeData] = useState<any[]>([]);
	const [activitiesPerSourceData, setActivitiesPerSourceData] = useState<any[]>(
		[],
	);
	const [timeComparisonData, setTimeComparisonData] = useState<any[]>([]);
	const [totalSourceElapsed, setTotalSourceElapsed] = useState<number>(0);

	useEffect(() => {
		const shardMap = new Map<string, { events: number; totalTime: number }>();
		const activityDurationPerShard = new Map<
			string,
			{ [activity: string]: number }
		>();
		const eventsPerThread = new Map<string, number>();
		const activityFrequency = new Map<string, number>();
		const eventsOverTime: { time: number; count: number }[] = [];
		const activitiesPerSource = new Map<string, number>();
		let maxSourceElapsed = 0;

		for (const [index, event] of data.events.entries()) {
			// Shard Data
			if (!shardMap.has(event.thread)) {
				shardMap.set(event.thread, { events: 0, totalTime: 0 });
			}
			const shardInfo = shardMap.get(event.thread)!;
			shardInfo.events++;
			shardInfo.totalTime += event.source_elapsed;

			// Activity Duration per Shard
			if (!activityDurationPerShard.has(event.thread)) {
				activityDurationPerShard.set(event.thread, {});
			}
			const shardActivities = activityDurationPerShard.get(event.thread)!;
			let duration = event.source_elapsed;
			if (index > 0 && data.events[index - 1].thread === event.thread) {
				duration -= data.events[index - 1].source_elapsed;
			}
			duration = Math.max(duration, 0);
			shardActivities[event.activity] =
				(shardActivities[event.activity] || 0) + duration;

			// Events per Thread
			eventsPerThread.set(
				event.thread,
				(eventsPerThread.get(event.thread) || 0) + 1,
			);

			// Activity Frequency
			activityFrequency.set(
				event.activity,
				(activityFrequency.get(event.activity) || 0) + 1,
			);

			// Events Over Time
			eventsOverTime.push({
				time: data.started_at + event.source_elapsed,
				count: index + 1,
			});

			// Activities per Source IP
			activitiesPerSource.set(
				event.source,
				(activitiesPerSource.get(event.source) || 0) + 1,
			);

			// Total Source Elapsed
			if (event.source_elapsed > maxSourceElapsed) {
				maxSourceElapsed = event.source_elapsed;
			}
		}

		// Prepare Data for Charts

		// Shard Data
		const shardDataArray = [...shardMap.entries()].map(([name, info]) => ({
			name,
			events: info.events,
			totalTime: info.totalTime,
		}));
		setShardData(shardDataArray);

		// Activity Duration per Shard Data
		const activityDurationDataArray: any[] = [];
		for (const [shard, activities] of activityDurationPerShard.entries()) {
			const dataPoint: any = { shard };
			for (const activity in activities) {
				dataPoint[activity] = activities[activity];
			}
			activityDurationDataArray.push(dataPoint);
		}
		setActivityDurationData(activityDurationDataArray);

		// Extract unique activity keys
		const activityKeysSet = new Set<string>();
		for (const dataPoint of activityDurationDataArray) {
			for (const key of Object.keys(dataPoint)) {
				if (key !== "shard") {
					activityKeysSet.add(key);
				}
			}
		}
		setActivityKeys([...activityKeysSet]);

		// Events per Thread Data
		const eventsPerThreadArray = [...eventsPerThread.entries()].map(
			([thread, count]) => ({
				thread,
				count,
			}),
		);
		setEventsPerThreadData(eventsPerThreadArray);

		// Activity Frequency Data
		const activityFrequencyArray = [...activityFrequency.entries()].map(
			([activity, count]) => ({
				activity,
				count,
			}),
		);
		setActivityFrequencyData(activityFrequencyArray);

		// Events Over Time Data
		setEventsOverTimeData(eventsOverTime);

		// Activities per Source IP Data
		const activitiesPerSourceArray = [...activitiesPerSource.entries()].map(
			([source, count]) => ({
				source,
				count,
			}),
		);
		setActivitiesPerSourceData(activitiesPerSourceArray);

		// Total Source Elapsed vs Total Duration Data
		setTimeComparisonData([
			{ name: "Total Source Elapsed", time: maxSourceElapsed },
			{ name: "Total Duration", time: data.duration },
		]);

		// Set total source elapsed time
		setTotalSourceElapsed(maxSourceElapsed);
	}, [data]);

	// Define colors for charts
	const colors = [
		"#8884d8",
		"#82ca9d",
		"#ffc658",
		"#d0ed57",
		"#a4de6c",
		"#8dd1e1",
		"#83a6ed",
		"#8e4585",
	];

	return (
		<div className="container mx-auto p-4 overflow-y-auto">
			<h1 className="text-2xl font-bold mb-4">Query Dashboard</h1>

			{/* Shard Charts */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				{/* Events per Shard */}
				<Card>
					<CardHeader>
						<CardTitle>Events per Shard</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={shardData}>
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="events" fill="#8884d8" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Total Time per Shard */}
				<Card>
					<CardHeader>
						<CardTitle>Total Time per Shard (ms)</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={shardData}>
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="totalTime" fill="#82ca9d" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Activity Duration per Shard */}
			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Activity Duration per Shard (ms)</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={400}>
						<BarChart data={activityDurationData}>
							<XAxis dataKey="shard" />
							<YAxis />
							<Tooltip />
							<Legend />
							{activityKeys.map((key, index) => (
								<Bar
									key={key}
									dataKey={key}
									stackId="a"
									fill={colors[index % colors.length]}
								/>
							))}
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Events per Thread and Activities by Source IP */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				{/* Events per Thread */}
				<Card>
					<CardHeader>
						<CardTitle>Events per Thread</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={eventsPerThreadData}>
								<XAxis dataKey="thread" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="count" fill="#8dd1e1" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Activities by Source IP */}
				<Card>
					<CardHeader>
						<CardTitle>Activities by Source IP</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={activitiesPerSourceData}>
								<XAxis dataKey="source" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="count" fill="#83a6ed" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Activity Frequency and Time Comparison */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				{/* Frequency of Activities */}
				<Card>
					<CardHeader>
						<CardTitle>Frequency of Activities</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={activityFrequencyData}
									dataKey="count"
									nameKey="activity"
									cx="50%"
									cy="50%"
									outerRadius={80}
									fill="#82ca9d"
									label
								/>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Total Source Elapsed vs Total Duration */}
				<Card>
					<CardHeader>
						<CardTitle>Total Source Elapsed vs Total Duration (ms)</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={timeComparisonData}>
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="time" fill="#ffc658" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Event Sequence Timeline */}
			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Event Sequence Timeline</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={eventsOverTimeData}>
							<XAxis
								dataKey="time"
								type="number"
								domain={["dataMin", "dataMax"]}
								tickFormatter={(time) => new Date(time).toLocaleTimeString()}
							/>
							<YAxis dataKey="count" />
							<Tooltip
								labelFormatter={(time) => new Date(time).toLocaleTimeString()}
							/>
							<Legend />
							<Line
								type="monotone"
								dataKey="count"
								stroke="#8884d8"
								dot={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Query Information and Parameters */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				{/* Query Information */}
				<Card>
					<CardHeader>
						<CardTitle>Query Information</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							<strong>Client:</strong> {data.client}
						</p>
						<p>
							<strong>Coordinator:</strong> {data.coordinator}
						</p>
						<p>
							<strong>Command:</strong> {data.command}
						</p>
						<p>
							<strong>Request:</strong> {data.request}
						</p>
						<p>
							<strong>Duration:</strong> {data.duration} ms
						</p>
						<p>
							<strong>Total Source Elapsed:</strong> {totalSourceElapsed} ms
						</p>
						<p>
							<strong>Started at:</strong>{" "}
							{new Date(data.started_at).toLocaleString()}
						</p>
					</CardContent>
				</Card>

				{/* Query Parameters */}
				<Card>
					<CardHeader>
						<CardTitle>Query Parameters</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							<strong>Consistency Level:</strong>{" "}
							{data.parameters.consistency_level}
						</p>
						<p>
							<strong>Serial Consistency Level:</strong>{" "}
							{data.parameters.serial_consistency_level}
						</p>
						<p>
							<strong>Param[0]:</strong> {data.parameters["param[0]"] || "N/A"}
						</p>
						<p>
							<strong>Query:</strong> {data.parameters.query}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Event Timeline */}
			<Card>
				<CardHeader>
					<CardTitle>Event Timeline</CardTitle>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[400px]">
						{data.events.map((event) => (
							<div key={event.event_id} className="mb-2 p-2 rounded">
								<p>
									<strong>Activity:</strong> {event.activity}
								</p>
								<p>
									<strong>Thread:</strong> {event.thread}
								</p>
								<p>
									<strong>Source:</strong> {event.source}
								</p>
								<p>
									<strong>Elapsed Time:</strong> {event.source_elapsed} ms
								</p>
							</div>
						))}
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	);
}
