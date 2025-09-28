import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Scan, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Plus,
  CheckCircle,
  AlertTriangle,
  Download,
  Home,
  ArrowLeft
} from "lucide-react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/logo/Nivara_logo.png";
import MobileNavigation from "@/components/MobileNavigation";

interface Profile {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

interface Device {
  device_id: string;
  status: string;
  registration_date: string;
}

interface Scan {
  scan_id: string;
  timestamp: string;
  condition_detected: string;
  confidence_score: number;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [newDeviceId, setNewDeviceId] = useState("");
  const [registering, setRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch devices
      const { data: devicesData } = await supabase
        .from('devices')
        .select('*')
        .eq('user_id', user?.id);
      
      if (devicesData) {
        setDevices(devicesData);
        
        // Fetch recent scans for user's devices
        if (devicesData.length > 0) {
          const deviceIds = devicesData.map(d => d.device_id);
          const { data: scansData } = await supabase
            .from('scans')
            .select('*')
            .in('device_id', deviceIds)
            .order('timestamp', { ascending: false })
            .limit(5);
          
          if (scansData) {
            setRecentScans(scansData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerDevice = async () => {
    if (!newDeviceId.trim()) return;
    
    setRegistering(true);
    try {
      // Check if device exists and is not already registered
      const { data: device, error: fetchError } = await supabase
        .from('devices')
        .select('*')
        .eq('device_id', newDeviceId)
        .single();

      if (fetchError || !device) {
        toast({
          title: "Device Not Found",
          description: "Please check your device ID and try again.",
          variant: "destructive",
        });
        return;
      }

      if (device.user_id) {
        toast({
          title: "Device Already Registered",
          description: "This device is already registered to another user.",
          variant: "destructive",
        });
        return;
      }

      // Register device to user
      const { error: updateError } = await supabase
        .from('devices')
        .update({
          user_id: user?.id,
          status: 'active',
          registration_date: new Date().toISOString(),
        })
        .eq('device_id', newDeviceId);

      if (updateError) throw updateError;

      toast({
        title: "Device Registered Successfully!",
        description: "Your NIVARA device is now active and ready to use.",
      });

      setNewDeviceId("");
      fetchUserData();
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Unable to register device. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Scan className="w-6 h-6 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity duration-200">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg">
                <img src={logo} alt="NIVARA Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-foreground bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">NIVARA</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="hover:bg-primary/5 transition-colors duration-200">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/doctors">
                <Button variant="ghost" size="sm" className="hover:bg-primary/5 transition-colors duration-200">Find Doctors</Button>
              </Link>
              <Link to="/service-centers">
                <Button variant="ghost" size="sm" className="hover:bg-primary/5 transition-colors duration-200">Service Centers</Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-muted-foreground font-medium hidden md:block text-sm sm:text-base">Welcome, {profile?.name || user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:flex hover:bg-destructive/5 transition-colors duration-200">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <MobileNavigation />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        </div>
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 relative z-10 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Monitor your skin health and manage your NIVARA devices
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="hover:bg-primary/5 transition-colors duration-200 w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/buy" className="w-full sm:w-auto">
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Buy Device
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 relative z-10">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium">Total Scans</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">{recentScans.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium">Active Devices</p>
                  <p className="text-2xl sm:text-3xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">{devices.filter(d => d.status === 'active').length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent/10 to-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Scan className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium">This Month</p>
                  <p className="text-2xl sm:text-3xl font-bold text-success group-hover:scale-110 transition-transform duration-300">{recentScans.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-success/10 to-success/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium">Avg. Confidence</p>
                  <p className="text-2xl sm:text-3xl font-bold text-warning group-hover:scale-110 transition-transform duration-300">
                    {recentScans.length > 0 
                      ? Math.round(recentScans.reduce((acc, scan) => acc + (scan.confidence_score || 0), 0) / recentScans.length * 100)
                      : 0}%
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-warning/10 to-warning/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
          {/* Recent Scans */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Recent Scans</CardTitle>
                <CardDescription className="text-base">
                  Your latest skin health analysis results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentScans.length === 0 ? (
                  <div className="text-center py-8">
                    <Scan className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No scans yet</p>
                    <p className="text-sm text-muted-foreground">
                      Register a device to start scanning
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentScans.map((scan) => (
                      <div key={scan.scan_id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            (scan.confidence_score || 0) > 0.8 ? 'bg-success' : 
                            (scan.confidence_score || 0) > 0.6 ? 'bg-warning' : 'bg-destructive'
                          }`} />
                          <div>
                            <p className="font-medium">{scan.condition_detected || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(scan.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {Math.round((scan.confidence_score || 0) * 100)}% confidence
                        </Badge>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Device Management */}
          <div className="space-y-6">
            {/* Register Device */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Register Device</CardTitle>
                <CardDescription>
                  Add a new NIVARA device to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="device-id">Device ID</Label>
                  <Input
                    id="device-id"
                    placeholder="Enter device ID (e.g., NIVARA-001-ABC123)"
                    value={newDeviceId}
                    onChange={(e) => setNewDeviceId(e.target.value)}
                    disabled={registering}
                  />
                </div>
                <Button 
                  onClick={registerDevice} 
                  disabled={!newDeviceId || registering}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {registering ? "Registering..." : "Register Device"}
                </Button>
              </CardContent>
            </Card>

            {/* My Devices */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>My Devices</CardTitle>
                <CardDescription>
                  Manage your registered NIVARA devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {devices.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No devices registered</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {devices.map((device) => (
                      <div key={device.device_id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{device.device_id}</p>
                          <p className="text-xs text-muted-foreground">
                            Registered: {new Date(device.registration_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
                          {device.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                          {device.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}