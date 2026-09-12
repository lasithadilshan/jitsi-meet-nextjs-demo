"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  isValidRoomName,
  sanitizeRoomName,
  generateRoomName,
  DEFAULT_JITSI_DOMAIN,
  JITSI_SERVERS,
} from "@/lib/jitsi";

export default function MeetingForm() {
  const router = useRouter();
  const [roomInput, setRoomInput] = useState("");
  const [error, setError] = useState("");
  const [selectedServer, setSelectedServer] = useState(DEFAULT_JITSI_DOMAIN);
  const [showServerSettings, setShowServerSettings] = useState(false);

  function handleCreateMeeting() {
    const room = generateRoomName();
    router.push(`/meeting/?room=${room}&server=${selectedServer}`);
  }

  function handleJoinMeeting(e: FormEvent) {
    e.preventDefault();
    setError("");

    const sanitized = sanitizeRoomName(roomInput);

    if (!isValidRoomName(sanitized)) {
      setError(
        "Room name must be 3–64 characters and contain only letters, numbers, hyphens, or underscores."
      );
      return;
    }

    router.push(`/meeting/?room=${sanitized}&server=${selectedServer}`);
  }

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      {/* Create Meeting */}
      <div className="card text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Start a New Meeting</h2>
        <p className="text-slate-400 text-sm mb-5">
          Instantly create a private meeting room with a unique link.
        </p>
        <button
          onClick={handleCreateMeeting}
          className="btn-primary w-full"
          id="create-meeting-btn"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Create Meeting
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-700" />
        <span className="text-slate-500 text-sm font-medium">or</span>
        <div className="flex-1 h-px bg-slate-700" />
      </div>

      {/* Join Meeting */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-2 text-center">Join a Meeting</h2>
        <p className="text-slate-400 text-sm mb-5 text-center">
          Enter a room name to join an existing meeting.
        </p>
        <form onSubmit={handleJoinMeeting} className="space-y-4">
          <div>
            <label htmlFor="room-name-input" className="block text-sm font-medium text-slate-300 mb-1.5">
              Room Name
            </label>
            <input
              id="room-name-input"
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder="e.g. jitsi-demo-abc12345"
              className="input-field"
              autoComplete="off"
              maxLength={64}
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="btn-secondary w-full"
            id="join-meeting-btn"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Join Meeting
          </button>
        </form>
      </div>

      {/* Server Settings Accordion */}
      <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setShowServerSettings(!showServerSettings)}
          className="w-full flex items-center justify-between text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="inline-flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                selectedServer === "meet.jit.si" ? "bg-amber-400" : "bg-emerald-400"
              }`}
            />
            Server: <strong className="text-slate-200 font-mono">{selectedServer}</strong>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                selectedServer === "meet.jit.si"
                  ? "text-amber-400 bg-amber-950/60 border-amber-800/40"
                  : "text-emerald-400 bg-emerald-950/60 border-emerald-800/40"
              }`}
            >
              {selectedServer === "meet.jit.si" ? "Moderator Login Required" : "No Login Needed"}
            </span>
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${showServerSettings ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showServerSettings && (
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
            <label className="block text-slate-400 mb-1">Select Jitsi Server:</label>
            <div className="space-y-1.5">
              {JITSI_SERVERS.map((srv) => (
                <label
                  key={srv.domain}
                  className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer border transition-colors ${
                    selectedServer === srv.domain
                      ? "bg-indigo-950/40 border-indigo-500/40 text-white"
                      : "bg-slate-800/30 border-slate-800/60 text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="serverSelection"
                    value={srv.domain}
                    checked={selectedServer === srv.domain}
                    onChange={() => setSelectedServer(srv.domain)}
                    className="mt-0.5 text-indigo-500"
                  />
                  <div>
                    <div className="font-medium text-slate-200 flex items-center gap-2">
                      {srv.name}
                      {srv.domain === "fairmeeting.net" && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-emerald-900/60 text-emerald-300 rounded border border-emerald-700/50">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{srv.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
