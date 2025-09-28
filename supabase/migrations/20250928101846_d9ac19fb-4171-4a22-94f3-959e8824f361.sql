-- Add INSERT policy for orders table so users can create orders
CREATE POLICY "Users can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Add INSERT policy for devices table so orders can be linked to devices  
CREATE POLICY "System can register devices to users" 
ON public.devices 
FOR INSERT 
WITH CHECK (true);