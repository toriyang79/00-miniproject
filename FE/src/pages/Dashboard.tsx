import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Prompt Library
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                환영합니다, {user?.username}님!
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">대시보드</h2>
          <p className="text-gray-600">
            Phase 3: 인증 시스템이 성공적으로 구현되었습니다! 🎉
          </p>
          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-600">
              ✅ JWT 인증 (로그인/회원가입/로그아웃)
            </p>
            <p className="text-sm text-gray-600">
              ✅ Protected Routes
            </p>
            <p className="text-sm text-gray-600">
              ✅ XSS 방어 (입력 sanitization)
            </p>
            <p className="text-sm text-gray-600">
              ✅ 안전한 토큰 저장 (sessionStorage/localStorage)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
