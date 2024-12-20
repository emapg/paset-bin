import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import type { Paste } from '@/types/paste';

export function Profile() {
  const { user } = useAuth();
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserPastes() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('pastes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPastes(data);
      } catch (error) {
        console.error('Error fetching user pastes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserPastes();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Please sign in to view your profile
        </h1>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        My Pastes
      </h1>

      <div className="grid gap-4">
        {pastes.map((paste) => (
          <Link
            key={paste.id}
            to={`/p/${paste.custom_url || paste.id}`}
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {paste.title}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {paste.is_public ? 'Public' : 'Private'}
              </span>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
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