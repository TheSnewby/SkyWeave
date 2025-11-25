"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Position = {
	x: number;
	y: number;
	z: number;
};

export type Orientation = {
	roll: number;
	pitch: number;
	yaw: number;
};

export type UavState = {
	id: string;
	callsign: string;
	position: Position;
	orientation: Orientation;
	velocity_mps: number;
	last_update?: string;
};

export type ConnectionStatus = "connecting" | "open" | "closed" | "error";

type TelemetryState = {
	uavs: UavState[];
	status: ConnectionStatus;
	settings: any | null;
	send: (message: unknown) => void;
};

/**
 * useTelemetry
 * - opens a WebSocket to the rust server
 * - receives either:
 *   - array of UavState (initial snapshot)
 *   - single UavState (incremental update)
 */
export function useTelemetry(): TelemetryState {
	const [uavs, setUavs] = useState<UavState[]>([]);
	const [status, setStatus] = useState<ConnectionStatus>("connecting");
	const [settings, setSettings] = useState<any | null>(null);
	const wsRef = useRef<WebSocket | null>(null);

	const send = useCallback(
		(message: unknown) => {
			const ws = wsRef.current;
			if (!ws || ws.readyState !== WebSocket.OPEN) {
				console.warn("WebSocket not open; cannot send message", message);
				return;
			}

			try {
				const payload =
					typeof message === "string" ? message : JSON.stringify(message);
				ws.send(payload);
			} catch (err) {
				console.error("Failed to send WS message", err);
			}
		},
		[]
	);

	useEffect(() => {
		// only run on client
		if (typeof window === "undefined") return;

		// build WS URL: assume rust server on port 8080
		const host = window.location.hostname || "localhost";
		const wsUrl = `ws://${host}:8080/ws`;

		const ws = new WebSocket(wsUrl);
		wsRef.current = ws;

		ws.onopen = () => {
			setStatus("open");
			// console.log("WS connected");
		};

		ws.onclose = () => {
			setStatus("closed");
			// console.log("WS closed");
		};

		ws.onerror = () => {
			setStatus("error");
			// console.error("WS error", event);
		};

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);

				// settings updates
				if (data?.type === "settings_update") {
					setSettings(data.payload);
					return;
				}

				// initial UAV snapshot
				if (Array.isArray(data)) {
					setUavs(data);
					return;
				}

				// single UAV update
				const update: UavState = data;
				setUavs((prev) => {
					const idx = prev.findIndex((u) => u.id === update.id);
					if (idx === -1) return [...prev, update];
					const copy = [...prev];
					copy[idx] = update;
					return copy;
				});
			} catch (err) {
				console.error("Failed to parse WS message", err);
			}
		};

		return () => {
			ws.close();
			wsRef.current = null;
		};
	}, []);

	return { uavs, status, settings, send };
}
