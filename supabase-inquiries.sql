CREATE TABLE inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL, -- 'Contact' or 'Consultation'
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service_required TEXT, 
    location TEXT, 
    plot_size TEXT, 
    budget TEXT, 
    message TEXT,
    status TEXT DEFAULT 'New', -- 'New', 'In Progress', 'Resolved'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (for forms)
CREATE POLICY "Public Insert" ON inquiries FOR INSERT WITH CHECK (true);

-- Allow admins full access assuming active session
CREATE POLICY "Allow all actions" ON inquiries FOR ALL USING (true);
