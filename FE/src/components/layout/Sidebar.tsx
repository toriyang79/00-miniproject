import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Star,
  BarChart3,
  Settings,
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    {
      name: '대시보드',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      name: '프롬프트',
      icon: FileText,
      path: '/prompts',
    },
    {
      name: '카테고리',
      icon: FolderOpen,
      path: '/categories',
    },
    {
      name: '즐겨찾기',
      icon: Star,
      path: '/favorites',
    },
    {
      name: '통계',
      icon: BarChart3,
      path: '/analytics',
    },
    {
      name: '설정',
      icon: Settings,
      path: '/settings',
    },
  ];

  return (
    <aside
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg group ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
