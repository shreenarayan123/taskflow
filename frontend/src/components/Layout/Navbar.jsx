import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Home, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  User,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowMobileMenu(false);
    };

    if (showUserMenu || showMobileMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu, showMobileMenu]);
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-lg' 
          : 'bg-white/95 backdrop-blur-sm border-b border-gray-200/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex items-center">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-3 text-blue-600 font-bold text-xl hover:text-blue-700 transition-colors cursor-pointer group"
              >
                <CheckCircle size={28} className="transform group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-gradient font-extrabold tracking-tight">
                  {import.meta.env.VITE_APP_NAME || 'TaskFlow'}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink 
                to="/dashboard" 
                icon={Home} 
                label="Dashboard" 
                isActive={isActiveRoute('/dashboard')}
              />
              <NavLink 
                to="/tasks" 
                icon={FileText} 
                label="Tasks" 
                isActive={isActiveRoute('/tasks')}
              />
            </div>

            {/* Right side - Desktop */}
            <div className="hidden md:flex items-center space-x-4">

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200 cursor-pointer group"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-shadow">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <div className="py-2">
                      <DropdownItem icon={User} label="Profile" />
                      <DropdownItem icon={Settings} label="Settings" />
                    </div>
                    
                    <div className="border-t border-gray-100 pt-2">
                      <button 
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileMenu(!showMobileMenu);
                }}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm animate-slide-in-right">
            <div className="px-4 py-4 space-y-2">
              <MobileNavLink 
                to="/dashboard" 
                icon={Home} 
                label="Dashboard" 
                isActive={isActiveRoute('/dashboard')}
                onClick={() => setShowMobileMenu(false)}
              />
              <MobileNavLink 
                to="/tasks" 
                icon={FileText} 
                label="Tasks" 
                isActive={isActiveRoute('/tasks')}
                onClick={() => setShowMobileMenu(false)}
              />
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <button 
                  className="w-full flex items-center space-x-3 px-3 py-2 mt-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay */}
      {(showUserMenu || showMobileMenu) && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm cursor-pointer"
          onClick={() => {
            setShowUserMenu(false);
            setShowMobileMenu(false);
          }}
        />
      )}
    </>
  );
};

// NavLink Component for Desktop
const NavLink = ({ to, icon: Icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
      isActive
        ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200'
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

// MobileNavLink Component
const MobileNavLink = ({ to, icon: Icon, label, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors cursor-pointer ${
      isActive
        ? 'text-blue-600 bg-blue-50 border border-blue-200'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

// DropdownItem Component
const DropdownItem = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
  >
    <Icon size={16} />
    <span>{label}</span>
  </button>
);

export default Navbar;