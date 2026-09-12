/**
 * Jitsi Meet configuration and utility functions.
 */

/** The default Jitsi Meet server domain (fairmeeting.net requires no login or moderator) */
export const DEFAULT_JITSI_DOMAIN = process.env.NEXT_PUBLIC_JITSI_DOMAIN || "fairmeeting.net";

/** Legacy export for backwards compatibility */
export const JITSI_DOMAIN = DEFAULT_JITSI_DOMAIN;

/** Helper to get Jitsi external API URL for any domain */
export function getJitsiApiUrl(domain: string = DEFAULT_JITSI_DOMAIN): string {
  return `https://${domain}/external_api.js`;
}

/** Legacy export */
export const JITSI_API_URL = getJitsiApiUrl(DEFAULT_JITSI_DOMAIN);

export interface JitsiServerOption {
  domain: string;
  name: string;
  description: string;
  isDefault?: boolean;
}

export const JITSI_SERVERS: JitsiServerOption[] = [
  {
    domain: "fairmeeting.net",
    name: "Fairmeeting (Free & Anonymous)",
    description: "No account or moderator required. 100% free and open.",
    isDefault: true,
  },
  {
    domain: "meet.jit.si",
    name: "meet.jit.si (Official 8x8)",
    description: "Requires moderator Google/GitHub login to start new rooms.",
  },
];

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
  domain?: string;
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

  const domain = config.domain || DEFAULT_JITSI_DOMAIN;

  const api = new JitsiMeetExternalAPI(domain, {
    roomName: config.roomName,
    parentNode: config.parentNode,
    width: "100%",
    height: "100%",
    configOverwrite: {
      startWithAudioMuted: false,
      startWithVideoMuted: false,
      prejoinConfig: {
        enabled: false,
      },
      prejoinPageEnabled: false,
      disableDeepLinking: true,
      enableWelcomePage: false,
      enableClosePage: false,
    },
    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
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
