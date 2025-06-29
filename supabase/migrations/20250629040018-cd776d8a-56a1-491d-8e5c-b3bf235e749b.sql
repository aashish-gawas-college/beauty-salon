
-- Add columns to content table for About Us sections
ALTER TABLE public.content ADD COLUMN IF NOT EXISTS philosophy TEXT;
ALTER TABLE public.content ADD COLUMN IF NOT EXISTS what_sets_apart TEXT[];

-- Create social_media table for managing social media links
CREATE TABLE public.social_media (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for social_media table
ALTER TABLE public.social_media ENABLE ROW LEVEL SECURITY;

-- Create policies for social_media
CREATE POLICY "Admins can manage social media" ON public.social_media
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

CREATE POLICY "Public can view social media" ON public.social_media
    FOR SELECT USING (is_active = true);

-- Insert default social media entries
INSERT INTO public.social_media (platform, url, icon_name, display_order) VALUES 
('Instagram', '#', 'Instagram', 1),
('Facebook', '#', 'Facebook', 2);

-- Update the about content with philosophy and what sets us apart
UPDATE public.content 
SET 
    philosophy = 'Founded with a passion for enhancing natural beauty, our salon combines luxury with accessibility. We use only premium products and the latest techniques to ensure every client receives exceptional service.',
    what_sets_apart = ARRAY[
        'Personalized consultations for every service',
        'Premium, cruelty-free products only',
        'Relaxing, luxurious atmosphere',
        'Highly trained and certified professionals'
    ]
WHERE id = 'about';
