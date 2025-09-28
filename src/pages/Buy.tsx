import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Scan, ArrowLeft, CheckCircle, Camera, Cpu, Wifi, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/logo/Nivara_logo.png";
import ProductGallery from "@/components/ProductGallery";
import productImage1 from "@/product/1.png";
import productImage2 from "@/product/2.png";
import { sendOrderConfirmationEmail } from "@/services/emailService";

export default function Buy() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const devicePrice = 4999; // ₹4,999
  const shippingCost = 0; // Free shipping
  const totalCost = (devicePrice * quantity) + shippingCost;

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!shippingInfo[field as keyof typeof shippingInfo].trim()) {
        toast({
          title: "Missing Information",
          description: `Please fill in your ${field.replace('_', ' ')}`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handlePurchase = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create order without stock validation
      const orderData = {
        user_id: user?.id || null,
        device_id: null, // Will be assigned later if user is logged in
        amount_paid: totalCost,
        payment_status: 'paid' as const,
        shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}`,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // Send order confirmation email
      try {
        const emailResult = await sendOrderConfirmationEmail({
          orderId: order.order_id,
          customerName: shippingInfo.name,
          customerEmail: shippingInfo.email,
          totalAmount: totalCost,
          quantity: quantity,
          shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}`,
          orderDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        });

        if (emailResult.success) {
          console.log('✅ Order confirmation email sent successfully');
        } else {
          console.warn('⚠️ Email sending failed:', emailResult.message);
        }
      } catch (emailError) {
        console.error('❌ Error sending confirmation email:', emailError);
        // Don't fail the order if email fails
      }

      // Update profile with shipping info if user is logged in
      if (user) {
        await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            name: shippingInfo.name,
            phone: shippingInfo.phone,
            address: shippingInfo.address,
            city: shippingInfo.city,
            pincode: shippingInfo.pincode,
          });

        // Get available devices and assign them to user
        const { data: availableDevices, error: deviceError } = await supabase
          .from('devices')
          .select('device_id')
          .is('user_id', null)
          .limit(quantity);

        if (deviceError) throw deviceError;

        // Assign devices to user if any are available
        if (availableDevices && availableDevices.length > 0) {
          const deviceIds = availableDevices.slice(0, quantity).map(d => d.device_id);
          await supabase
            .from('devices')
            .update({ user_id: user.id, registration_date: new Date().toISOString() })
            .in('device_id', deviceIds);
        }
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Order ID: ${order.order_id}. A confirmation email has been sent to ${shippingInfo.email}.`,
      });

      // Reset form
      setShippingInfo({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
      setQuantity(1);

      // Redirect to dashboard if logged in, otherwise to auth
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:neon-glow transition-all duration-300">
              <img src={logo} alt="NIVARA Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold text-gradient">NIVARA</span>
          </Link>
          <Link to="/" className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg">Back to Home</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Product Information */}
          <div>
            <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 sm:mb-8 leading-tight">
              <span className="text-gradient">NIVARA</span>
              <br />
              <span className="text-2xl sm:text-4xl text-white/90">Skin Health Scanner</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mb-6 sm:mb-8 leading-relaxed">
              AI-powered skin condition detection device with Raspberry Pi technology. 
              Accurate, affordable, and easy to use at home.
            </p>

            {/* Product Gallery */}
            <div className="mb-8">
              <ProductGallery 
                images={[productImage1, productImage2]} 
                className="w-full max-w-lg mx-auto"
              />
            </div>

            {/* Features */}
            <div className="space-y-6 sm:space-y-8">
              <h3 className="text-3xl sm:text-4xl font-black text-gradient">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 glass border-white/10 card-hover group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:neon-glow transition-all duration-300">
                    <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base sm:text-lg mb-1 sm:mb-2">High-Resolution Camera</h4>
                    <p className="text-white/70 text-sm sm:text-base">Raspberry Pi camera module for detailed skin imaging</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 glass border-white/10 card-hover group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 gradient-accent rounded-xl flex items-center justify-center flex-shrink-0 group-hover:neon-glow-green transition-all duration-300">
                    <Cpu className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base sm:text-lg mb-1 sm:mb-2">AI Processing</h4>
                    <p className="text-white/70 text-sm sm:text-base">Advanced machine learning for accurate detection</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 glass border-white/10 card-hover group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-success to-green-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-success/50 transition-all duration-300">
                    <Wifi className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base sm:text-lg mb-1 sm:mb-2">Cloud Connectivity</h4>
                    <p className="text-white/70 text-sm sm:text-base">Seamless data sync to your personal dashboard</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 glass border-white/10 card-hover group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-warning to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-warning/50 transition-all duration-300">
                    <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base sm:text-lg mb-1 sm:mb-2">Privacy Secure</h4>
                    <p className="text-white/70 text-sm sm:text-base">Your health data is encrypted and protected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="mt-12">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">What's Included</h3>
              <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-2xl p-6 border border-success/20">
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                    <span className="text-lg">NIVARA Device with Raspberry Pi</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                    <span className="text-lg">High-resolution camera module</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                    <span className="text-lg">Power adapter and USB cables</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                    <span className="text-lg">Quick start guide and documentation</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                    <span className="text-lg">Free access to NIVARA web platform</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                    <span className="text-lg">12-month warranty</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Purchase Section */}
          <div>
            <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Order Your NIVARA Device</CardTitle>
                <CardDescription className="text-lg">
                  Fill in your details to complete your purchase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pricing */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-bold text-primary">₹{devicePrice.toLocaleString()}</span>
                    <Badge className="bg-accent/10 text-accent border-accent/20 animate-pulse">Limited Time Offer</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="quantity" className="text-base font-medium">Quantity</Label>
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border-2 hover:border-primary transition-colors duration-200"
                      >
                        -
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-24 text-center h-10 text-lg font-semibold border-2 focus:border-primary transition-colors duration-200"
                        min="1"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full border-2 hover:border-primary transition-colors duration-200"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Shipping Information */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Shipping Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="name" className="text-sm sm:text-base font-medium">Full Name *</Label>
                      <Input
                        id="name"
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                        required
                        className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary transition-colors duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="phone" className="text-sm sm:text-base font-medium">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        required
                        className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary transition-colors duration-200"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="email" className="text-sm sm:text-base font-medium">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      required
                      className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary transition-colors duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="address" className="text-sm sm:text-base font-medium">Address *</Label>
                    <Textarea
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      rows={3}
                      required
                      className="text-sm sm:text-base border-2 focus:border-primary transition-colors duration-200"
                      placeholder="Enter your complete address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm sm:text-base">City *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        required
                        className="h-10 sm:h-12 text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm sm:text-base">State *</Label>
                      <Input
                        id="state"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        required
                        className="h-10 sm:h-12 text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode" className="text-sm sm:text-base">PIN Code *</Label>
                      <Input
                        id="pincode"
                        value={shippingInfo.pincode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                        required
                        className="h-10 sm:h-12 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>NIVARA Device × {quantity}</span>
                      <span>₹{(devicePrice * quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-success font-semibold">FREE</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handlePurchase}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Complete Purchase"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By placing this order, you agree to our terms and conditions. 
                  Secure payment processing powered by Stripe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}