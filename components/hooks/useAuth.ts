
import { useContext } from "react";
import type{ contextType } from "../../context/authcontext/AuthContext";
import AuthContext from "../../context/authcontext/AuthContext";

const useAuth = (): contextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};

export default useAuth;