-- Create service_centers table for centers offering NIVARA services
CREATE TABLE public.service_centers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name character varying NOT NULL,
  address text,
  city character varying,
  phone character varying,
  email character varying,
  location_lat double precision,
  location_long double precision,
  services text[],
  operating_hours jsonb,
  appointment_slots jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_centers ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view service centers" 
ON public.service_centers 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_service_centers_updated_at
BEFORE UPDATE ON public.service_centers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample service centers
INSERT INTO public.service_centers (name, address, city, phone, email, services, operating_hours, appointment_slots) VALUES
('NIVARA Health Center - Mumbai', 'Shop 15, Healthcare Complex, Andheri West, Mumbai, Maharashtra 400058', 'Mumbai', '+91-22-2674-5678', 'mumbai@nivara.health', 
 ARRAY['Skin Scanning', 'AI Analysis', 'Consultation', 'Report Generation'], 
 '{"monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "9:00-18:00", "saturday": "9:00-16:00", "sunday": "closed"}',
 '{"morning": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"], "afternoon": ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"]}'),

('NIVARA Diagnostic Center - Delhi', 'B-42, Medical District, Lajpat Nagar, New Delhi, Delhi 110024', 'Delhi', '+91-11-4567-8901', 'delhi@nivara.health',
 ARRAY['Skin Scanning', 'AI Analysis', 'Dermatology Consultation', 'Treatment Planning'],
 '{"monday": "8:00-19:00", "tuesday": "8:00-19:00", "wednesday": "8:00-19:00", "thursday": "8:00-19:00", "friday": "8:00-19:00", "saturday": "8:00-17:00", "sunday": "10:00-15:00"}',
 '{"morning": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"], "afternoon": ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"], "evening": ["18:00", "18:30"]}'),

('NIVARA Wellness Hub - Bangalore', 'Level 2, Tech Park Plaza, Electronic City, Bangalore, Karnataka 560100', 'Bangalore', '+91-80-1234-5678', 'bangalore@nivara.health',
 ARRAY['Advanced Skin Scanning', 'AI Diagnostics', 'Preventive Care', 'Health Monitoring'],
 '{"monday": "9:00-20:00", "tuesday": "9:00-20:00", "wednesday": "9:00-20:00", "thursday": "9:00-20:00", "friday": "9:00-20:00", "saturday": "9:00-18:00", "sunday": "10:00-16:00"}',
 '{"morning": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"], "afternoon": ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"], "evening": ["18:00", "18:30", "19:00", "19:30"]}'),

('NIVARA Care Center - Chennai', 'Unit 7, Healthcare Plaza, T. Nagar, Chennai, Tamil Nadu 600017', 'Chennai', '+91-44-9876-5432', 'chennai@nivara.health',
 ARRAY['Skin Health Screening', 'AI-Powered Analysis', 'Expert Consultation'],
 '{"monday": "8:30-18:30", "tuesday": "8:30-18:30", "wednesday": "8:30-18:30", "thursday": "8:30-18:30", "friday": "8:30-18:30", "saturday": "8:30-16:30", "sunday": "closed"}',
 '{"morning": ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"], "afternoon": ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"]}'),

('NIVARA Health Point - Pune', 'Shop 23, Medical Center, Koregaon Park, Pune, Maharashtra 411001', 'Pune', '+91-20-3456-7890', 'pune@nivara.health',
 ARRAY['Comprehensive Skin Analysis', 'Digital Health Records', 'Follow-up Care'],
 '{"monday": "9:00-19:00", "tuesday": "9:00-19:00", "wednesday": "9:00-19:00", "thursday": "9:00-19:00", "friday": "9:00-19:00", "saturday": "9:00-17:00", "sunday": "10:00-15:00"}',
 '{"morning": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"], "afternoon": ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"], "evening": ["18:00", "18:30"]}');

-- Create appointments table for service center bookings
CREATE TABLE public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  service_center_id uuid NOT NULL REFERENCES service_centers(id),
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(service_center_id, appointment_date, appointment_time)
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for appointments
CREATE POLICY "Users can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();