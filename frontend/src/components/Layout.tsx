import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { LogoutModal } from './LogoutModal';

function Layout() {
  const { user } = useAuth();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 text-white px-8 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-8">
          <div className="text-2xl font-bold">Booking Platform</div>
          <div className="flex gap-8 flex-1 justify-center">
            <Link
              to="/resources"
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isActive('/resources')
                  ? 'bg-white bg-opacity-20'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Resources
            </Link>
            <Link
              to="/bookings"
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isActive('/bookings')
                  ? 'bg-white bg-opacity-20'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Bookings
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{user?.email}</span>
            <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">
              {user?.role}
            </span>
            <Button
              onClick={() => setShowLogoutModal(true)}
              variant="danger"
              className="py-2 px-4 text-sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </div>
  );
}

export default Layout;
