-- Create enum for device status
CREATE TYPE device_status AS ENUM ('active', 'inactive');

-- Create enum for payment status  
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'failed');

-- Create profiles table for additional user info
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  pincode VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create devices table
CREATE TABLE public.devices (
  device_id VARCHAR(255) NOT NULL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  status device_status NOT NULL DEFAULT 'inactive',
  registration_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  order_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  device_id VARCHAR(255) REFERENCES public.devices(device_id) ON DELETE SET NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  shipping_address TEXT,
  order_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scans table
CREATE TABLE public.scans (
  scan_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id VARCHAR(255) NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  condition_detected VARCHAR(255),
  confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
  image_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  doctor_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255) DEFAULT 'Dermatologist',
  hospital VARCHAR(255),
  address TEXT,
  phone VARCHAR(20),
  location_lat FLOAT,
  location_long FLOAT,
  website VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (public.profiles.user_id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (public.profiles.user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (public.profiles.user_id = auth.uid());

-- Create RLS policies for devices
CREATE POLICY "Users can view their own devices" 
ON public.devices FOR SELECT 
USING (public.devices.user_id = auth.uid());

CREATE POLICY "Users can update their own devices" 
ON public.devices FOR UPDATE 
USING (public.devices.user_id = auth.uid());

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (public.orders.user_id = auth.uid());

-- Create RLS policies for scans
CREATE POLICY "Users can view scans from their devices" 
ON public.scans FOR SELECT 
USING (public.scans.device_id IN (
  SELECT device_id FROM public.devices WHERE user_id = auth.uid()
));

-- Public access to doctors for search
CREATE POLICY "Anyone can view doctors" 
ON public.doctors FOR SELECT 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name');
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample data for doctors
INSERT INTO public.doctors (name, specialization, hospital, address, phone, location_lat, location_long, website) VALUES
('Dr. Rajesh Kumar', 'Dermatologist', 'Apollo Hospital', '123 MG Road, Bangalore, Karnataka 560001', '+91-9876543210', 12.9716, 77.5946, 'https://apollohospitals.com'),
('Dr. Priya Sharma', 'Dermatologist', 'Fortis Hospital', '456 Brigade Road, Bangalore, Karnataka 560025', '+91-9876543211', 12.9738, 77.6086, 'https://fortishealthcare.com'),
('Dr. Amit Patel', 'Dermatologist', 'Manipal Hospital', '789 Old Airport Road, Bangalore, Karnataka 560017', '+91-9876543212', 12.9611, 77.6362, 'https://manipalhospitals.com'),
('Dr. Sunita Reddy', 'Dermatologist', 'Columbia Asia Hospital', '321 Sarjapur Road, Bangalore, Karnataka 560068', '+91-9876543213', 12.9082, 77.6430, 'https://columbiaasia.com'),
('Dr. Vikram Singh', 'Dermatologist', 'Narayana Health', '654 Hosur Road, Bangalore, Karnataka 560099', '+91-9876543214', 12.9149, 77.6101, 'https://narayanahealth.org');

-- Insert sample devices for testing
INSERT INTO public.devices (device_id, status) VALUES
('NIVARA-001-ABC123', 'inactive'),
('NIVARA-002-DEF456', 'inactive'),
('NIVARA-003-GHI789', 'inactive'),
('NIVARA-004-JKL012', 'inactive'),
('NIVARA-005-MNO345', 'inactive');