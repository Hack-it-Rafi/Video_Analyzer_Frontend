import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.05),transparent_50%)] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center text-green-400 mb-16">
          <h1 className="text-6xl font-bold mb-6 font-mono tracking-wider">
            <span className="text-green-500">&gt;_</span> VISUAL BEHAVIORAL PATTERN DETECTION
          </h1>
          <p className="text-2xl mb-4 text-cyan-400 font-mono">[ AI-POWERED WORKFLOW ANALYSIS ]</p>
          <p className="text-xl text-green-300 font-mono">// Track applications, detect actions, analyze workflows</p>
        </div>

        <div className="max-w-4xl mx-auto bg-black/80 border-2 border-gray-800 rounded-lg shadow-[0_0_30px_rgba(0,255,0,0.3)] p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center border border-cyan-500/30 p-6 rounded bg-gray-900/50 hover:border-cyan-500 transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2 text-green-400 font-mono">APP DETECTION</h3>
              <p className="text-gray-400 text-sm font-mono">Identify which applications were used</p>
            </div>
            <div className="text-center border border-cyan-500/30 p-6 rounded bg-gray-900/50 hover:border-cyan-500 transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2 text-green-400 font-mono">ACTION TRACKING</h3>
              <p className="text-gray-400 text-sm font-mono">Detect user actions and interactions</p>
            </div>
            <div className="text-center border border-cyan-500/30 p-6 rounded bg-gray-900/50 hover:border-cyan-500 transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2 text-green-400 font-mono">WORKFLOW ANALYSIS</h3>
              <p className="text-gray-400 text-sm font-mono">Generate AI reports on productivity</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-green-600 text-black rounded font-semibold text-lg hover:bg-green-500 transition shadow-[0_0_20px_rgba(0,255,0,0.5)] border border-green-400 font-mono"
              >
                [ ACCESS DASHBOARD ] →
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-green-600 text-black rounded font-semibold text-lg hover:bg-green-500 transition shadow-[0_0_20px_rgba(0,255,0,0.5)] border border-green-400 font-mono"
                >
                  [ GET STARTED ] →
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-transparent text-green-400 border-2 border-gray-800 rounded font-semibold text-lg hover:bg-green-500/10 transition font-mono"
                >
                  [ LOGIN ]
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-16 text-center text-green-400">
          <h2 className="text-3xl font-bold mb-8 font-mono text-cyan-400">== KEY FEATURES ==</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-black/60 border border-gray-800/30 backdrop-blur-sm rounded-lg p-6 hover:border-gray-800 transition-all hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]">
              <div className="text-3xl mb-3">🎥</div>
              <h3 className="font-semibold mb-2 text-green-400 font-mono">VIDEO UPLOAD</h3>
              <p className="text-sm text-gray-400 font-mono">Upload screen recordings via web or Telegram</p>
            </div>
            <div className="bg-black/60 border border-gray-800/30 backdrop-blur-sm rounded-lg p-6 hover:border-gray-800 transition-all hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold mb-2 text-green-400 font-mono">AI ANALYSIS</h3>
              <p className="text-sm text-gray-400 font-mono">Deep learning model detects activities</p>
            </div>
            <div className="bg-black/60 border border-gray-800/30 backdrop-blur-sm rounded-lg p-6 hover:border-gray-800 transition-all hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]">
              <div className="text-3xl mb-3">⏱️</div>
              <h3 className="font-semibold mb-2 text-green-400 font-mono">TIME TRACKING</h3>
              <p className="text-sm text-gray-400 font-mono">See exactly how time was spent</p>
            </div>
            <div className="bg-black/60 border border-gray-800/30 backdrop-blur-sm rounded-lg p-6 hover:border-gray-800 transition-all hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-semibold mb-2 text-green-400 font-mono">AI REPORTS</h3>
              <p className="text-sm text-gray-400 font-mono">Generate human-readable insights</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center font-mono text-cyan-400">== HOW IT WORKS ==</h2>
          <div className="space-y-6">
            <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6 flex items-start gap-4 hover:border-cyan-500/50 transition">
              <div className="text-3xl text-green-400 font-mono font-bold">1</div>
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-2 font-mono">Upload Your Recording</h3>
                <p className="text-gray-400 font-mono text-sm">
                  Upload screen recording videos in MP4 format through the web interface or send directly via Telegram bot
                </p>
              </div>
            </div>

            <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6 flex items-start gap-4 hover:border-cyan-500/50 transition">
              <div className="text-3xl text-green-400 font-mono font-bold">2</div>
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-2 font-mono">AI Analyzes Activity</h3>
                <p className="text-gray-400 font-mono text-sm">
                  Our AI model processes every 3-second chunk, detecting applications used (browser, editor, notepad) and actions performed
                </p>
              </div>
            </div>

            <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6 flex items-start gap-4 hover:border-cyan-500/50 transition">
              <div className="text-3xl text-green-400 font-mono font-bold">3</div>
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-2 font-mono">View Results & Generate Reports</h3>
                <p className="text-gray-400 font-mono text-sm">
                  Browse detailed timeline, click timestamps to jump to specific moments, and generate AI-powered workflow reports
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-green-900/20 to-cyan-900/20 border-2 border-cyan-500/50 rounded-lg p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono">Ready to analyze your screen activity?</h2>
          <p className="text-gray-400 font-mono mb-6">
            Upload your first video and get detailed insights on how time was spent
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-green-600 text-black rounded font-semibold text-lg hover:bg-green-500 transition shadow-[0_0_20px_rgba(0,255,0,0.5)] border border-green-400 font-mono"
            >
              [ CREATE ACCOUNT ] →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
