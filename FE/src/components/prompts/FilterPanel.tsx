import { Filter } from 'lucide-react';
import { useState } from 'react';

export interface FilterOptions {
  is_favorite?: boolean;
  is_template?: boolean;
  color_label?: string;
  ordering?: string;
}

interface FilterPanelProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
}

const colorLabelOptions = [
  { value: '', label: '전체' },
  { value: 'ready', label: '사용 준비', color: 'bg-green-100 text-green-800' },
  { value: 'draft', label: '초안', color: 'bg-gray-100 text-gray-800' },
  { value: 'template', label: '템플릿', color: 'bg-blue-100 text-blue-800' },
  { value: 'update', label: '업데이트 필요', color: 'bg-yellow-100 text-yellow-800' },
];

const sortOptions = [
  { value: '-created_at', label: '최근 생성순' },
  { value: 'created_at', label: '오래된순' },
  { value: '-updated_at', label: '최근 수정순' },
  { value: '-usage_count', label: '많이 사용한순' },
  { value: 'title', label: '제목순 (A-Z)' },
  { value: '-title', label: '제목순 (Z-A)' },
];

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onChange({ ...filters, [key]: value === '' ? undefined : value });
  };

  const handleClearFilters = () => {
    onChange({});
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ''
  ).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn flex items-center gap-2 relative"
      >
        <Filter className="w-4 h-4" />
        필터
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Filter Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">필터</h3>
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                초기화
              </button>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정렬
              </label>
              <select
                value={filters.ordering || '-created_at'}
                onChange={(e) =>
                  handleFilterChange('ordering', e.target.value)
                }
                className="input w-full"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태 라벨
              </label>
              <div className="grid grid-cols-2 gap-2">
                {colorLabelOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleFilterChange('color_label', option.value)
                    }
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      (filters.color_label || '') === option.value
                        ? option.color || 'bg-primary-100 text-primary-800'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.is_favorite || false}
                  onChange={(e) =>
                    handleFilterChange(
                      'is_favorite',
                      e.target.checked || undefined
                    )
                  }
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">즐겨찾기만</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.is_template || false}
                  onChange={(e) =>
                    handleFilterChange(
                      'is_template',
                      e.target.checked || undefined
                    )
                  }
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">템플릿만</span>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
