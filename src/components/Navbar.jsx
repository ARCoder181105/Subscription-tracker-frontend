import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Logo from './Logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      addToast('Logged out successfully', 'success');
    } catch (error) {
      addToast('Error logging out', 'error');
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/add-subscription', label: 'Add Subscription', icon: Plus }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard">
              <Logo size="small" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  isActive(path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="py-2 space-y-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition duration-200 ${
                    isActive(path)
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-600 hover:text-red-600 transition duration-200 w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;