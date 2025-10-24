export interface Tag {
  id: number;
  name: string;
}

export interface CategoryDetail {
  id: number;
  name: string;
  color: string;
}

export interface Prompt {
  id: number;
  user: number;
  username: string;
  title: string;
  content: string;
  description?: string;
  category: CategoryDetail | null;
  tags: Tag[];
  is_template: boolean;
  variables: string[];
  color_label: 'ready' | 'draft' | 'template' | 'update';
  is_favorite: boolean;
  is_public: boolean;
  usage_count: number;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  prompt_count?: number;
  created_at: string;
}

export interface PromptFormData {
  title: string;
  content: string;
  category?: number | null;
  tags: string[];
  is_template: boolean;
  color_label: string;
  is_favorite: boolean;
  is_public: boolean;
}

export interface PromptUsage {
  id: number;
  prompt: number;
  prompt_title: string;
  used_at: string;
  variables_used: Record<string, string> | null;
}

export interface ApplyVariablesRequest {
  variable_values: Record<string, string>;
}

export interface ApplyVariablesResponse {
  original: string;
  variables: Record<string, string>;
  result: string;
}
