import { revalidateTag } from 'next/cache';
import 'server-only';

import { createClient } from '@/lib/supabase/server';

const tagByIdTag = (id: string) => `tag-by-id-${id}`;

export const getTagById = async (id: string) => {
  const supabase = await createClient({
    revalidate: 60,
    tags: [tagByIdTag(id)]
  });

  const { data, error } = await supabase
    .from('tags')
    .select('id, name')
    .eq('id', id)
    .single();

  if (error) throw error;

  return { data };
};

export const revalidateTagById = (id: string) => revalidateTag(tagByIdTag(id));
export const preloadTagById = (id: string) => void getTagById(id);
