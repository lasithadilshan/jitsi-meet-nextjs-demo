/**
 * Jitsi Meet configuration and utility functions.
 */

/** The public Jitsi Meet server domain */
export const JITSI_DOMAIN = "meet.jit.si";

/** URL for the Jitsi IFrame API script */
export const JITSI_API_URL = `https://${JITSI_DOMAIN}/external_api.js`;

/**
 * Validate a meeting room name.
 * Allows alphanumeric characters, hyphens, and underscores.
 * Must be between 3 and 64 characters.
 */
export function isValidRoomName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 3 || trimmed.length > 64) return false;
  return /^[a-zA-Z0-9_-]+$/.test(trimmed);
}

/**
 * Sanitize a room name by stripping invalid characters.
 */
export function sanitizeRoomName(name: string): string {
  return name.trim().replace(/[^a-zA-Z0-9_-]/g, "");
}

/**
 * Generate a unique random room name.
 * Example output: "jitsi-demo-a3f8b2c1"
 */
export function generateRoomName(): string {
  const id = Math.random().toString(36).substring(2, 10);
  return `jitsi-demo-${id}`;
}

/** Clean set of toolbar buttons for the demo */
export const TOOLBAR_BUTTONS = [
  "microphone",
  "camera",
  "desktop",
  "chat",
  "raisehand",
  "participants-pane",
  "tileview",
  "select-background",
  "fullscreen",
  "hangup",
];

/** Jitsi IFrame API configuration options */
export interface JitsiConfig {
  roomName: string;
  displayName?: string;
  parentNode: HTMLElement;
  onLoad?: () => void;
  onReadyToClose?: () => void;
  onParticipantJoined?: (participant: { id: string; displayName: string }) => void;
  onParticipantLeft?: (participant: { id: string }) => void;
  onVideoConferenceJoined?: (data: { roomName: string; id: string; displayName: string }) => void;
}

/**
 * Create and return a new JitsiMeetExternalAPI instance.
 * Must be called only on the client side.
 */
export function createJitsiMeeting(config: JitsiConfig): JitsiMeetExternalAPI | null {
  if (typeof window === "undefined") return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const JitsiMeetExternalAPI = (window as any).JitsiMeetExternalAPI;
  if (!JitsiMeetExternalAPI) {
    console.error("JitsiMeetExternalAPI is not loaded");
    return null;
  }

  const api = new JitsiMeetExternalAPI(JITSI_DOMAIN, {
    roomName: config.roomName,
    parentNode: config.parentNode,
    width: "100%",
    height: "100%",
    configOverwrite: {
      startWithAudioMuted: false,
      startWithVideoMuted: false,
      prejoinPageEnabled: true,
      disableDeepLinking: true,
    },
    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: true,
      SHOW_WATERMARK_FOR_GUESTS: true,
      DEFAULT_BACKGROUND: "#0f172a",
      TOOLBAR_BUTTONS: TOOLBAR_BUTTONS,
    },
    userInfo: config.displayName ? { displayName: config.displayName } : undefined,
  });

  if (config.onLoad) {
    api.addEventListener("videoConferenceJoined", config.onLoad);
  }

  if (config.onReadyToClose) {
    api.addEventListener("readyToClose", config.onReadyToClose);
  }

  if (config.onParticipantJoined) {
    api.addEventListener("participantJoined", config.onParticipantJoined);
  }

  if (config.onParticipantLeft) {
    api.addEventListener("participantLeft", config.onParticipantLeft);
  }

  if (config.onVideoConferenceJoined) {
    api.addEventListener("videoConferenceJoined", config.onVideoConferenceJoined);
  }

  return api;
}

/** Type alias for the Jitsi API instance — the actual type comes from the external script */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JitsiMeetExternalAPI = any;
