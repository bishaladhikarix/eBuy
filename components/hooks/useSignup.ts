


import { useContext } from "react";
console.log("1");
import type {ncont} from '../../context/ls/NotContext.ts';
import NotContext from "../../context/ls/NotContext.ts";

const useSignup = (): ncont => {
  const context = useContext(NotContext);
  if (!context) {
    throw new Error('useSignup must be used inside AuthProvider');
  }
  return context;
};

export default useSignup;