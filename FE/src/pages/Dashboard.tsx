import { FileText, FolderOpen, Star, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      name: '전체 프롬프트',
      value: '0',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      name: '카테고리',
      value: '0',
      icon: FolderOpen,
      color: 'bg-green-500',
    },
    {
      name: '즐겨찾기',
      value: '0',
      icon: Star,
      color: 'bg-yellow-500',
    },
    {
      name: '사용 횟수',
      value: '0',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-1">프롬프트 라이브러리 개요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 최근 활동 */}
      <div className="card">
        <h2 className="text-lg font-bold mb-4">최근 활동</h2>
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>아직 프롬프트가 없습니다.</p>
          <p className="text-sm mt-1">첫 프롬프트를 만들어보세요!</p>
        </div>
      </div>
    </div>
  );
}
