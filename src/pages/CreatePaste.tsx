import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { PasteForm } from '@/components/PasteForm/PasteForm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { generateCustomUrl } from '@/lib/utils';

export function CreatePaste() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (data: any) => {
    try {
      const customUrl = data.customUrl || generateCustomUrl();
      
      const { error } = await supabase.from('pastes').insert([
        {
          ...data,
          custom_url: customUrl,
          user_id: user?.id,
        },
      ]);

      if (error) throw error;

      toast.success('Paste created successfully!');
      navigate(`/p/${customUrl}`);
    } catch (error) {
      console.error('Error creating paste:', error);
      toast.error('Failed to create paste');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Create New Paste
      </h1>
      <PasteForm onSubmit={handleSubmit} />
    </div>
  );
}