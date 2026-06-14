import axios, { type AxiosInstance } from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

const axiosSecure: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

const useAxiosSecure = (): AxiosInstance => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAxiosSecure must be used within an AuthProvider");
  }

  const { logOut } = context;
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      (error) => {
        console.log("error tracked in interceptor", error.response);
        if (error.response?.status === 401 || error.response?.status === 403) {
          logOut()
            .then(() => {
              navigate("/login");
            })
            .catch((err) => console.log(err));
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
