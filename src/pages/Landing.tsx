import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Scan, Brain, Stethoscope, CheckCircle, Star, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/logo/Nivara_logo.png";

export default function Landing() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl float" style={{animationDelay: '4s'}}></div>
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
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/buy">
                  <Button>Buy Device</Button>
                </Link>
                <Button variant="ghost" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/buy">
                  <Button>Buy Now</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-32 text-center relative">
        <div className="relative z-10">
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <span className="text-gradient">NIVARA</span>
            <br />
            <span className="text-4xl md:text-6xl text-white/90 font-light">
              Smart Skin Health
            </span>
            <br />
            <span className="text-3xl md:text-5xl text-primary font-bold">
              Detection Platform
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed text-lg">
            Revolutionary AI-powered device that scans and analyzes skin conditions in seconds. 
            Early detection made accessible, affordable, and accurate with cutting-edge technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/buy">
              <Button size="lg" className="text-lg px-12 py-4 gradient-primary hover:neon-glow transition-all duration-300 transform hover:scale-105 btn-glow rounded-xl font-semibold">
                Get Your NIVARA Device
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
            <div className="flex gap-4">
              <Link to="/doctors">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 glass border-primary/30 hover:border-primary hover:neon-glow transition-all duration-300 rounded-xl">
                  Find Dermatologists
                </Button>
              </Link>
              <Link to="/service-centers">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 glass border-accent/30 hover:border-accent hover:neon-glow-green transition-all duration-300 rounded-xl">
                  Service Centers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-32 relative">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-gradient">
            How NIVARA Works
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Four revolutionary steps to transform your skin health monitoring
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"></div>
          
          <Card className="text-center glass border-white/10 card-hover group">
            <CardContent className="p-8">
              <div className="w-24 h-24 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:neon-glow transition-all duration-300">
                <Scan className="w-12 h-12 text-white" />
              </div>
              <div className="w-10 h-10 gradient-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Scan</h3>
              <p className="text-white/70 leading-relaxed text-lg">
                Use the Raspberry Pi camera to capture high-quality images of skin areas
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center glass border-white/10 card-hover group">
            <CardContent className="p-8">
              <div className="w-24 h-24 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:neon-glow-green transition-all duration-300">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div className="w-10 h-10 gradient-accent text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">AI Analysis</h3>
              <p className="text-white/70 leading-relaxed text-lg">
                Advanced machine learning algorithms analyze patterns and identify potential conditions
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center glass border-white/10 card-hover group">
            <CardContent className="p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-warning to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-warning/50 transition-all duration-300">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-warning to-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Get Insights</h3>
              <p className="text-white/70 leading-relaxed text-lg">
                Receive detailed analysis with confidence scores and recommendations
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center glass border-white/10 card-hover group">
            <CardContent className="p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-success to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-success/50 transition-all duration-300">
                <Stethoscope className="w-12 h-12 text-white" />
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-success to-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                4
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Connect with Doctor</h3>
              <p className="text-white/70 leading-relaxed text-lg">
                Find nearby dermatologists and book appointments when needed
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-gradient">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Proven results in skin health detection and monitoring worldwide
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="glass border-white/10 p-8 rounded-2xl card-hover">
                <h3 className="text-6xl font-black text-primary mb-6 ">90%+</h3>
                <p className="text-white/80 text-xl mb-6 font-semibold">Accuracy in skin condition detection</p>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div className="gradient-primary h-3 rounded-full transition-all duration-1000" style={{width: '90%'}}></div>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="glass border-white/10 p-8 rounded-2xl card-hover">
                <h3 className="text-6xl font-black text-accent mb-6 ">2M+</h3>
                <p className="text-white/80 text-xl mb-6 font-semibold">People affected by skin conditions annually</p>
                <div className="flex justify-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-accent rounded-full " style={{animationDelay: `${i * 0.1}s`}}></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="group">
              <div className="glass border-white/10 p-8 rounded-2xl card-hover">
                <h3 className="text-6xl font-black text-success mb-6 ">Early</h3>
                <p className="text-white/80 text-xl mb-6 font-semibold">Detection saves lives and reduces treatment costs</p>
                <div className="flex justify-center">
                  <CheckCircle className="w-12 h-12 text-success animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-32 relative">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-gradient">
            What Users Say
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">Real feedback from our community</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass border-white/10 card-hover">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-warning text-warning animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                ))}
              </div>
              <p className="text-white/80 mb-6 text-lg leading-relaxed italic">
                "NIVARA helped me detect a suspicious mole early. The peace of mind is invaluable."
              </p>
              <div className="flex items-center">
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">SM</span>
                </div>
                <div>
                  <div className="font-bold text-white text-lg">Dr. Sarah M.</div>
                  <div className="text-sm text-white/70">Healthcare Professional</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/10 card-hover">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-warning text-warning animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                ))}
              </div>
              <p className="text-white/80 mb-6 text-lg leading-relaxed italic">
                "Affordable and accurate. Finally, health monitoring that's accessible to everyone."
              </p>
              <div className="flex items-center">
                <div className="w-14 h-14 gradient-accent rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">RP</span>
                </div>
                <div>
                  <div className="font-bold text-white text-lg">Raj P.</div>
                  <div className="text-sm text-white/70">NIVARA User</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/10 card-hover">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-warning text-warning animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                ))}
              </div>
              <p className="text-white/80 mb-6 text-lg leading-relaxed italic">
                "The AI analysis is remarkably accurate. It's like having a dermatologist at home."
              </p>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-success to-green-500 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">PK</span>
                </div>
                <div>
                  <div className="font-bold text-white text-lg">Priya K.</div>
                  <div className="text-sm text-white/70">Medical Student</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight text-white">
              Take Control of Your
              <br />
              <span className="text-gradient">Skin Health Today</span>
            </h2>
            <p className="text-xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users who trust NIVARA for early detection and peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/buy">
                <Button size="lg" className="text-lg px-12 py-4 bg-white text-primary hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 btn-glow rounded-xl font-bold">
                  Order Your NIVARA Device
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              <div className="flex items-center space-x-8 text-white">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  <span className="font-semibold">Free Shipping</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  <span className="font-semibold">12-Month Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 glass py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <Scan className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient">NIVARA</span>
              </div>
              <p className="text-white/70 text-lg leading-relaxed">
                Smart, affordable skin health detection for everyone.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Product</h4>
              <ul className="space-y-3 text-white/70">
                <li><Link to="/buy" className="hover:text-white transition-colors text-lg">Buy Device</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors text-lg">User Portal</Link></li>
                <li><Link to="/doctors" className="hover:text-white transition-colors text-lg">Find Doctors</Link></li>
                <li><Link to="/service-centers" className="hover:text-white transition-colors text-lg">Service Centers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Support</h4>
              <ul className="space-y-3 text-white/70">
                <li><a href="mailto:support@nivara.com" className="hover:text-white transition-colors text-lg">Help Center</a></li>
                <li><a href="mailto:contact@nivara.com" className="hover:text-white transition-colors text-lg">Contact Us</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors text-lg">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Company</h4>
              <ul className="space-y-3 text-white/70">
                <li><a href="/about" className="hover:text-white transition-colors text-lg">About Us</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors text-lg">Careers</a></li>
                <li><a href="/press" className="hover:text-white transition-colors text-lg">Press</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/60 text-lg">&copy; 2024 NIVARA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}