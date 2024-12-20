import { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { formatDistanceToNow } from 'date-fns';
import { Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import type { Paste } from '@/types/paste';

interface PasteViewProps {
  paste: Paste;
}

export function PasteView({ paste }: PasteViewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(paste.content);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const sharePaste = async () => {
    try {
      await navigator.share({
        title: paste.title,
        text: paste.content,
        url: window.location.href,
      });
    } catch (error) {
      toast.error('Failed to share');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {paste.title}
        </h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center"
          >
            <Copy size={16} className="mr-2" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={sharePaste}
            className="flex items-center"
          >
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
        <SyntaxHighlighter
          language={paste.language}
          className="!bg-transparent"
        >
          {paste.content}
        </SyntaxHighlighter>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        Created {formatDistanceToNow(new Date(paste.created_at))} ago
        {paste.expires_at && (
          <span className="ml-2">
            • Expires in {formatDistanceToNow(new Date(paste.expires_at))}
          </span>
        )}
      </div>
    </div>
  );
}