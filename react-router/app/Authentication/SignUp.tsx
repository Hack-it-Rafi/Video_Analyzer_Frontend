import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const SignUp = () => {
    const [registerError, setRegisterError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { createUser, updateUser } = context;

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value;
        const photo = (form.elements.namedItem("photo") as HTMLInputElement).value;
        const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const role = "user";

        setRegisterError("");
        setSuccess("");

        const specialCharRegex = /[!@#$%^&*()_+{}\]:;<>,.?~\\/-]/;
        if (password.length < 6) {
            setRegisterError("Password should be at least 6 characters or longer");
            return;
        } else if (!/[A-Z]/.test(password)) {
            setRegisterError("Your password should have at least one upper case characters.");
            return;
        } else if (!specialCharRegex.test(password)) {
            setRegisterError("Your password should have at least one special characters.");
            return;
        }

        createUser(email, password)
            .then(() => {
                axiosSecure
                    .post("http://localhost:3000/api/v1/user/create-user", {
                        name,
                        email,
                        phone,
                        photo,
                        password,
                        role,
                    })
                    .then((res: any) => {
                        console.log(res);
                        updateUser(name, photo)
                            .then(() => {
                                console.log("Profile updated");
                            })
                            .catch((error: any) => {
                                setRegisterError(error.code);
                            });
                        Swal.fire({
                            title: "Success!",
                            text: "Registration successful",
                            icon: "success",
                            background: "#000",
                            color: "#00ff00",
                            confirmButtonColor: "#00ff00",
                        });
                        navigate("/login");
                    })
                    .catch((error: any) => {
                        Swal.fire({
                            title: "Error!",
                            text: "There was an error in registration.",
                            icon: "error",
                            background: "#000",
                            color: "#ff0000",
                            confirmButtonColor: "#ff0000",
                        });
                        setRegisterError(error.code);
                        console.error(error);
                    });
            })
            .catch((error: any) => {
                Swal.fire({
                    title: "Error!",
                    text: "There was an error in Firebase.",
                    icon: "error",
                    background: "#000",
                    color: "#ff0000",
                    confirmButtonColor: "#ff0000",
                });
                setRegisterError(error.code);
                console.error(error);
            });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.05),transparent_50%)] pointer-events-none"></div>

            <div className="bg-black/90 border-2 border-green-500 rounded-lg shadow-[0_0_30px_rgba(0,255,0,0.3)] p-8 w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-green-400 mb-2 font-mono">
                        <span className="text-cyan-400">&gt;_</span> CREATE ACCESS
                    </h1>
                    <p className="text-cyan-400 font-mono text-sm">[ NEW USER REGISTRATION ]</p>
                </div>

                <form className="space-y-4" onSubmit={handleRegister}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-green-400 mb-2 font-mono">
                            &gt; NAME:
                        </label>
                        <input
                            type="text"
                            placeholder="Your name"
                            name="name"
                            id="name"
                            className="w-full px-4 py-2 bg-black border border-green-500/50 rounded text-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition font-mono placeholder-green-700"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-green-400 mb-2 font-mono">
                            &gt; PHONE:
                        </label>
                        <input
                            type="text"
                            placeholder="Phone Number"
                            name="phone"
                            id="phone"
                            className="w-full px-4 py-2 bg-black border border-green-500/50 rounded text-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition font-mono placeholder-green-700"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="photo" className="block text-sm font-medium text-green-400 mb-2 font-mono">
                            &gt; PHOTO_URL:
                        </label>
                        <input
                            type="text"
                            placeholder="Photo URL"
                            name="photo"
                            id="photo"
                            className="w-full px-4 py-2 bg-black border border-green-500/50 rounded text-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition font-mono placeholder-green-700"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-green-400 mb-2 font-mono">
                            &gt; EMAIL:
                        </label>
                        <input
                            type="email"
                            placeholder="email@system.io"
                            name="email"
                            id="email"
                            className="w-full px-4 py-2 bg-black border border-green-500/50 rounded text-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition font-mono placeholder-green-700"
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
                            className="w-full px-4 py-2 bg-black border border-green-500/50 rounded text-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition font-mono placeholder-green-700"
                            required
                        />
                    </div>

                    {registerError && (
                        <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 rounded font-mono text-sm">
                            <span className="text-red-500">ERROR:</span> {registerError}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-900/50 border border-green-500 text-green-400 px-4 py-3 rounded font-mono text-sm">
                            <span className="text-green-500">SUCCESS:</span> {success}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-black py-3 rounded font-semibold hover:bg-green-500 transition shadow-[0_0_20px_rgba(0,255,0,0.5)] border border-green-400 font-mono"
                        >
                            [ REGISTER USER ]
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-cyan-400 font-mono text-sm">
                        Already have access?{" "}
                        <Link to="/login" className="text-green-400 hover:text-green-300 font-medium hover:underline">
                            [ LOGIN ]
                        </Link>
                    </p>
                </div>

                <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded">
                    <p className="text-xs text-green-400 font-mono">
                        <span className="text-cyan-400">[SECURITY]</span> Password requires: 6+ chars, 1 uppercase, 1 special char
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
