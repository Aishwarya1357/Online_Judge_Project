

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice.js';
import { 
  BellIcon, 
  UserCircleIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="glass-effect shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="page-header text-2xl">Neocode</h1>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200">
              <BellIcon className="h-6 w-6" />
            </button>

            <div className="relative">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;