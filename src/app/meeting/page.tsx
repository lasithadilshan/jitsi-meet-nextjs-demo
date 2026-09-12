"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import JitsiMeeting from "@/components/JitsiMeeting";
import { isValidRoomName } from "@/lib/jitsi";

function MeetingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomName = searchParams.get("room") || "";
  const [displayName, setDisplayName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const isValid = isValidRoomName(roomName);


  function handleMeetingEnd() {
    setMeetingEnded(true);
  }

  function handleGoHome() {
    router.push(`${basePath}/`);
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
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-slate-400 text-sm font-mono">{roomName}</p>
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
            You&apos;ll join the meeting hosted on meet.jit.si
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
            <span className="text-slate-300 text-sm font-mono truncate max-w-[200px] sm:max-w-none">
              {roomName}
            </span>
          </div>
        </div>
        {displayName && (
          <span className="text-slate-500 text-xs hidden sm:block">
            Joined as {displayName}
          </span>
        )}
      </header>

      {/* Meeting container */}
      <div className="flex-1 p-2 sm:p-4">
        <JitsiMeeting
          roomName={roomName}
          displayName={displayName || undefined}
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
          href="https://jitsi.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-indigo-400 transition-colors"
        >
          Jitsi Meet
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
