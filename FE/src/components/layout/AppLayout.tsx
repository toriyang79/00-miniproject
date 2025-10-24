import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Sidebar />

      <div className="p-4 sm:ml-64 mt-14">
        <Outlet />
      </div>
    </div>
  );
}
