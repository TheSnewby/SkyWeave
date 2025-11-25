"use client";

import React from "react";
import type { ConnectionStatus } from "../hooks/useTelemetry";

export type Command =
  | { type: "move_leader"; direction: "north" | "south" | "east" | "west" }
  | { type: "altitude_change"; amount: number }
  | { type: "formation"; mode: "line" | "vee" | "circle" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "rtb" }; // return to base (leader)

type CommandPanelProps = {
  onCommand: (cmd: Command) => void;
  status: ConnectionStatus;
};

/**
 * CommandPanel
 *
 * Mission Control command interface for UAV swarm operations
 * - leader movement buttons
 * - altitude adjustments
 * - formation switches
 * - global pause/resume/RTB
 */
export default function CommandPanel({ onCommand, status }: CommandPanelProps) {
  const isDisabled = status !== "open";
  const statusLabel =
    status === "open"
      ? "WS: CONNECTED"
      : status === "connecting"
      ? "WS: CONNECTING..."
      : status === "closed"
      ? "WS: DISCONNECTED"
      : "WS: ERROR";

  const statusColor =
    status === "open"
      ? "text-emerald-300"
      : status === "connecting"
      ? "text-yellow-300"
      : status === "closed"
      ? "text-red-400"
      : "text-red-400";

  return (
    <section className="mc-panel mc-panel-inner bg-gradient-to-b from-black/80 to-black/95 nasa-text text-xs border border-emerald-700/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
      <h2 className="mb-4 flex items-center justify-between">
        <span className="uppercase tracking-widest text-[0.7rem] text-emerald-300">
          Command Console
        </span>
        <span className={`text-[0.65rem] tracking-wide ${statusColor}`}>
          {statusLabel}
        </span>
      </h2>

      {/* leader movement */}
      <div className="mb-4">
        <div className="mb-1 tracking-wide">LEADER MOVEMENT</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <button
            className="mc-button btn-glow nasa-text text-[0.7rem] disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isDisabled}
            onClick={() => onCommand({ type: "move_leader", direction: "north" })}
          >
            ▲
          </button>
          <div />
          <button
            className="mc-button btn-glow nasa-text text-[0.7rem] disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isDisabled}
            onClick={() => onCommand({ type: "move_leader", direction: "south" })}
          >
            ▼
          </button>
          <button
            className="mc-button btn-glow nasa-text text-[0.7rem] disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isDisabled}
            onClick={() => onCommand({ type: "move_leader", direction: "west" })}
          >
            ◀
          </button>
          <div />
          <button
            className="mc-button btn-glow nasa-text text-[0.7rem] disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isDisabled}
            onClick={() => onCommand({ type: "move_leader", direction: "east" })}
          >
            ▶
          </button>
        </div>
      </div>

      {/* altitude controls */}
      <div className="mb-4">
        <div className="mb-1 tracking-wide">ALTITUDE</div>
        <div className="flex gap-2">
          <button
            className="flex-1 mc-button btn-glow nasa-text text-[0.7rem] disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isDisabled}
            onClick={() => onCommand({ type: "altitude_change", amount: +10 })}
          >
            +10m
          </button>
          <button
            className="flex-1 mc-button btn-glow nasa-text text-[0.7rem] disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isDisabled}
            onClick={() => onCommand({ type: "altitude_change", amount: -10 })}
          >
            −10m
          </button>
        </div>
      </div>

      {/* formation controls */}
      <div className="mb-4">
        <div className="mb-1 tracking-wide">FORMATION</div>
        <div className="grid grid-cols-3 gap-2">
          <button
            className="mc-button btn-glow nasa-text text-[0.7rem] disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isDisabled}
            onClick={() => onCommand({ type: "formation", mode: "line" })}
          >
            LINE
          </button>
          <button
            className="mc-button btn-glow nasa-text text-[0.7rem] disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isDisabled}
            onClick={() => onCommand({ type: "formation", mode: "vee" })}
          >
            VEE
          </button>
          <button
            className="mc-button btn-glow nasa-text text-[0.7rem] disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isDisabled}
            onClick={() => onCommand({ type: "formation", mode: "circle" })}
          >
            CIRCLE
          </button>
        </div>
      </div>

      {/* global controls */}
      <div className="mb-1 tracking-wide">GLOBAL COMMANDS</div>
      <div className="grid grid-cols-3 gap-2">
        <button
          className="mc-button btn-glow nasa-text text-[0.7rem] disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={isDisabled}
          onClick={() => onCommand({ type: "pause" })}
        >
          PAUSE
        </button>
        <button
          className="mc-button btn-glow nasa-text text-[0.7rem] disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={isDisabled}
          onClick={() => onCommand({ type: "resume" })}
        >
          RESUME
        </button>
        <button
          className="mc-button btn-glow nasa-text text-[0.7rem] disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={isDisabled}
          onClick={() => onCommand({ type: "rtb" })}
        >
          RTB
        </button>
      </div>
    </section>
  );
}
