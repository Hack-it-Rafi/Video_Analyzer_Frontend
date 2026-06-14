import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    type User as FirebaseUser,
} from "firebase/auth";
import app from "../Firebase/firebase.config";
import axios from "axios";

const auth = getAuth(app);

interface User {
    id: string;
    email: string;
    name: string;
    photo?: string;
}

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signIn: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    logOut: () => Promise<void>;
    createUser: (email: string, password: string) => Promise<any>;
    updateUser: (name: string, photo: string) => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setLoading(false);
            setFirebaseUser(currentUser);

            if (currentUser) {
                const userEmail = currentUser.email || "";
                const loggedUser = { email: userEmail };

                // Set user state
                const userData: User = {
                    id: currentUser.uid,
                    email: currentUser.email || "",
                    name: currentUser.displayName || currentUser.email?.split("@")[0] || "",
                    photo: currentUser.photoURL || undefined,
                };
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));

                // Send JWT request
                axios
                    .post("http://localhost:3000/api/v1/jwt", loggedUser, {
                        withCredentials: true,
                    })
                    .then(() => {
                        console.log("JWT token obtained");
                    })
                    .catch((error) => {
                        console.error("JWT error:", error);
                    });
            } else {
                setUser(null);
                localStorage.removeItem("user");

                // Logout request
                axios
                    .post("http://localhost:3000/api/v1/logout", {}, {
                        withCredentials: true,
                    })
                    .then(() => {
                        console.log("Logged out from backend");
                    })
                    .catch((error) => {
                        console.error("Logout error:", error);
                    });
            }
        });

        return () => {
            unSubscribe();
        };
    }, []);

    const createUser = async (email: string, password: string) => {
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            return userCredential;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (name: string, photo: string) => {
        setLoading(true);
        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                    photoURL: photo,
                });
                // Update local user state
                setUser(prev => prev ? { ...prev, name, photo } : null);
            }
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            await signIn(email, password);
            return true;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await logOut();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                firebaseUser,
                loading,
                login,
                signIn,
                logout,
                logOut,
                createUser,
                updateUser,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export { AuthContext };
