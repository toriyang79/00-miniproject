import { useState, useEffect } from 'react';
import { FileText, FolderOpen, Star, TrendingUp, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { promptsAPI } from '@/api/prompts';
import type { Prompt } from '@/types/prompt';

interface DashboardStats {
  totalPrompts: number;
  totalCategories: number;
  totalFavorites: number;
  totalUsage: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPrompts: 0,
    totalCategories: 0,
    totalFavorites: 0,
    totalUsage: 0,
  });
  const [recentPrompts, setRecentPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all prompts to calculate stats
      const allPromptsResponse = await promptsAPI.getAll({ page_size: 1000 });
      const allPrompts = allPromptsResponse.results;

      // Calculate stats
      const uniqueCategories = new Set(
        allPrompts
          .map((p) => p.category?.id)
          .filter((id): id is number => id !== null && id !== undefined)
      );

      const totalUsage = allPrompts.reduce(
        (sum, p) => sum + (p.usage_count || 0),
        0
      );

      setStats({
        totalPrompts: allPromptsResponse.count,
        totalCategories: uniqueCategories.size,
        totalFavorites: allPrompts.filter((p) => p.is_favorite).length,
        totalUsage,
      });

      // Get recent prompts (last 5)
      const recentResponse = await promptsAPI.getAll({
        page_size: 5,
        ordering: '-created_at',
      });
      setRecentPrompts(recentResponse.results);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: '전체 프롬프트',
      value: stats.totalPrompts.toString(),
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      name: '카테고리',
      value: stats.totalCategories.toString(),
      icon: FolderOpen,
      color: 'bg-green-500',
    },
    {
      name: '즐겨찾기',
      value: stats.totalFavorites.toString(),
      icon: Star,
      color: 'bg-yellow-500',
    },
    {
      name: '총 사용 횟수',
      value: stats.totalUsage.toString(),
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-1">프롬프트 라이브러리 개요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
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
        <h2 className="text-lg font-bold mb-4">최근 프롬프트</h2>
        {recentPrompts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>아직 프롬프트가 없습니다.</p>
            <p className="text-sm mt-1">첫 프롬프트를 만들어보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {prompt.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {prompt.content}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      {prompt.category && (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: prompt.category.color + '20',
                            color: prompt.category.color,
                          }}
                        >
                          {prompt.category.name}
                        </span>
                      )}
                      <span>
                        {formatDistanceToNow(new Date(prompt.created_at), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                      {prompt.usage_count > 0 && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {prompt.usage_count}회 사용
                        </span>
                      )}
                    </div>
                  </div>
                  {prompt.is_favorite && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-400 ml-2 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
