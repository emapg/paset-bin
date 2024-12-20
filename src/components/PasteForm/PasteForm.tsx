import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { SUPPORTED_LANGUAGES, EXPIRATION_OPTIONS } from '@/lib/utils';

const pasteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(1, 'Content is required'),
  language: z.string(),
  isPublic: z.boolean(),
  customUrl: z.string().optional(),
  expiresAt: z.string(),
});

type PasteFormData = z.infer<typeof pasteSchema>;

interface PasteFormProps {
  onSubmit: (data: PasteFormData) => Promise<void>;
  initialData?: Partial<PasteFormData>;
  isLoading?: boolean;
}

export function PasteForm({ onSubmit, initialData, isLoading }: PasteFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<PasteFormData>({
    resolver: zodResolver(pasteSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Title
        </label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Content
        </label>
        <textarea
          {...register('content')}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Language
          </label>
          <select
            {...register('language')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Expiration
          </label>
          <select
            {...register('expiresAt')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {EXPIRATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('isPublic')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
            Make public
          </span>
        </label>
      </div>

      <Button type="submit" isLoading={isLoading}>
        Create Paste
      </Button>
    </form>
  );
}