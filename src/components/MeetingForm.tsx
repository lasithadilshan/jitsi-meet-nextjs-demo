"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isValidRoomName, sanitizeRoomName, generateRoomName } from "@/lib/jitsi";

export default function MeetingForm() {
  const router = useRouter();
  const [roomInput, setRoomInput] = useState("");
  const [error, setError] = useState("");

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  function handleCreateMeeting() {
    const room = generateRoomName();
    router.push(`${basePath}/meeting/?room=${room}`);
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

    router.push(`${basePath}/meeting/?room=${sanitized}`);
  }

  return (
    <div className="space-y-8 w-full max-w-md mx-auto">
      {/* Create Meeting */}
      <div className="card text-center">
        <h2 className="text-xl font-semibold text-white mb-3">Start a New Meeting</h2>
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
        <h2 className="text-xl font-semibold text-white mb-3 text-center">Join a Meeting</h2>
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
    </div>
  );
}
