import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Scan, 
  MapPin, 
  Phone, 
  Mail, 
  Navigation, 
  ArrowLeft,
  Building2,
  Clock,
  Calendar,
  Search,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/logo/Nivara_logo.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import MobileNavigation from "@/components/MobileNavigation";

interface ServiceCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  location_lat: number;
  location_long: number;
  services: string[];
  operating_hours: any;
  appointment_slots: any;
}

export default function ServiceCenters() {
  const { user } = useAuth();
  const [centers, setCenters] = useState<ServiceCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<ServiceCenter | null>(null);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    notes: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchServiceCenters();
  }, []);

  const fetchServiceCenters = async () => {
    try {
      const { data, error } = await supabase
        .from('service_centers')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setCenters(data || []);
    } catch (error) {
      console.error('Error fetching service centers:', error);
      toast({
        title: "Error",
        description: "Unable to load service centers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCenters = centers.filter(center => {
    const matchesSearch = searchQuery === "" || 
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = locationQuery === "" ||
      center.address.toLowerCase().includes(locationQuery.toLowerCase()) ||
      center.city.toLowerCase().includes(locationQuery.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  const openInMaps = (center: ServiceCenter) => {
    if (center.location_lat && center.location_long) {
      const url = `https://www.google.com/maps/search/?api=1&query=${center.location_lat},${center.location_long}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address)}`;
      window.open(url, '_blank');
    }
  };

  const handleBookAppointment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    if (!bookingForm.date || !bookingForm.time) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for your appointment.",
        variant: "destructive",
      });
      return;
    }

    setBookingLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert([{
          user_id: user.id,
          service_center_id: selectedCenter?.id,
          appointment_date: bookingForm.date,
          appointment_time: bookingForm.time,
          notes: bookingForm.notes,
        }]);

      if (error) throw error;

      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been scheduled successfully.",
      });

      setBookingForm({ date: "", time: "", notes: "" });
      setSelectedCenter(null);
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      if (error.code === '23505') {
        toast({
          title: "Time Slot Unavailable",
          description: "This time slot is already booked. Please choose another time.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Booking Failed",
          description: "Unable to book appointment. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const getAvailableSlots = (center: ServiceCenter, selectedDate: string) => {
    if (!selectedDate) return [];
    
    const slots = center.appointment_slots;
    return [
      ...(slots?.morning || []),
      ...(slots?.afternoon || []),
      ...(slots?.evening || [])
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img src={logo} alt="NIVARA Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold text-foreground">NIVARA</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Link to="/" className="hidden sm:flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <MobileNavigation />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            NIVARA Service Centers
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Visit our authorized service centers for professional skin health scanning and consultation, 
            even without owning a NIVARA device.
          </p>
        </div>

        {/* Search Filters */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Centers or Services</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Center name or service type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 sm:h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="City or area..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="pl-10 h-10 sm:h-11"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">Loading service centers...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {filteredCenters.length} Service Centers Found
              </h2>
              <Badge variant="outline" className="text-xs sm:text-sm">
                {filteredCenters.length} results
              </Badge>
            </div>

            {filteredCenters.length === 0 ? (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 sm:p-12 text-center">
                  <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No service centers found</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Try adjusting your search criteria or location.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {filteredCenters.map((center) => (
                  <Card key={center.id} className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg sm:text-xl truncate">{center.name}</CardTitle>
                          <CardDescription className="text-sm sm:text-base mt-1">
                            {center.city}
                          </CardDescription>
                        </div>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 flex-shrink-0 ml-2">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">Authorized</span>
                          <span className="sm:hidden">✓</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3 sm:space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm break-words">{center.address}</p>
                          <p className="text-xs text-muted-foreground">Address</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-1">
                            {center.services.map((service, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">Services Available</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => window.open(`tel:${center.phone}`, '_self')}
                          className="w-full h-10"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Call</span>
                          <span className="sm:hidden">📞</span>
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => openInMaps(center)}
                          className="w-full h-10"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Directions</span>
                          <span className="sm:hidden">🗺️</span>
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full h-10"
                              onClick={() => setSelectedCenter(center)}
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">Book</span>
                              <span className="sm:hidden">📅</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md mx-auto">
                            <DialogHeader>
                              <DialogTitle className="text-lg sm:text-xl">Book Appointment</DialogTitle>
                              <DialogDescription className="text-sm sm:text-base">
                                Schedule your visit to {selectedCenter?.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="date" className="text-sm sm:text-base">Appointment Date</Label>
                                <Input
                                  id="date"
                                  type="date"
                                  value={bookingForm.date}
                                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                                  min={new Date().toISOString().split('T')[0]}
                                  className="h-10 sm:h-11"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="time" className="text-sm sm:text-base">Preferred Time</Label>
                                <Select
                                  value={bookingForm.time}
                                  onValueChange={(value) => setBookingForm({ ...bookingForm, time: value })}
                                >
                                  <SelectTrigger className="h-10 sm:h-11">
                                    <SelectValue placeholder="Select time slot" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {selectedCenter && getAvailableSlots(selectedCenter, bookingForm.date).map((slot) => (
                                      <SelectItem key={slot} value={slot}>
                                        {slot}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm sm:text-base">Additional Notes (Optional)</Label>
                                <Textarea
                                  id="notes"
                                  placeholder="Any specific requirements or concerns..."
                                  value={bookingForm.notes}
                                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                                  rows={3}
                                  className="text-sm sm:text-base"
                                />
                              </div>
                              
                              <Button 
                                className="w-full h-10 sm:h-11" 
                                onClick={handleBookAppointment}
                                disabled={bookingLoading}
                              >
                                {bookingLoading ? "Booking..." : "Confirm Appointment"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-2 sm:p-3 space-y-1">
                        <p className="text-xs text-muted-foreground break-all">
                          <Phone className="w-3 h-3 inline mr-1" />
                          {center.phone}
                        </p>
                        <p className="text-xs text-muted-foreground break-all">
                          <Mail className="w-3 h-3 inline mr-1" />
                          {center.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Operating Hours Available
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        <Card className="border-0 shadow-lg bg-accent text-accent-foreground mt-8 sm:mt-12">
          <CardContent className="p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">Why Visit a Service Center?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-background/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Scan className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Professional Equipment</h4>
                <p className="text-xs sm:text-sm opacity-90">Access to advanced NIVARA scanning technology</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-background/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Expert Consultation</h4>
                <p className="text-xs sm:text-sm opacity-90">Trained professionals to guide your health journey</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-background/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Immediate Results</h4>
                <p className="text-xs sm:text-sm opacity-90">Get instant analysis and recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}