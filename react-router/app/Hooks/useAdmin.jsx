import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Authentication/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["admin", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `http://loalhost:3000/api/v1/user?email=${user?.email}`
      );
      console.log(res.data.data[0].role);
      return res.data.data[0].role;
    },
    enabled: !!user?.email,
  });
  return [isAdmin, isLoading];
};
export default useAdmin;
