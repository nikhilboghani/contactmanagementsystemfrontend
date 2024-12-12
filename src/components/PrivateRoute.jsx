import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect authenticated users away from login/signup pages
    if (user && (location.pathname === "/login" || location.pathname === "/signup")) {
      navigate("/contacts", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
