import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { PasteView } from '@/components/PasteView/PasteView';
import type { Paste } from '@/types/paste';

export function ViewPaste() {
  const { id } = useParams<{ id: string }>();
  const [paste, setPaste] = useState<Paste | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPaste() {
      try {
        const { data, error } = await supabase
          .from('pastes')
          .select('*')
          .or(`id.eq.${id},custom_url.eq.${id}`)
          .single();

        if (error) throw error;
        setPaste(data);
      } catch (error) {
        console.error('Error fetching paste:', error);
        setError('Paste not found or you don\'t have permission to view it.');
      } finally {
        setLoading(false);
      }
    }

    fetchPaste();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !paste) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error || 'Paste not found'}
        </h1>
      </div>
    );
  }

  return <PasteView paste={paste} />;
}