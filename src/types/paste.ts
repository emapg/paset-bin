export interface Paste {
  id: string;
  title: string;
  content: string;
  language: string;
  user_id: string | null;
  is_public: boolean;
  custom_url: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface PasteView {
  id: string;
  paste_id: string;
  viewer_ip: string;
  created_at: string;
}

export interface Report {
  id: string;
  paste_id: string;
  reporter_id: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
}