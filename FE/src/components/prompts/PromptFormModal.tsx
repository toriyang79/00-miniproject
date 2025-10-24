import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import { promptsAPI } from '@/api/prompts';
import type { Prompt, PromptFormData } from '@/types/prompt';
import { sanitizeText } from '@/utils/sanitize';

interface PromptFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  prompt?: Prompt | null;
}

const colorLabelOptions = [
  { value: 'ready', label: '사용 준비', color: 'bg-green-100 text-green-800' },
  { value: 'draft', label: '초안', color: 'bg-gray-100 text-gray-800' },
  { value: 'template', label: '템플릿', color: 'bg-blue-100 text-blue-800' },
  { value: 'update', label: '업데이트 필요', color: 'bg-yellow-100 text-yellow-800' },
];

export default function PromptFormModal({
  isOpen,
  onClose,
  onSuccess,
  prompt,
}: PromptFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PromptFormData>({
    title: '',
    content: '',
    category: null,
    tags: [],
    is_template: false,
    color_label: 'ready',
    is_favorite: false,
    is_public: false,
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title,
        content: prompt.content,
        category: prompt.category?.id || null,
        tags: prompt.tags.map((t) => t.name),
        is_template: prompt.is_template,
        color_label: prompt.color_label,
        is_favorite: prompt.is_favorite,
        is_public: prompt.is_public,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: null,
        tags: [],
        is_template: false,
        color_label: 'ready',
        is_favorite: false,
        is_public: false,
      });
    }
  }, [prompt, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('제목을 입력해주세요');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('내용을 입력해주세요');
      return;
    }

    try {
      setLoading(true);

      const sanitizedData = {
        ...formData,
        title: sanitizeText(formData.title),
        content: sanitizeText(formData.content),
      };

      if (prompt) {
        await promptsAPI.update(prompt.id, sanitizedData);
        toast.success('프롬프트가 수정되었습니다');
      } else {
        await promptsAPI.create(sanitizedData);
        toast.success('프롬프트가 생성되었습니다');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save prompt:', error);
      toast.error(
        prompt
          ? '프롬프트 수정에 실패했습니다'
          : '프롬프트 생성에 실패했습니다'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = sanitizeText(tagInput.trim());
      if (!formData.tags.includes(newTag)) {
        setFormData({ ...formData, tags: [...formData.tags, newTag] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tagToRemove),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={prompt ? '프롬프트 수정' : '새 프롬프트'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="input w-full"
            placeholder="프롬프트 제목을 입력하세요"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="input w-full min-h-[200px] resize-y"
            placeholder="프롬프트 내용을 입력하세요"
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            태그
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="input w-full"
              placeholder="태그를 입력하고 Enter를 누르세요"
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Color Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상태 라벨
          </label>
          <div className="grid grid-cols-2 gap-2">
            {colorLabelOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, color_label: option.value })
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.color_label === option.value
                    ? option.color + ' ring-2 ring-primary-500'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_template}
              onChange={(e) =>
                setFormData({ ...formData, is_template: e.target.checked })
              }
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">템플릿으로 사용</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_favorite}
              onChange={(e) =>
                setFormData({ ...formData, is_favorite: e.target.checked })
              }
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">즐겨찾기에 추가</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_public}
              onChange={(e) =>
                setFormData({ ...formData, is_public: e.target.checked })
              }
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">공개 프롬프트</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2"
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {prompt ? '수정' : '생성'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
