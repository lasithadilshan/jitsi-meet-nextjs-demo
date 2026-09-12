import MeetingForm from "@/components/MeetingForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Logo / Brand */}
        <div className="mb-10 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-5 shadow-lg shadow-indigo-500/20">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
            Jitsi Meet Demo
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Free video meetings powered by Jitsi Meet.
            <br className="hidden sm:block" />
            No account required — just click and connect.
          </p>
        </div>

        {/* Meeting Form */}
        <div className="w-full animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <MeetingForm />
        </div>

        {/* How it Works */}
        <div className="mt-16 max-w-2xl w-full animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-center text-lg font-semibold text-white mb-6">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 font-bold mb-3 border border-indigo-500/20">
                1
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Create or Join</h3>
              <p className="text-slate-500 text-xs">
                Generate a new room or enter an existing room name.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 font-bold mb-3 border border-indigo-500/20">
                2
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Enter Your Name</h3>
              <p className="text-slate-500 text-xs">
                Optionally enter a display name before joining.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 font-bold mb-3 border border-indigo-500/20">
                3
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Start Talking</h3>
              <p className="text-slate-500 text-xs">
                Your meeting starts instantly — share the link to invite others.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-600 text-xs border-t border-slate-800/50">
        Powered by{" "}
        <a
          href="https://jitsi.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-indigo-400 transition-colors"
        >
          Jitsi Meet
        </a>
        {" · "}
        Built with{" "}
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-indigo-400 transition-colors"
        >
          Next.js
        </a>
      </footer>
    </main>
  );
}
