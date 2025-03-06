import { useState } from 'react';
import { useDebounce } from 'react-use';

import type { SearchResult } from '@/types/search';

import { createClient } from '@/lib/supabase/client';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({
    tasks: [],
    tags: []
  });

  useDebounce(
    () => {
      if (searchQuery.trim() === '') {
        setResults({ tasks: [], tags: [] });
        return;
      }
      searchProducts(searchQuery);
    },
    500,
    [searchQuery]
  );

  const searchProducts = async (searchTerm: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('full_text_search', {
        query: searchTerm
      });

      if (error) throw error;

      setResults({
        tasks: (data as SearchResult).tasks || [],
        tags: (data as SearchResult).tags || []
      });
    } catch (error) {
      console.error('Search error:', error);
      setResults({ tasks: [], tags: [] });
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    results
  };
};
