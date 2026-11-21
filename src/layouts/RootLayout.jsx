
import { Outlet } from 'react-router';
import Navbar from '../pages/Shared/Navbar/Navbar';

const RootLayout = () => {
    return (
      <div className="relative min-h-dvh">
        {/* Navbar overlays the homepage */}
        <header className="absolute top-0 left-0 w-full z-50">
          <Navbar />
        </header>

        {/* Page content */}
        <Outlet />
      </div>
    );
};

export default RootLayout;