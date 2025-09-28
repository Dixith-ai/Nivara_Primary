import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Scan, 
  MapPin, 
  Phone, 
  Globe, 
  Navigation, 
  ArrowLeft,
  Stethoscope,
  Star,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/logo/Nivara_logo.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import MobileNavigation from "@/components/MobileNavigation";

interface Doctor {
  doctor_id: string;
  name: string;
  specialization: string;
  hospital: string;
  address: string;
  phone: string;
  location_lat: number;
  location_long: number;
  website: string;
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Unable to load doctors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery === "" || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationQuery === "" ||
      doctor.address.toLowerCase().includes(locationQuery.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  const openInMaps = (doctor: Doctor) => {
    if (doctor.location_lat && doctor.location_long) {
      const url = `https://www.google.com/maps/search/?api=1&query=${doctor.location_lat},${doctor.location_long}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.address)}`;
      window.open(url, '_blank');
    }
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
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Find Dermatologists & Hospitals
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with qualified dermatologists in your area for professional consultation 
            and treatment recommendations.
          </p>
        </div>

        {/* Search Filters */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Doctors or Hospitals</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Doctor name, hospital, or specialization..."
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
                    placeholder="City, area, or PIN code..."
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
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">Loading doctors...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {filteredDoctors.length} Dermatologists Found
              </h2>
              <Badge variant="outline" className="text-xs sm:text-sm">
                {filteredDoctors.length} results
              </Badge>
            </div>

            {filteredDoctors.length === 0 ? (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or location.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <Card key={doctor.doctor_id} className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{doctor.name}</CardTitle>
                          <CardDescription className="text-base mt-1">
                            {doctor.specialization}
                          </CardDescription>
                        </div>
                        <Badge className="bg-success/10 text-success hover:bg-success/20">
                          <Star className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Stethoscope className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doctor.hospital}</p>
                          <p className="text-sm text-muted-foreground">Hospital/Clinic</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm">{doctor.address}</p>
                          <p className="text-xs text-muted-foreground">Address</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => window.open(`tel:${doctor.phone}`, '_self')}
                          className="flex-1"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => openInMaps(doctor)}
                          className="flex-1"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Directions
                        </Button>
                        
                        {doctor.website && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => window.open(doctor.website, '_blank')}
                            className="flex-1"
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Website
                          </Button>
                        )}
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                          <Phone className="w-3 h-3 inline mr-1" />
                          {doctor.phone}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Help Section */}
        <Card className="border-0 shadow-lg bg-primary text-primary-foreground mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Need Help Finding the Right Doctor?</h3>
            <p className="text-lg opacity-90 mb-6">
              Our support team can help you connect with the most suitable dermatologist 
              based on your specific needs and scan results.
            </p>
            <Button size="lg" variant="secondary">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}