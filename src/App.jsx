import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import UserProfile from './components/UserProfile';
import { useState, useEffect } from 'react';
import './index.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAddContact, setShowAddContact] = useState(false);

  // Check if we are on login or signup page
  const isLoginPage = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    // If logged in, redirect from login/signup to contacts page
    if (user && isLoginPage) {
      navigate("/contacts", { replace: true });
    }
  }, [user, isLoginPage, navigate]);

  useEffect(() => {
    // Prevent navigation to login/signup using back button
    if (user && (location.pathname === "/login" || location.pathname === "/signup")) {
      navigate("/contacts", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Render nav only if the user is logged in and not on login/signup pages */}
      {!isLoginPage && user && (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Contact Manager</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddContact(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors duration-200"
                >
                  Add Contact
                </button>
                <UserProfile />
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Add Contact Modal */}
      {!isLoginPage && showAddContact && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Add New Contact</h2>
            <ContactForm onClose={() => setShowAddContact(false)} />
          </div>
        </div>
      )}

      {/* Routes */}
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route
          path="/contacts"
          element={
            <PrivateRoute>
              <ContactList />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/contacts" />} />
      </Routes>
    </div>
  );
}

export default App;
