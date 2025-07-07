import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const isLoggedIn = localStorage.getItem('username'); // or token
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default AuthGuard;