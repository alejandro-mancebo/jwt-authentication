import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
  const { auth }: any = useContext(AuthContext);
  useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out")
  console.log('useAuth auth:', auth)
  return useContext(AuthContext);
}

export default useAuth;