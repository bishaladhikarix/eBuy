


import { useContext } from "react";
console.log("1");
import type {ncont} from '../../context/loginorsignup/Noaccount.ts';
import Noaccount from "../../context/loginorsignup/Noaccount.ts";

const useSignup = (): ncont => {
  const context = useContext(Noaccount);
  if (!context) {
    throw new Error('useSignup must be used inside AuthProvider');
  }
  return context;
};

export default useSignup;