/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { toast } from "react-toastify";
import useAxiosSecure from "../Hooks/useAxiosSecure";

// Protected Route Component
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-green-400 font-mono text-xl animate-pulse">
          <span className="text-cyan-400">&gt;_</span> Authenticating...
        </div>
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace={true} />;
};

const AdminRoute = ({ children }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [dbuser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`http://localhost:3000/api/v1/user?email=${user.email}`)
        .then((res) => {
          setDbUser(res.data.data[0]);
        })
        .catch((err) => {
          console.error("Failed to fetch user data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [axiosSecure, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && dbuser?.role === "admin") {
    return children;
  } else {
    toast("Admin Protected Route!");
    return <Navigate to="/" state={{ from: location }} replace={true} />;
  }
};

export default AdminRoute;
