import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const Login = () => {
    const [success, setSuccess] = useState("");
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { signIn } = context;
    const navigate = useNavigate();

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        signIn(email, password)
            .then(() => {
                const myUser = { email };
                setSuccess("Login success");
                Swal.fire({
                    title: "Login Successful!",
                    text: "Enjoy Exploring!",
                    icon: "success",
                    confirmButtonText: "Continue",
                    background: "#000",
                    color: "#00ff00",
                    confirmButtonColor: "#00ff00",
                });
                axios
                    .post("http://localhost:3000/api/v1/jwt", myUser, {
                        withCredentials: true,
                    })
                    .then((res) => {
                        if (res.data.success) {
                            navigate("/dashboard");
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        setSuccess(error.message);
                    });
            })
            .catch((error) => {
                console.error(error);
                setSuccess(error.message);
                Swal.fire({
                    title: "Login Failed!",
                    text: error.message,
                    icon: "error",
                    confirmButtonText: "Try Again",
                    background: "#000",
                    color: "#ff0000",
                    confirmButtonColor: "#ff0000",
                });
            });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.05),transparent_50%)] pointer-events-none"></div>

            <div className="bg-black/90 border-2 border-green-500 rounded-lg shadow-[0_0_30px_rgba(0,255,0,0.3)] p-8 w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-green-400 mb-2 font-mono">
                        <span className="text-cyan-400">&gt;_</span> VIDEO ANALYZER
                    </h1>
                    <p className="text-cyan-400 font-mono text-sm">[ AUTHENTICATION REQUIRED ]</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    {success && (
                        <div className={`border px-4 py-3 rounded font-mono text-sm ${success.includes("success")
                            ? "bg-green-900/50 border-green-500 text-green-400"
                            : "bg-red-900/50 border-red-500 text-red-400"
                            }`}>
                            <span className={success.includes("success") ? "text-green-500" : "text-red-500"}>
                                {success.includes("success") ? "SUCCESS:" : "ERROR:"}
                            </span> {success}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-green-400 mb-2 font-mono">
                            &gt; EMAIL_ADDRESS:
                        </label>
                        <input
                            type="email"
                            placeholder="user@system.io"
                            name="email"
                            id="email"
                            className="w-full px-4 py-3 bg-black border border-green-500/50 rounded text-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition font-mono placeholder-green-700"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-green-400 mb-2 font-mono">
                            &gt; PASSWORD:
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            name="password"
                            id="password"
                            className="w-full px-4 py-3 bg-black border border-green-500/50 rounded text-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition font-mono placeholder-green-700"
                            required
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-black py-3 rounded font-semibold hover:bg-green-500 transition shadow-[0_0_20px_rgba(0,255,0,0.5)] border border-green-400 font-mono"
                        >
                            [ GRANT ACCESS ]
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-cyan-400 font-mono text-sm">
                        Need access credentials?{" "}
                        <Link to="/signup" className="text-green-400 hover:text-green-300 font-medium hover:underline">
                            [ REQUEST SIGNUP ]
                        </Link>
                    </p>
                </div>

                <div className="mt-6 text-center text-sm text-cyan-400 font-mono">
                    <Link to="/" className="text-green-400 hover:text-green-300 font-medium hover:underline">
                        &lt;- RETURN TO HOME
                    </Link>
                </div>

                <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded">
                    <p className="text-xs text-green-400 font-mono">
                        <span className="text-cyan-400">[DEMO]</span> Use your registered email and password
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
