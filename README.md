# Jitsi Meet Demo

Free video meetings powered by [Jitsi Meet](https://jitsi.org), built with [Next.js](https://nextjs.org) and deployed on GitHub Pages.

No backend, no database, no API keys — just a static web application that connects to the free public `meet.jit.si` server.

---

## Features

- **Create a Meeting** — instantly generates a unique room name and starts a meeting
- **Join a Meeting** — enter any room name to join an existing meeting
- **Display Name** — optionally set your name before joining
- **Jitsi IFrame API** — uses the official Jitsi Meet External API (not a plain iframe)
- **Event Handling** — tracks meeting joined, participant joined/left, meeting ended
- **Room Validation** — sanitizes and validates room names before use
- **Responsive Design** — works on desktop, tablet, and mobile
- **Static Export** — fully static Next.js build, no server required
- **GitHub Pages** — automated deployment via GitHub Actions

## Technology Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org) | React framework with static export |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [React 19](https://react.dev) | UI components |
| [Tailwind CSS 4](https://tailwindcss.com) | Styling |
| [Jitsi Meet IFrame API](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe) | Video conferencing |
| [GitHub Actions](https://docs.github.com/actions) | CI/CD |
| [GitHub Pages](https://pages.github.com) | Static hosting |

## Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── src/
│   ├── app/
│   │   ├── globals.css         # Global styles & design system
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Home page (create/join meeting)
│   │   └── meeting/
│   │       └── page.tsx        # Meeting page (Jitsi embed)
│   ├── components/
│   │   ├── JitsiMeeting.tsx    # Jitsi IFrame API component
│   │   └── MeetingForm.tsx     # Create/Join meeting form
│   └── lib/
│       └── jitsi.ts            # Jitsi utilities & configuration
├── .env.example                # Environment variables template
├── next.config.ts              # Next.js config (static export)
├── package.json
├── tsconfig.json
└── README.md
```

## How Jitsi Meet Works

This application connects to public [Jitsi Meet](https://jitsi.org) servers using the [Jitsi Meet IFrame API](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe).

- **Default Server (`fairmeeting.net`)**: Hosted by fairkom in Europe. It is 100% free and allows anonymous meeting creation with **no accounts or moderator login required**.
- **Official Server (`meet.jit.si`)**: Provided by [8x8](https://www.8x8.com). Note: Since August 2023, `meet.jit.si` requires an authenticated moderator (logging in with Google, GitHub, or Facebook) to create new rooms.
- **Custom / Self-Hosted**: You can configure any self-hosted Jitsi instance via `NEXT_PUBLIC_JITSI_DOMAIN` or via the UI server selector.
- Anyone with the same room name and server joins the same meeting.
- All video/audio is WebRTC peer-to-peer and processed by Jitsi's videobridge servers — this app is purely a static frontend.

## Local Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/jitsi-meet-demo.git
cd jitsi-meet-demo

# Install dependencies
npm install

# (Optional) Create a local env file
cp .env.example .env.local
```

## Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

```bash
# Build the static site
npm run build

# The output is in the `out/` directory
```

To preview the production build locally:

```bash
npx serve out
```

## GitHub Repository Setup

1. Create a new repository on GitHub (e.g., `jitsi-meet-demo`)
2. Push this project to the repository:

```bash
git remote add origin https://github.com/YOUR_USERNAME/jitsi-meet-demo.git
git add .
git commit -m "Initial commit: Jitsi Meet Demo"
git branch -M main
git push -u origin main
```

## GitHub Pages Setup

1. Go to your repository on GitHub
2. Navigate to **Settings → Pages**
3. Under **Source**, select **GitHub Actions**
4. Push to the `main` branch — the workflow will run automatically
5. Wait for the deployment to complete (check the **Actions** tab)

## GitHub Actions Deployment

The workflow at `.github/workflows/deploy.yml` automatically:

1. Checks out the code
2. Sets up Node.js 20
3. Installs dependencies with `npm ci`
4. Builds the static site with `NEXT_PUBLIC_BASE_PATH=/<repo-name>`
5. Uploads the `out/` directory as a Pages artifact
6. Deploys to GitHub Pages

The `NEXT_PUBLIC_BASE_PATH` is automatically set to `/<repository-name>` using `${{ github.event.repository.name }}`, so it works with any repository name.

## GitHub Pages URL

After deployment, your app will be available at:

```
https://YOUR_USERNAME.github.io/jitsi-meet-demo/
```

Replace `YOUR_USERNAME` with your GitHub username and `jitsi-meet-demo` with your actual repository name.

## How to Test a Meeting

### Solo test

1. Open the app (locally or on GitHub Pages)
2. Click **Create Meeting**
3. Enter your name (optional) and click **Enter Meeting**
4. Allow camera/microphone access when prompted
5. You should see yourself in the Jitsi meeting

### Multi-user test

1. Create a meeting and copy the URL from your browser's address bar
2. Open the same URL in a **different browser** or **incognito window**
3. Both windows should join the same meeting room
4. You can also share the URL with someone else on a different device

### Testing on GitHub Pages

The meeting URL format is:

```
https://YOUR_USERNAME.github.io/jitsi-meet-demo/meeting/?room=YOUR_ROOM_NAME
```

Share this URL with another person to test the video call.

## Troubleshooting

### Meeting doesn't load
- Check your internet connection
- Make sure your browser allows access to `meet.jit.si`
- Some corporate networks/VPNs may block Jitsi
- Try a different browser (Chrome, Firefox, Edge recommended)

### Camera/microphone not working
- Check browser permissions (click the lock icon in the address bar)
- Make sure no other app is using your camera/microphone
- Try refreshing the page

### Build fails with "generateStaticParams" error
- This project uses query-parameter-based routing (`/meeting/?room=xyz`) instead of dynamic path segments
- The build should work out of the box; if you see this error, make sure you haven't added dynamic `[param]` routes

### GitHub Pages shows 404
- Make sure GitHub Pages source is set to **GitHub Actions** (not "Deploy from a branch")
- Check that the workflow completed successfully in the Actions tab
- The `NEXT_PUBLIC_BASE_PATH` must match your repository name

### Assets not loading on GitHub Pages
- The `next.config.ts` sets both `basePath` and `assetPrefix` to the repository subpath
- If you rename your repository, push a new commit to trigger a rebuild

## Limitations

- **Free Jitsi server**: `meet.jit.si` is a free public service with no SLA or guaranteed uptime
- **No persistence**: Meeting rooms are ephemeral — there is no recording, history, or room persistence
- **No authentication**: Anyone with the room name can join the meeting
- **No backend**: This is a frontend-only demo — there is no server-side logic
- **Browser support**: Requires a modern browser with WebRTC support
- **Static routing**: Uses query parameters (`?room=xyz`) instead of clean path segments due to static hosting constraints

## Future Improvements

- Room password protection
- Meeting scheduling / calendar integration
- Screen recording (using Jitsi's built-in recording if self-hosted)
- Custom Jitsi server support (configurable domain)
- Meeting history (localStorage)
- Shareable invite links with copy-to-clipboard
- Dark/light theme toggle
- End-to-end encryption toggle

## License

MIT
