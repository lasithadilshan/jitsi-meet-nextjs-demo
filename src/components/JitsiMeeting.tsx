"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_JITSI_DOMAIN,
  getJitsiApiUrl,
  createJitsiMeeting,
  JitsiMeetExternalAPI,
} from "@/lib/jitsi";

interface JitsiMeetingProps {
  roomName: string;
  displayName?: string;
  domain?: string;
  onMeetingEnd?: () => void;
}

type MeetingStatus = "loading" | "ready" | "ended" | "error";

export default function JitsiMeeting({
  roomName,
  displayName,
  domain,
  onMeetingEnd,
}: JitsiMeetingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiMeetExternalAPI | null>(null);
  const [status, setStatus] = useState<MeetingStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const targetDomain = domain || DEFAULT_JITSI_DOMAIN;
  const apiUrl = getJitsiApiUrl(targetDomain);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    function initJitsi() {
      if (cancelled || !containerRef.current) return;

      // Clear container before initializing
      containerRef.current.innerHTML = "";

      try {
        const api = createJitsiMeeting({
          roomName,
          displayName,
          domain: targetDomain,
          parentNode: containerRef.current,
          onLoad: () => {
            if (!cancelled) setStatus("ready");
          },
          onReadyToClose: () => {
            if (!cancelled) {
              setStatus("ended");
              onMeetingEnd?.();
            }
          },
          onVideoConferenceJoined: (data) => {
            if (!cancelled) {
              setStatus("ready");
              console.log("Joined conference:", data.roomName);
            }
          },
          onParticipantJoined: (participant) => {
            console.log("Participant joined:", participant.displayName);
          },
          onParticipantLeft: (participant) => {
            console.log("Participant left:", participant.id);
          },
        });

        if (api) {
          apiRef.current = api;

          // As soon as the iframe element loads, clear the loading overlay
          try {
            const iframe = api.getIFrame?.();
            if (iframe) {
              iframe.addEventListener("load", () => {
                if (!cancelled) setStatus("ready");
              });
            }
          } catch {
            // ignore
          }

          // Safety timeout to ensure the overlay never permanently blocks the meeting
          setTimeout(() => {
            if (!cancelled) setStatus("ready");
          }, 3500);
        } else {
          setStatus("error");
          setErrorMessage("Failed to initialize Jitsi Meet. Please try refreshing the page.");
        }
      } catch (err) {
        console.error("Jitsi initialization error:", err);
        if (!cancelled) {
          setStatus("error");
          setErrorMessage("An error occurred while loading the meeting. Please try again.");
        }
      }
    }

    // Ensure Jitsi external API is loaded before initializing
    if ((window as any).JitsiMeetExternalAPI) {
      initJitsi();
    } else {
      const existingScript = document.querySelector(`script[src="${apiUrl}"]`) as HTMLScriptElement | null;
      if (existingScript) {
        existingScript.addEventListener("load", initJitsi);
      } else {
        const script = document.createElement("script");
        script.src = apiUrl;
        script.async = true;
        script.onload = initJitsi;
        script.onerror = () => {
          if (!cancelled) {
            setStatus("error");
            setErrorMessage(
              `Failed to load Jitsi Meet from ${targetDomain}. Please check your connection or try another server.`
            );
          }
        };
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (apiRef.current) {
        try {
          apiRef.current.dispose();
        } catch {
          // Jitsi may already be disposed
        }
        apiRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName, displayName, targetDomain]);

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] card">
        <svg className="w-16 h-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <h3 className="text-lg font-semibold text-white mb-2">Meeting Error</h3>
        <p className="text-slate-400 text-center max-w-sm">{errorMessage}</p>
      </div>
    );
  }

  if (status === "ended") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] card">
        <svg className="w-16 h-16 text-emerald-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-white mb-2">Meeting Ended</h3>
        <p className="text-slate-400 text-center">The meeting has ended. You can return to the home page to start a new one.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-10 rounded-xl">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-indigo-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-300 text-sm">Loading meeting…</p>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden"
        style={{ minHeight: "500px", height: "calc(100vh - 200px)" }}
        id="jitsi-container"
      />
    </div>
  );
}
