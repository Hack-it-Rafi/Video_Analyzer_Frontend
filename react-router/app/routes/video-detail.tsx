import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";

export default function VideoDetail() {
    const { id } = useParams();
    const [video, setVideo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportType, setReportType] = useState<'summary' | 'workflow'>('summary');
    const [report, setReport] = useState<string>('');
    const [generatingReport, setGeneratingReport] = useState(false);
    const axiosSecure = useAxiosSecure();

    const getVideoStreamUrl = (fileUrl: string) => {
        const fileName = fileUrl.split('/').pop();
        return `http://localhost:3000/api/v1/videos/file/${fileName}`;
    };

    const fetchVideo = async () => {
        try {
            const response = await axiosSecure.get(`/videos/${id}`);
            setVideo(response.data.data);
        } catch (error) {
            console.error('Error fetching video:', error);
        } finally {
            setLoading(false);
        }
    };

    const parseTimeToSeconds = (timeRange: string): number => {
        // timeRange format: "0s-3s" or "3s-6s"
        const startTime = timeRange.split('-')[0];
        return parseInt(startTime.replace('s', ''));
    };

    const seekToTime = (timeRange: string) => {
        if (videoRef) {
            const seconds = parseTimeToSeconds(timeRange);
            videoRef.currentTime = seconds;
            videoRef.play();

            videoRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Generate AI report
    const handleGenerateReport = async (type: 'summary' | 'workflow') => {
        setReportType(type);
        setGeneratingReport(true);
        setReport('');
        setShowReportModal(true);

        try {
            const response = await axiosSecure.get(`/videos/${id}/report?reportType=${type}`);
            setReport(response.data.data.report);
        } catch (error) {
            console.error('Error generating report:', error);
            setReport('Failed to generate report. Please try again.');
        } finally {
            setGeneratingReport(false);
        }
    };

    // Download report as text file
    const downloadReport = () => {
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `video-report-${reportType}-${id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        fetchVideo();
    }, [id]);

    useEffect(() => {
        if (video?.status === 'processing') {
            const interval = setInterval(() => {
                fetchVideo();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [video?.status]);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-green-400 font-mono text-xl animate-pulse">Loading video...</div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-red-400 font-mono text-lg">Video not found</p>
                    <Link to="/videos" className="text-cyan-400 hover:text-cyan-300 font-mono mt-4 inline-block">
                        &lt;- Back to videos
                    </Link>
                </div>
            </div>
        );
    }

    const prediction = video.prediction ? JSON.parse(video.prediction) : null;

    const formatPredictionForDisplay = (pred: any) => {
        if (!pred) return null;

        if (pred.error) {
            return { error: pred };
        }

        if (pred.predictions && Array.isArray(pred.predictions)) {
            return {
                predictions: pred.predictions,
                summary: pred.summary,
                videoInfo: pred.video_info
            };
        }

        return pred;
    };

    const formattedPrediction = formatPredictionForDisplay(prediction);

    const getStatusBadge = () => {
        switch (video.status) {
            case 'completed':
                return <span className="px-3 py-1 bg-green-900/30 text-green-400 border border-green-500 rounded text-sm font-medium font-mono">✓ COMPLETED</span>;
            case 'processing':
                return <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-500 rounded text-sm font-medium font-mono animate-pulse">⏳ PROCESSING</span>;
            case 'failed':
                return <span className="px-3 py-1 bg-red-900/30 text-red-400 border border-red-500 rounded text-sm font-medium font-mono">❌ FAILED</span>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
            <div className="container mx-auto px-4 py-8">

                <div className="mb-6 flex items-center justify-between">
                    <Link to="/videos" className="text-cyan-400 hover:text-cyan-300 font-medium font-mono">
                        &lt;- BACK TO VIDEOS
                    </Link>
                    {getStatusBadge()}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2">
                        <div className="bg-black/80 border-2 border-gray-800 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.2)]">
                            {/* Video Player */}
                            {video.status === 'completed' ? (
                                <video
                                    className="w-full aspect-video bg-black"
                                    controls
                                    controlsList="nodownload"
                                    src={getVideoStreamUrl(video.fileUrl)}
                                    ref={(ref) => setVideoRef(ref)}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="aspect-video bg-linear-to-br from-green-900/30 to-cyan-900/30 flex items-center justify-center border-b-2 border-gray-800">
                                    <div className="text-center text-green-400">
                                        {video.status === 'processing' ? (
                                            <>
                                                <span className="text-8xl mb-4 block animate-pulse">⏳</span>
                                                <p className="text-xl font-semibold font-mono">[ PROCESSING VIDEO ]</p>
                                                <p className="text-sm mt-2 text-cyan-400 font-mono">// Please wait for analysis to complete</p>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-8xl mb-4 block">❌</span>
                                                <p className="text-xl font-semibold font-mono text-red-400">[ PROCESSING FAILED ]</p>
                                                <p className="text-sm mt-2 text-cyan-400 font-mono">// Video analysis encountered an error</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-green-400 mb-4 font-mono">{video.caption || 'Untitled Video'}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-cyan-400 font-mono">
                                    <span>📅 {new Date(video.createdAt).toLocaleDateString()}</span>
                                    <span>🆔 {video._id}</span>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <a
                                        href={video.status === 'completed' ? getVideoStreamUrl(video.fileUrl) : '#'}
                                        download={video.caption || 'video.mp4'}
                                        className={`px-4 py-2 rounded transition border font-mono ${video.status === 'completed'
                                            ? 'bg-green-600 text-black hover:bg-green-500 border-green-400 cursor-pointer'
                                            : 'bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed'
                                            }`}
                                        onClick={(e) => video.status !== 'completed' && e.preventDefault()}
                                    >
                                        📥 DOWNLOAD
                                    </a>
                                    <button className="px-4 py-2 bg-transparent border-2 border-red-500 text-red-400 rounded hover:bg-red-500/10 transition font-mono">
                                        🗑️ DELETE
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Prediction Results */}
                        {video.status === 'completed' && formattedPrediction && !formattedPrediction.error && (
                            <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6 mt-6">
                                <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">[ PREDICTION RESULTS ]</h2>

                                {/* Summary Section */}
                                {/* {formattedPrediction.summary && (
                                    <div className="bg-gray-900/50 border border-gray-800/30 rounded p-4 mb-4">
                                        <h3 className="text-lg font-semibold text-cyan-400 mb-3 font-mono">Summary</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <p className="text-gray-400 font-mono">Total Chunks:</p>
                                                <p className="text-green-400 font-bold font-mono">{formattedPrediction.summary.total_chunks}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 font-mono">Most Common App:</p>
                                                <p className="text-green-400 font-bold font-mono">{formattedPrediction.summary.most_common_app}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 font-mono">Most Common Action:</p>
                                                <p className="text-green-400 font-bold font-mono">{formattedPrediction.summary.most_common_action}</p>
                                            </div>
                                        </div>
                                    </div>
                                )} */}

                                {/* Video Info */}
                                {formattedPrediction.videoInfo && (
                                    <div className="bg-gray-900/50 border border-gray-800/30 rounded p-4 mb-4">
                                        <h3 className="text-lg font-semibold text-cyan-400 mb-3 font-mono">Video Info</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <p className="text-gray-400 font-mono">Duration:</p>
                                                <p className="text-green-400 font-bold font-mono">
                                                    {Math.floor(formattedPrediction.videoInfo.duration_seconds / 60)}m {Math.floor(formattedPrediction.videoInfo.duration_seconds % 60)}s
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 font-mono">Chunks:</p>
                                                <p className="text-green-400 font-bold font-mono">{formattedPrediction.videoInfo.num_chunks}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 font-mono">Chunk Duration:</p>
                                                <p className="text-green-400 font-bold font-mono">{formattedPrediction.videoInfo.chunk_duration}s</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Predictions Table */}
                                {formattedPrediction.predictions && (
                                    <div className="bg-gray-900/50 border border-gray-800/30 rounded overflow-hidden">
                                        <h3 className="text-lg font-semibold text-cyan-400 p-4 border-b border-gray-800/30 font-mono">
                                            Activity Timeline ({formattedPrediction.predictions.length} predictions)
                                        </h3>
                                        <div className="max-h-96 overflow-y-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-800/50 sticky top-0">
                                                    <tr className="border-b border-gray-800/30">
                                                        <th className="text-left py-3 px-4 text-cyan-400 font-mono font-semibold">#</th>
                                                        <th className="text-left py-3 px-4 text-cyan-400 font-mono font-semibold">Time Range</th>
                                                        <th className="text-left py-3 px-4 text-cyan-400 font-mono font-semibold">Action</th>
                                                        <th className="text-center py-3 px-4 text-cyan-400 font-mono font-semibold">Action Conf.</th>
                                                        <th className="text-left py-3 px-4 text-cyan-400 font-mono font-semibold">App</th>
                                                        <th className="text-center py-3 px-4 text-cyan-400 font-mono font-semibold">App Conf.</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formattedPrediction.predictions.map((pred: any, idx: number) => (
                                                        <tr key={idx} className="border-b border-gray-800/20 hover:bg-green-500/5 transition">
                                                            <td className="py-2 px-4 text-gray-400 font-mono">{idx + 1}</td>
                                                            <td className="py-2 px-4 text-green-400 font-mono">
                                                                <button
                                                                    className="underline hover:text-cyan-400"
                                                                    onClick={() => seekToTime(pred.time_range)}
                                                                >
                                                                    {pred.time_range}
                                                                </button>
                                                            </td>
                                                            <td className="py-2 px-4 font-mono">
                                                                <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs border border-green-500/30">
                                                                    {pred.action}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 px-4 text-center font-mono">
                                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${pred.action_confidence >= 0.7 ? 'bg-green-900/30 text-green-400 border border-green-500/30' :
                                                                    pred.action_confidence >= 0.4 ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' :
                                                                        'bg-red-900/30 text-red-400 border border-red-500/30'
                                                                    }`}>
                                                                    {(pred.action_confidence * 100).toFixed(1)}%
                                                                </span>
                                                            </td>
                                                            <td className="py-2 px-4 font-mono">
                                                                <span className="px-2 py-1 bg-cyan-900/30 text-cyan-400 rounded text-xs border border-cyan-500/30">
                                                                    {pred.app}
                                                                </span>
                                                            </td>

                                                            <td className="py-2 px-4 text-center font-mono">
                                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${pred.app_confidence >= 0.7 ? 'bg-green-900/30 text-green-400 border border-green-500/30' :
                                                                    pred.app_confidence >= 0.4 ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' :
                                                                        'bg-red-900/30 text-red-400 border border-red-500/30'
                                                                    }`}>
                                                                    {(pred.app_confidence * 100).toFixed(1)}%
                                                                </span>
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error in Prediction Results */}
                        {video.status === 'failed' && formattedPrediction?.error && (
                            <div className="bg-red-900/20 border-2 border-red-500/50 rounded-lg p-6 mt-6">
                                <h2 className="text-xl font-bold text-red-400 mb-2 font-mono">❌ Processing Error Details</h2>
                                <div className="bg-gray-900/50 border border-gray-800/30 rounded p-4 mt-3">
                                    <pre className="text-red-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                                        {JSON.stringify(formattedPrediction.error, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Processing Message */}
                        {video.status === 'processing' && (
                            <div className="bg-yellow-900/20 border-2 border-yellow-500/50 rounded-lg p-6 mt-6">
                                <h2 className="text-xl font-bold text-yellow-400 mb-2 font-mono">⏳ Processing in Progress</h2>
                                <p className="text-gray-400 font-mono text-sm">
                                    Your video is being analyzed by our AI system. This page will automatically update when the analysis is complete.
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-cyan-400 font-mono text-sm">
                                    <span className="animate-pulse">●</span>
                                    <span>Auto-refreshing every 5 seconds...</span>
                                </div>
                            </div>
                        )}

                        {/* Failed Message */}
                        {video.status === 'failed' && (
                            <div className="bg-red-900/20 border-2 border-red-500/50 rounded-lg p-6 mt-6">
                                <h2 className="text-xl font-bold text-red-400 mb-2 font-mono">❌ Processing Failed</h2>
                                <p className="text-gray-400 font-mono text-sm">
                                    The video analysis encountered an error. Please try uploading the video again or contact support if the problem persists.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Video Info Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">[ VIDEO INFO ]</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-cyan-400 font-mono">Status</p>
                                    <p className="font-semibold text-green-400 font-mono">{video.status.toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-cyan-400 font-mono">Upload Date</p>
                                    <p className="font-semibold text-green-400 font-mono">
                                        {new Date(video.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-cyan-400 font-mono">Last Updated</p>
                                    <p className="font-semibold text-green-400 font-mono">
                                        {new Date(video.updatedAt).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-cyan-400 font-mono">File URL</p>
                                    <p className="font-semibold text-green-400 font-mono text-xs break-all">
                                        {video.fileUrl}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Status */}
                        <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">[ ANALYSIS STATUS ]</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-cyan-400 font-mono text-sm">Upload</span>
                                    <span className="text-green-400 font-mono">✓</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-cyan-400 font-mono text-sm">Storage</span>
                                    <span className="text-green-400 font-mono">✓</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-cyan-400 font-mono text-sm">AI Processing</span>
                                    <span className={`font-mono ${video.status === 'completed' ? 'text-green-400' :
                                        video.status === 'processing' ? 'text-yellow-400 animate-pulse' :
                                            'text-red-400'
                                        }`}>
                                        {video.status === 'completed' ? '✓' :
                                            video.status === 'processing' ? '⏳' : '✗'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* AI Report Generation */}
                        {video.status === 'completed' && (
                            <div className="bg-black/80 border-2 border-gray-800 rounded-lg p-6">
                                <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">[ AI REPORT ]</h2>
                                <p className="text-cyan-400 font-mono text-sm mb-4">
                                    Generate a human-readable AI report from the analysis data
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleGenerateReport('summary')}
                                        className="w-full px-4 py-3 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition font-mono text-sm flex items-center justify-center gap-2"
                                    >
                                        <span>📄</span>
                                        <span>SUMMARY REPORT</span>
                                    </button>
                                    <button
                                        onClick={() => handleGenerateReport('workflow')}
                                        className="w-full px-4 py-3 bg-green-600 text-black rounded hover:bg-green-500 transition font-mono text-sm flex items-center justify-center gap-2"
                                    >
                                        <span>📊</span>
                                        <span>WORKFLOW REPORT</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Report Modal */}
                {showReportModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 border-2 border-cyan-500 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-green-400 font-mono">
                                    [ AI {reportType.toUpperCase()} REPORT ]
                                </h2>
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="text-cyan-400 hover:text-cyan-300 text-2xl font-bold"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1">
                                {generatingReport ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="text-6xl mb-4 animate-pulse">🤖</div>
                                        <p className="text-cyan-400 font-mono text-lg">Generating AI Report...</p>
                                        <p className="text-gray-400 font-mono text-sm mt-2">This may take 10-30 seconds</p>
                                    </div>
                                ) : (
                                    <div className="bg-black/50 border border-gray-800 rounded p-6">
                                        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                                            {report}
                                        </pre>
                                    </div>
                                )}
                            </div>

                            {!generatingReport && report && (
                                <div className="p-6 border-t border-gray-800 flex gap-3">
                                    <button
                                        onClick={downloadReport}
                                        className="px-6 py-3 bg-green-600 text-black rounded hover:bg-green-500 transition font-mono flex items-center gap-2"
                                    >
                                        <span>📥</span>
                                        <span>DOWNLOAD REPORT</span>
                                    </button>
                                    <button
                                        onClick={() => setShowReportModal(false)}
                                        className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-500 transition font-mono"
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
