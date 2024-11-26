import React from 'react';
import { Navigate} from 'react-router-dom';
import { Outlet } from 'react-router-dom';


function ProtectedScreen() {
  // Check user logs in based on check for session storage
  const isLoggedIn = sessionStorage.getItem("accessToken") ?? false;
  return isLoggedIn ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedScreen