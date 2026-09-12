# Jitsi Meet Next.js Demo

[![Deploy to GitHub Pages](https://github.com/lasithadilshan/jitsi-meet-nextjs-demo/actions/workflows/deploy.yml/badge.svg)](https://github.com/lasithadilshan/jitsi-meet-nextjs-demo/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://lasithadilshan.github.io/jitsi-meet-nextjs-demo/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38b2ac.svg)](https://tailwindcss.com/)

A modern, production-quality video conferencing web application integrating **Jitsi Meet** with **Next.js 16**, fully statically exported and hosted free on **GitHub Pages**.

🌐 **Live Demo:** [https://lasithadilshan.github.io/jitsi-meet-nextjs-demo/](https://lasithadilshan.github.io/jitsi-meet-nextjs-demo/)

---

## Highlights

- ⚡ **Zero Backend Required** — 100% static Next.js export (`output: 'export'`) running completely free on GitHub Pages.
- 🔒 **Zero-Login Video Calling** — Defaulted to `fairmeeting.net` (Fairkom Foundation), enabling instant, anonymous meetings without Google/GitHub account logins.
- 🌐 **Multi-Server Support** — Built-in server switcher supporting `fairmeeting.net`, official `meet.jit.si` (8x8), or any custom self-hosted Jitsi instance.
- 📱 **Responsive Dark UI** — Glassmorphism design system built with Tailwind CSS 4 and fluid controls across mobile, tablet, and desktop.
- 🔗 **Instant Sharing** — One-click link copying with real-time feedback toast to invite participants effortlessly.
- 🛡️ **Camera & Mic Integration** — Automatic device negotiation with hardware status detection and pre-join preview.

---

## Technology Stack

| Technology | Role |
|---|---|
| [Next.js 16 (Turbopack)](https://nextjs.org) | Modern React framework configured with static export |
| [React 19](https://react.dev) | Modern component architecture & hooks |
| [TypeScript 5](https://www.typescriptlang.org) | Strict type-safety across all components & APIs |
| [Tailwind CSS 4](https://tailwindcss.com) | Modern CSS utility-first styling with `@theme` tokens |
| [Jitsi Meet External API](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe) | IFrame API wrapper with programmatic event handling |
| [GitHub Actions](https://github.com/features/actions) | Continuous Integration & automated deployment pipeline |
| [GitHub Pages](https://pages.github.com) | Free high-performance static web hosting |

---

## Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment to Pages
├── src/
│   ├── app/
│   │   ├── globals.css         # Global design system tokens & utilities
│   │   ├── layout.tsx          # Root layout with SEO metadata & fonts
│   │   ├── page.tsx            # Home page (server selector & room form)
│   │   └── meeting/
│   │       └── page.tsx        # Pre-join & live meeting conference room
│   ├── components/
│   │   ├── JitsiMeeting.tsx    # Jitsi External API lifecycle wrapper
│   │   └── MeetingForm.tsx     # Room generator & server accordion form
│   └── lib/
│       └── jitsi.ts            # Configuration, server list & validation
├── .env.example                # Environment variable reference
├── LICENSE                     # MIT License
├── next.config.ts              # Static export & basePath configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## Supported Jitsi Servers

| Server | Domain | Moderator Login | Best For |
|---|---|---|---|
| **Fairmeeting (Default)** | `fairmeeting.net` | ❌ No Login Needed | Instant, anonymous video calls without requiring Google/GitHub accounts. Hosted by Fairkom NGO in Europe. |
| **meet.jit.si (Official 8x8)** | `meet.jit.si` | ⚠️ Login Required | Hosted by 8x8. Since August 2023, requires a room moderator to sign in (Google/GitHub/Facebook) to create new rooms. |
| **Custom / Self-Hosted** | Configurable | Dependent on config | Any self-hosted Jitsi Meet instance via `NEXT_PUBLIC_JITSI_DOMAIN`. |

> **Why did meet.jit.si show "Loading meeting..."?**  
> In August 2023, 8x8 disabled anonymous room creation. When entering an unstarted room on `meet.jit.si`, it holds users in a "Waiting for moderator" lobby. Because browsers block third-party OAuth popups inside embedded iframes, login inside the iframe fails. The demo app includes an in-app banner with an **"Open in Tab ↗"** button to start the room as moderator, or a **"Switch to Fairmeeting"** button for instant zero-login calling.

---

## Quick Start (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/lasithadilshan/jitsi-meet-nextjs-demo.git
cd jitsi-meet-nextjs-demo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Building for Production

To test the static production export locally:

```bash
# Build the static site
npm run build

# Preview the static output with a local server
npx serve out
```

---

## Deploying to GitHub Pages

The repository contains an automated GitHub Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Fork or push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/lasithadilshan/jitsi-meet-nextjs-demo.git
   git branch -M main
   git push -u origin main
   ```
2. In your repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Every push to the `main` branch automatically triggers the build and deployment.
5. The site will be available at:
   ```
   https://<username>.github.io/<repository-name>/
   ```

---

## Testing Meeting Functionality

### Solo Test
1. Open the application at [https://lasithadilshan.github.io/jitsi-meet-nextjs-demo/](https://lasithadilshan.github.io/jitsi-meet-nextjs-demo/).
2. Click **Create Meeting**.
3. Enter your name and click **Enter Meeting**.
4. Grant camera and microphone access when prompted by the browser.
5. Verify that your video tile, toolbar, and audio indicators are active.

### Multi-Participant Test
1. While in an active meeting, click the **Share Link** button in the top navigation bar.
2. Open the copied URL in a separate browser window, incognito tab, or mobile device.
3. Enter a different participant name and click **Enter Meeting**.
4. Verify that both participants see and hear each other with active WebRTC streaming.

---

## Troubleshooting

- **Camera / Microphone not appearing:** Ensure browser permissions are allowed for the site (click the padlock icon in the browser address bar).
- **Embedded meeting stuck loading on `meet.jit.si`:** Click **Switch to Fairmeeting (No Login)** to use the free NGO server, or click **Open in Tab ↗** to log in as moderator on `meet.jit.si`.
- **404 error on refresh or direct navigation on GitHub Pages:** Next.js static export uses query parameters (`/meeting/?room=xyz`) rather than dynamic folders (`/meeting/[room]`), ensuring every route works with static web servers without server-side rewrite rules.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Copyright &copy; 2026 **Lasitha Thilakarathna**. All rights reserved.
