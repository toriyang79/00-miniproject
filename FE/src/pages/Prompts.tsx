import { useState, useEffect, useCallback } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { promptsAPI } from '@/api/prompts';
import PromptCard from '@/components/prompts/PromptCard';
import PromptFormModal from '@/components/prompts/PromptFormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import SearchBar from '@/components/prompts/SearchBar';
import FilterPanel, { type FilterOptions } from '@/components/prompts/FilterPanel';
import type { Prompt } from '@/types/prompt';
import type { PaginatedResponse } from '@/types/api';

export default function Prompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const pageSize = 12;

  useEffect(() => {
    loadPrompts();
  }, [page, searchQuery, filters]);

  const loadPrompts = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Prompt> = await promptsAPI.getAll({
        page,
        page_size: pageSize,
        search: searchQuery || undefined,
        ...filters,
      });
      setPrompts(response.results);
      setTotalCount(response.count);
      setTotalPages(Math.ceil(response.count / pageSize));
    } catch (error) {
      console.error('Failed to load prompts:', error);
      toast.error('프롬프트 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page on search
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  }, []);

  const handleToggleFavorite = useCallback(async (id: number) => {
    try {
      const updatedPrompt = await promptsAPI.toggleFavorite(id);
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? updatedPrompt : p))
      );
      toast.success(
        updatedPrompt.is_favorite
          ? '즐겨찾기에 추가되었습니다'
          : '즐겨찾기에서 제거되었습니다'
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('즐겨찾기 변경에 실패했습니다');
    }
  }, [prompts]);

  const handlePromptClick = useCallback(async (id: number) => {
    try {
      await promptsAPI.markUsed(id);
      const prompt = prompts.find((p) => p.id === id);
      if (prompt) {
        setSelectedPrompt(prompt);
        setIsFormModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to mark prompt as used:', error);
    }
  }, [prompts]);

  const handleCreateNew = useCallback(() => {
    setSelectedPrompt(null);
    setIsFormModalOpen(true);
  }, []);

  const handleFormSuccess = useCallback(() => {
    loadPrompts();
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsFormModalOpen(false);
    setSelectedPrompt(null);
  }, []);

  const handleEdit = useCallback((id: number) => {
    const prompt = prompts.find((p) => p.id === id);
    if (prompt) {
      setSelectedPrompt(prompt);
      setIsFormModalOpen(true);
    }
  }, [prompts]);

  const handleDeleteClick = useCallback((id: number) => {
    setPromptToDelete(id);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!promptToDelete) return;

    try {
      setDeleteLoading(true);
      await promptsAPI.delete(promptToDelete);
      toast.success('프롬프트가 삭제되었습니다');
      setIsDeleteDialogOpen(false);
      setPromptToDelete(null);
      loadPrompts();
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      toast.error('프롬프트 삭제에 실패했습니다');
    } finally {
      setDeleteLoading(false);
    }
  }, [promptToDelete]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setPromptToDelete(null);
  }, []);

  if (loading && prompts.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">프롬프트</h1>
            <p className="text-gray-600 mt-1">
              총 {totalCount}개의 프롬프트
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            새 프롬프트
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
          </div>
          <FilterPanel filters={filters} onChange={handleFilterChange} />
        </div>
      </div>

      {/* Empty State */}
      {prompts.length === 0 && !loading && (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            프롬프트가 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            첫 프롬프트를 만들어 시작해보세요
          </p>
          <button onClick={handleCreateNew} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            프롬프트 만들기
          </button>
        </div>
      )}

      {/* Prompts Grid */}
      {prompts.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onToggleFavorite={handleToggleFavorite}
                onClick={handlePromptClick}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - page) <= 1
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            page === pageNum
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === page - 2 ||
                      pageNum === page + 2
                    ) {
                      return (
                        <span key={pageNum} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      <PromptFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleFormSuccess}
        prompt={selectedPrompt}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="프롬프트 삭제"
        message="이 프롬프트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
