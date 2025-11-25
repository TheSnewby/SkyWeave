
"use client";

import { useEffect, useState } from "react";

import { useTelemetry } from "./hooks/useTelemetry";
import UavScene from "./components/UavScene";
import TelemetryTable from "./components/TelemetryTable";
import SwarmControls, { SwarmSettings } from "./components/SwarmControls";
import CommandPanel, { Command } from "./components/CommandPanel";

export default function TelemetryPage() {
  const { uavs, status, send } = useTelemetry();
  const [showTrails, setShowTrails] = useState(true);
  const [swarmSettings, setSwarmSettings] = useState<SwarmSettings>({
    cohesion: 1.0,
    separation: 1.0,
    alignment: 1.0,
    maxSpeed: 30,
    targetAltitude: 150,
  });

  const handleCommand = (cmd: Command) => {
    // Send command over the telemetry WebSocket to the Rust backend
    send({ type: "command", payload: cmd });
  };

  useEffect(() => {
    // Broadcast swarm behavior settings to the backend via WebSocket
    send({ type: "swarm_settings", payload: swarmSettings });
  }, [swarmSettings, send]);

  // Keyboard controls: WASD to move leader, Q/E altitude, T toggle trails
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don’t hijack typing in inputs/textareas/selects
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "w":
          send({
            type: "command",
            payload: { type: "move_leader", direction: "north" },
          });
          break;
        case "s":
          send({
            type: "command",
            payload: { type: "move_leader", direction: "south" },
          });
          break;
        case "a":
          send({
            type: "command",
            payload: { type: "move_leader", direction: "west" },
          });
          break;
        case "d":
          send({
            type: "command",
            payload: { type: "move_leader", direction: "east" },
          });
          break;
        case "q":
          send({
            type: "command",
            payload: { type: "altitude_change", amount: 10 },
          });
          break;
        case "e":
          send({
            type: "command",
            payload: { type: "altitude_change", amount: -10 },
          });
          break;
        case "t":
          setShowTrails((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [send]);

  return (
    <main className="min-h-screen w-full bg-black text-white flex justify-center items-start py-8">
      <div className="w-full max-w-6xl px-4 crt-scanlines">
        <header className="flex items-baseline justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight nasa-text">
              SKYWEAVE MISSION CONTROL
            </h1>
            <p className="text-zinc-400 mt-1 text-sm">
              Live UAV swarm telemetry • C++ sim → Rust server → WebSocket → Next.js
            </p>
            <p className="text-zinc-500 mt-1 text-xs nasa-text">
              Controls: WASD move leader • Q/E altitude • T toggle trails
            </p>
          </div>

          <div className="text-right text-xs nasa-text">
            <div className="crt-flicker">
              WS STATUS: {status.toUpperCase()}
            </div>
            <div className="mt-1">
              ACTIVE UAVS: {uavs.length}
            </div>
          </div>
        </header>

        <section className="mb-6 relative">
          {/* HUD overlays over the 3D view */}
          <div className="absolute top-2 left-3 z-10 nasa-text text-xs crt-flicker">
            SWARM: {uavs.length > 0 ? "ACTIVE" : "STANDBY"}
          </div>
          <div className="absolute top-2 right-3 z-10 flex flex-col items-end gap-1">
            <div className="nasa-text text-xs">VIEW: 3D ORBIT</div>
            <button
              className="nasa-text text-[0.65rem] px-2 py-1 border border-emerald-500 rounded hover:bg-emerald-600/20"
              onClick={() => setShowTrails(prev => !prev)}
            >
              TRAILS: {showTrails ? "ON" : "OFF"}
            </button>
          </div>

          <UavScene uavs={uavs} showTrails={showTrails} />
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <CommandPanel onCommand={handleCommand} />
          <SwarmControls settings={swarmSettings} onChange={setSwarmSettings} />
        </section>

        <section>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 nasa-text">
            Telemetry Console
          </h2>
          <TelemetryTable uavs={uavs} />
        </section>
      </div>
    </main>
  );
}
