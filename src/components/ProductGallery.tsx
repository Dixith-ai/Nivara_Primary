import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  className?: string;
}

export default function ProductGallery({ images, className }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const resetView = () => {
    setIsZoomed(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [currentImageIndex]);

  return (
    <div className={cn("relative group", className)}>
      {/* Main Image Display */}
      <Card className="glass border-white/10 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
        <CardContent className="p-0 relative">
          <div className="relative aspect-square bg-gradient-to-br from-primary/5 to-secondary/5">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
            
            <img
              src={currentImage}
              alt={`NIVARA Product ${currentImageIndex + 1}`}
              className={cn(
                "w-full h-full object-cover transition-all duration-700",
                isLoading ? "opacity-0" : "opacity-100",
                isZoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in hover:scale-105"
              )}
              onLoad={() => setIsLoading(false)}
            />

            {/* Image Overlay Controls */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={toggleZoom}
                  className="glass border-white/20 hover:neon-glow transition-all duration-300"
                >
                  {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={resetView}
                  className="glass border-white/20 hover:neon-glow transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 glass border-white/20 hover:neon-glow transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 glass border-white/20 hover:neon-glow transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute top-4 right-4 glass border-white/20 rounded-full px-3 py-1 text-sm font-medium">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-3 mt-6 justify-center">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-110",
                currentImageIndex === index
                  ? "border-primary shadow-lg shadow-primary/50"
                  : "border-white/20 hover:border-white/40"
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {currentImageIndex === index && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Product Badge */}
      <div className="absolute -top-3 -left-3 z-10">
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
          🚀 Smart Device
        </div>
      </div>
    </div>
  );
}
