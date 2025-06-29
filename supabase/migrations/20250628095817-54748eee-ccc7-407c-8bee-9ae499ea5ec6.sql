
-- Create services table for managing salon services
CREATE TABLE public.services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    photo_url TEXT,
    short_description TEXT,
    duration TEXT,
    benefits TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery table for photo management
CREATE TABLE public.gallery (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content table for editable static content
CREATE TABLE public.content (
    id TEXT PRIMARY KEY,
    title TEXT,
    body TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for services (admin only)
CREATE POLICY "Admins can manage services" ON public.services
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

-- Create policies for gallery (admin only)
CREATE POLICY "Admins can manage gallery" ON public.gallery
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

-- Create policies for content (admin only)
CREATE POLICY "Admins can manage content" ON public.content
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

-- Create policy for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow public read access to services, gallery, and content
CREATE POLICY "Public can view services" ON public.services
    FOR SELECT USING (true);

CREATE POLICY "Public can view gallery" ON public.gallery
    FOR SELECT USING (true);

CREATE POLICY "Public can view content" ON public.content
    FOR SELECT USING (true);

-- Insert default content
INSERT INTO public.content (id, title, body) VALUES 
('home', 'Where beauty blossoms', 'Discover your natural radiance at our luxurious beauty salon. We offer premium services in a serene, elegant environment designed to make you feel beautiful inside and out.'),
('about', 'About Oshin Beauty Salon & Academy', 'At Oshin Beauty Salon & Academy, we believe that beauty is not just about appearance—it''s about confidence, self-care, and feeling your absolute best. Founded with a passion for enhancing natural beauty, our salon combines luxury with accessibility.');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (new.id, new.email, 'admin');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
