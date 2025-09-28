import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Home, User, LogOut, Stethoscope, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/logo/Nivara_logo.png";

interface MobileNavigationProps {
  className?: string;
}

export default function MobileNavigation({ className }: MobileNavigationProps) {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="lg:hidden">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-sm border-l border-white/10">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link to="/" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-lg">
                <img src={logo} alt="NIVARA Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-gradient">NIVARA</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start h-12">
                <Home className="w-5 h-5 mr-3" />
                Home
              </Button>
            </Link>
            
            <Link to="/doctors" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start h-12">
                <Stethoscope className="w-5 h-5 mr-3" />
                Find Doctors
              </Button>
            </Link>
            
            <Link to="/service-centers" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start h-12">
                <Building2 className="w-5 h-5 mr-3" />
                Service Centers
              </Button>
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start h-12">
                    <User className="w-5 h-5 mr-3" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-12 text-destructive hover:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start h-12">
                  <User className="w-5 h-5 mr-3" />
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <Link to="/buy" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-12 gradient-primary hover:neon-glow transition-all duration-300">
                Buy NIVARA Device
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
