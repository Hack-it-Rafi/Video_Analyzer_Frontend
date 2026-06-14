import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        navigate("/dashboard");
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const success = await login(email, password);

        if (success) {
            navigate("/dashboard");
        } else {
            setError("Invalid email or password. Password must be at least 6 characters.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.05),transparent_50%)] pointer-events-none"></div>

            <div className="bg-black/90 border-2 border-gray-800 rounded-lg shadow-[0_0_30px_rgba(0,255,0,0.3)] p-8 w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-green-400 mb-2 font-mono">
                        <span className="text-cyan-400">&gt;_</span> VIDEO ANALYZER
                    </h1>
                    <p className="text-cyan-400 font-mono text-sm">[ AUTHENTICATION REQUIRED ]</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 rounded font-mono text-sm">
                            <span className="text-red-500">ERROR:</span> {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-green-400 mb-2 font-mono">
                            &gt; EMAIL_ADDRESS:
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-black border border-gray-800/50 rounded text-green-400 focus:ring-2 focus:ring-green-500 focus:border-gray-800 outline-none transition font-mono placeholder-green-700"
                            placeholder="user@system.io"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-green-400 mb-2 font-mono">
                            &gt; PASSWORD:
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3 bg-black border border-gray-800/50 rounded text-green-400 focus:ring-2 focus:ring-green-500 focus:border-gray-800 outline-none transition font-mono placeholder-green-700"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-black py-3 rounded font-semibold hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,255,0,0.5)] border border-green-400 font-mono"
                    >
                        {loading ? "[ AUTHENTICATING... ]" : "[ GRANT ACCESS ]"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-cyan-400 font-mono">
                    <Link to="/" className="text-green-400 hover:text-green-300 font-medium hover:underline">
                        &lt;- RETURN TO HOME
                    </Link>
                </div>

                <div className="mt-6 p-4 bg-green-900/20 border border-gray-800/30 rounded">
                    <p className="text-xs text-green-400 font-mono">
                        <span className="text-cyan-400">[DEMO]</span> Use any email and password (6+ characters)
                    </p>
                </div>
            </div>
        </div>
    );
}
