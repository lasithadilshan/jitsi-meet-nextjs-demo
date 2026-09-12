"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import JitsiMeeting from "@/components/JitsiMeeting";
import { isValidRoomName, DEFAULT_JITSI_DOMAIN } from "@/lib/jitsi";

function MeetingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomName = searchParams.get("room") || "";
  const serverParam = searchParams.get("server") || "";
  const [selectedServer] = useState(serverParam || DEFAULT_JITSI_DOMAIN);
  const [displayName, setDisplayName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isValid = isValidRoomName(roomName);

  function handleMeetingEnd() {
    setMeetingEnded(true);
  }

  function handleGoHome() {
    router.push("/");
  }

  function handleCopyLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  // Invalid or missing room name
  if (!isValid) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
        <div className="card text-center max-w-md">
          <svg className="w-16 h-16 text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <h1 className="text-xl font-semibold text-white mb-2">Invalid Room Name</h1>
          <p className="text-slate-400 mb-6">
            {roomName
              ? <>The room name &ldquo;{roomName}&rdquo; is not valid. Room names must be 3–64 characters and contain only letters, numbers, hyphens, or underscores.</>
              : "No room name was provided. Please go back and create or join a meeting."
            }
          </p>
          <button onClick={handleGoHome} className="btn-primary">
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  // Pre-join screen: enter display name
  if (!hasJoined) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <button
            onClick={handleGoHome}
            className="text-slate-400 hover:text-white transition-colors text-sm mb-6 inline-flex items-center gap-1"
          >
            ← Back to Home
          </button>

          <h1 className="text-2xl font-bold text-white mb-1">Join Meeting</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-slate-400 text-sm font-mono">{roomName}</p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800 mb-5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Server: <strong className="text-slate-200 font-mono">{selectedServer}</strong>
            </span>
            <span className="text-emerald-400 text-[11px]">Free & Anonymous</span>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="display-name-input" className="block text-sm font-medium text-slate-300 mb-1.5">
                Your Name <span className="text-slate-500">(optional)</span>
              </label>
              <input
                id="display-name-input"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="input-field"
                maxLength={40}
                autoComplete="name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") setHasJoined(true);
                }}
              />
            </div>

            <button
              onClick={() => setHasJoined(true)}
              className="btn-primary w-full"
              id="enter-meeting-btn"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Enter Meeting
            </button>
          </div>

          <p className="text-slate-500 text-xs mt-4 text-center">
            Zero accounts required. Instant WebRTC video conferencing.
          </p>
        </div>
      </main>
    );
  }

  // Active meeting or ended state
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoHome}
            className="text-slate-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1"
            id="back-home-btn"
          >
            ← Home
          </button>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-2">
            {!meetingEnded && (
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
            <span className="text-slate-300 text-sm font-mono truncate max-w-[140px] sm:max-w-none">
              {roomName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Copy meeting link to invite others"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>Share Link</span>
              </>
            )}
          </button>
          {displayName && (
            <span className="text-slate-500 text-xs hidden sm:block">
              Joined as {displayName}
            </span>
          )}
        </div>
      </header>

      {/* Meeting container */}
      <div className="flex-1 p-2 sm:p-4">
        <JitsiMeeting
          roomName={roomName}
          displayName={displayName || undefined}
          domain={selectedServer}
          onMeetingEnd={handleMeetingEnd}
        />
      </div>

      {meetingEnded && (
        <div className="p-4 flex justify-center">
          <button onClick={handleGoHome} className="btn-primary">
            ← Return to Home
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-3 text-slate-600 text-xs border-t border-slate-800">
        Powered by{" "}
        <a
          href={`https://${selectedServer}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-indigo-400 transition-colors"
        >
          {selectedServer}
        </a>
      </footer>
    </main>
  );
}

export default function MeetingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
        </main>
      }
    >
      <MeetingPageContent />
    </Suspense>
  );
}
