import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import ProfileModal from './ProfileModal';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.user-profile-dropdown')) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showDropdown]);

  // Handle keyboard accessibility
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setShowDropdown((prev) => !prev);
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  return (
    <div className="relative user-profile-dropdown">
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        onKeyDown={handleKeyPress}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
        aria-haspopup="true"
        aria-expanded={showDropdown}
      >
        {user?.picture ? (
          <img
            src={user.picture}
            alt={`${user?.name || 'User'}'s Profile`}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <FaUser className="text-white" />
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">
          {user?.name || user?.email}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 transition-all duration-200">
          <button
            onClick={() => {
              setShowProfileModal(true);
              setShowDropdown(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            <FaCog className="mr-2" />
            Profile Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            <FaSignOutAlt className="mr-2" />
            Sign out
          </button>
        </div>
      )}

      {showProfileModal && (
        <ProfileModal
          onClose={() => {
            setShowProfileModal(false);
          }}
        />
      )}
    </div>
  );
}
