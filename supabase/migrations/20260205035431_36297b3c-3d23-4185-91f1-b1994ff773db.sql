-- Create storage bucket for uploaded fashion images
INSERT INTO storage.buckets (id, name, public)
VALUES ('fashion-uploads', 'fashion-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can read uploaded images
CREATE POLICY "Public read access for fashion uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'fashion-uploads');

-- Storage policy: Anyone can upload images (since no auth)
CREATE POLICY "Anyone can upload fashion images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'fashion-uploads');

-- Create table to store upload history with analysis results
CREATE TABLE public.upload_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  image_url TEXT NOT NULL,
  analysis_result JSONB,
  is_valid BOOLEAN DEFAULT true,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (but allow public access since no auth)
ALTER TABLE public.upload_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read upload history
CREATE POLICY "Anyone can read upload history"
ON public.upload_history FOR SELECT
USING (true);

-- Allow anyone to insert upload history
CREATE POLICY "Anyone can insert upload history"
ON public.upload_history FOR INSERT
WITH CHECK (true);