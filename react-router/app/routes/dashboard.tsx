import { Link } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import useAxiosSecure from "../Hooks/useAxiosSecure";

export default function Dashboard() {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    const fetchVideos = async () => {
        try {
            const response = await axiosSecure.get('/videos');
            setVideos(response.data.data || []);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchVideos();
    }, []);

    // Auto-refresh for processing videos
    useEffect(() => {
        const hasProcessingVideos = videos.some((v: any) => v.status === 'processing');

        if (hasProcessingVideos) {
            const interval = setInterval(() => {
                fetchVideos();
            }, 5000); // Poll every 5 seconds

            return () => clearInterval(interval);
        }
    }, [videos]);

    const totalVideos = videos.length;
    const analyzedVideos = videos.filter((v: any) => v.status === 'completed').length;
    const processingVideos = videos.filter((v: any) => v.status === 'processing').length;
    const failedVideos = videos.filter((v: any) => v.status === 'failed').length;

    const recentVideos = [...videos]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const stats = [
        { label: "Total Videos", value: totalVideos.toString(), icon: "🎬", color: "border-gray-800" },
        { label: "Analyzed", value: analyzedVideos.toString(), icon: "✅", color: "border-cyan-500" },
        { label: "Processing", value: processingVideos.toString(), icon: "⚙️", color: "border-yellow-500" },
        { label: "Failed", value: failedVideos.toString(), icon: "❌", color: "border-red-500" },
    ];

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'completed':
                return { label: 'COMPLETED', className: 'bg-green-900/30 text-green-400 border-gray-800' };
            case 'processing':
                return { label: 'PROCESSING', className: 'bg-yellow-900/30 text-yellow-400 border-yellow-500 animate-pulse' };
            case 'failed':
                return { label: 'FAILED', className: 'bg-red-900/30 text-red-400 border-red-500' };
            default:
                return { label: status.toUpperCase(), className: 'bg-gray-900/30 text-gray-400 border-gray-500' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-green-400 font-mono text-xl animate-pulse">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-green-400 font-mono">
                        <span className="text-cyan-400">&gt;</span> WELCOME, {user?.name?.toUpperCase() || 'USER'} 👋
                    </h1>
                    <p className="text-cyan-400 mt-2 font-mono text-sm">// System status and activity overview</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className={`bg-black/80 border-2 ${stat.color} rounded-lg p-6 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-cyan-400 text-sm font-mono">{stat.label}</p>
                                    <p className="text-3xl font-bold text-green-400 mt-2 font-mono">{stat.value}</p>
                                </div>
                                <div className="text-3xl">
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-black/80 border-2 border-gray-800 rounded-lg shadow-[0_0_30px_rgba(0,255,0,0.2)] p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-green-400 font-mono">[ QUICK ACTIONS ]</h2>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/videos" className="bg-green-600 text-black px-6 py-3 rounded font-semibold hover:bg-green-500 transition border border-green-400 font-mono">
                            📤 UPLOAD VIDEO
                        </Link>
                        <Link to="/videos" className="bg-transparent border-2 border-cyan-500 text-cyan-400 px-6 py-3 rounded font-semibold hover:bg-cyan-500/10 transition font-mono">
                            📊 VIEW ALL VIDEOS
                        </Link>
                    </div>
                </div>

                {/* Recent Videos */}
                <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-green-400 font-mono">[ RECENT VIDEOS ]</h2>
                        <Link to="/videos" className="text-cyan-400 hover:text-cyan-300 font-medium font-mono">
                            VIEW ALL →
                        </Link>
                    </div>
                    {recentVideos.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎬</div>
                            <p className="text-cyan-400 font-mono text-lg">No videos yet</p>
                            <p className="text-gray-500 font-mono text-sm mt-2">Upload your first video to get started</p>
                            <Link
                                to="/videos"
                                className="mt-4 inline-block bg-green-600 text-black px-6 py-3 rounded font-semibold hover:bg-green-500 transition border border-green-400 font-mono"
                            >
                                📤 UPLOAD VIDEO
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentVideos.map((video: any) => {
                                const statusInfo = getStatusInfo(video.status);
                                return (
                                    <Link
                                        key={video._id}
                                        to={`/videos/${video._id}`}
                                        className="flex items-center justify-between p-4 border border-gray-800/30 rounded-lg hover:border-gray-800 hover:bg-green-500/5 transition"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-linear-to-br from-green-600 to-cyan-600 rounded flex items-center justify-center text-white text-xl border border-green-400">
                                                {video.status === 'processing' ? '⏳' : video.status === 'failed' ? '❌' : '🎥'}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-green-400 font-mono">{video.caption || 'Untitled Video'}</h3>
                                                <p className="text-sm text-cyan-400 font-mono">
                                                    {new Date(video.createdAt).toLocaleDateString()} •
                                                    {new Date(video.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded border text-sm font-medium font-mono ${statusInfo.className}`}>
                                            {statusInfo.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
