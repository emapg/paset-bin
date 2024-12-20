import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import type { Paste } from '@/types/paste';

export function Home() {
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublicPastes() {
      try {
        const { data, error } = await supabase
          .from('pastes')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setPastes(data);
      } catch (error) {
        console.error('Error fetching pastes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPublicPastes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Recent Public Pastes
      </h1>

      <div className="grid gap-4">
        {pastes.map((paste) => (
          <Link
            key={paste.id}
            to={`/p/${paste.custom_url || paste.id}`}
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {paste.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
              {paste.content}
            </p>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Created {formatDistanceToNow(new Date(paste.created_at))} ago
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}