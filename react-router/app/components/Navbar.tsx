import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="bg-black border-b-2 border-gray-800 shadow-[0_4px_20px_rgba(0,255,0,0.2)]">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-xl font-bold text-green-400 hover:text-green-300 transition font-mono">
                            <span className="text-cyan-400">&gt;_</span> VIDEO ANALYZER
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            <Link
                                to="/dashboard"
                                className="px-3 py-2 rounded text-green-400 hover:bg-green-500/10 border border-transparent hover:border-gray-800 transition font-mono"
                            >
                                DASHBOARD
                            </Link>
                            <Link
                                to="/videos"
                                className="px-3 py-2 rounded text-green-400 hover:bg-green-500/10 border border-transparent hover:border-gray-800 transition font-mono"
                            >
                                VIDEOS
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="hidden md:inline text-sm text-cyan-400 font-mono">
                            USER: {user?.name?.toUpperCase()}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-transparent border-2 border-gray-800 text-green-400 rounded hover:bg-green-500/10 transition font-mono"
                        >
                            LOGOUT
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
