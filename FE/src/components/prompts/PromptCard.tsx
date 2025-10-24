import { memo } from 'react';
import { Star, Copy, Clock, TrendingUp, Trash2, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import type { Prompt } from '@/types/prompt';
import { sanitizeText } from '@/utils/sanitize';

interface PromptCardProps {
  prompt: Prompt;
  onToggleFavorite: (id: number) => void;
  onClick: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const colorLabelStyles = {
  ready: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  template: 'bg-blue-100 text-blue-800',
  update: 'bg-yellow-100 text-yellow-800',
};

const colorLabelText = {
  ready: '사용 준비',
  draft: '초안',
  template: '템플릿',
  update: '업데이트 필요',
};

function PromptCard({
  prompt,
  onToggleFavorite,
  onClick,
  onEdit,
  onDelete,
}: PromptCardProps) {
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast.success('프롬프트가 클립보드에 복사되었습니다');
    } catch (error) {
      toast.error('복사에 실패했습니다');
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(prompt.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(prompt.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(prompt.id);
  };

  const getContentPreview = (content: string, maxLength = 120) => {
    const sanitized = sanitizeText(content);
    if (sanitized.length <= maxLength) return sanitized;
    return sanitized.substring(0, maxLength) + '...';
  };

  return (
    <div
      onClick={() => onClick(prompt.id)}
      className="card hover:shadow-lg transition-shadow cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {sanitizeText(prompt.title)}
          </h3>
          {prompt.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {sanitizeText(prompt.description)}
            </p>
          )}
        </div>
        <button
          onClick={handleFavorite}
          className="ml-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <Star
            className={`w-5 h-5 ${
              prompt.is_favorite
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Content Preview */}
      <div className="mb-3">
        <p className="text-sm text-gray-700 line-clamp-3">
          {getContentPreview(prompt.content)}
        </p>
      </div>

      {/* Category and Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {prompt.category && (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: prompt.category.color + '20',
              color: prompt.category.color,
            }}
          >
            {sanitizeText(prompt.category.name)}
          </span>
        )}
        {prompt.tags.slice(0, 3).map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
          >
            {sanitizeText(tag.name)}
          </span>
        ))}
        {prompt.tags.length > 3 && (
          <span className="text-xs text-gray-500">
            +{prompt.tags.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {/* Color Label */}
          <span
            className={`px-2 py-1 rounded-md font-medium ${
              colorLabelStyles[prompt.color_label]
            }`}
          >
            {colorLabelText[prompt.color_label]}
          </span>

          {/* Usage Count */}
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{prompt.usage_count}</span>
          </div>

          {/* Last Used */}
          {prompt.last_used_at && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {formatDistanceToNow(new Date(prompt.last_used_at), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="복사"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleEdit}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="수정"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(PromptCard);
