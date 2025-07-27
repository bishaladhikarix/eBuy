import React from 'react';
import useAuth from '../components/hooks/useAuth';
import Lamo from '../components/auth/Lamo';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { Loggedin } = useAuth();

  // If user is not logged in, show login/signup page
  if (!Loggedin) {
    return <Lamo />;
  }

  // If user is logged in, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
