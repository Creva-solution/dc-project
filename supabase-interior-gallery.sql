-- Run this in the Supabase SQL Editor

-- Create the interior_gallery table
CREATE TABLE interior_gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE interior_gallery ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public Read Access" ON interior_gallery FOR SELECT USING (true);

-- Allow admins full access
CREATE POLICY "Allow all actions" ON interior_gallery FOR ALL USING (true);

-- You'll also need to create a bucket named 'interior-gallery'
-- Make sure the bucket is set to 'Public'
INSERT INTO storage.buckets (id, name, public) VALUES ('interior-gallery', 'interior-gallery', true) ON CONFLICT DO NOTHING;

-- Bucket policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'interior-gallery');
CREATE POLICY "Admin Insert" ON storage.objects FOR INSERT USING (bucket_id = 'interior-gallery');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'interior-gallery');
