import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Import gem images (transparent background versions)
import emeraldImg from '@/assets/gems/emerald.png';
import sapphireImg from '@/assets/gems/sapphire.png';
import rubyImg from '@/assets/gems/ruby.png';
import diamondImg from '@/assets/gems/diamond.png';

// Map tile values to gems - emerald=8, sapphire=9, ruby=10, diamond=11
const gemMap: Record<number, { image: string; name: string; color: string; glowColor: string }> = {
  8: { image: emeraldImg, name: 'Emerald', color: 'hsl(145, 70%, 45%)', glowColor: 'hsl(145, 80%, 55%)' },
  9: { image: sapphireImg, name: 'Sapphire', color: 'hsl(220, 80%, 55%)', glowColor: 'hsl(220, 90%, 65%)' },
  10: { image: rubyImg, name: 'Ruby', color: 'hsl(350, 85%, 50%)', glowColor: 'hsl(350, 90%, 60%)' },
  11: { image: diamondImg, name: 'Diamond', color: 'hsl(0, 0%, 85%)', glowColor: 'hsl(0, 0%, 95%)' },
};

interface GemCelebrationProps {
  gemValue: number | null;
  onComplete: () => void;
}

export const GemCelebration = ({ gemValue, onComplete }: GemCelebrationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (gemValue && gemMap[gemValue]) {
      setIsVisible(true);
      setShowFlash(true);
      
      // Delay the zoom slightly for flash to start first
      setTimeout(() => {
        setIsZooming(true);
      }, 100);

      // Start fade out after 3 seconds
      const fadeTimer = setTimeout(() => {
        setIsZooming(false);
        setShowFlash(false);
      }, 3000);

      // Complete and hide after 3.5 seconds
      const completeTimer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 3500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [gemValue, onComplete]);

  if (!isVisible || !gemValue || !gemMap[gemValue]) return null;

  const gem = gemMap[gemValue];

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "transition-opacity duration-700",
        isZooming ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />

      {/* Light flash burst behind gem */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          showFlash && "animate-light-flash"
        )}
        style={{
          background: `radial-gradient(circle at center, ${gem.glowColor} 0%, ${gem.color}80 30%, transparent 70%)`,
        }}
      />

      {/* Light rays effect */}
      <div
        className={cn(
          "absolute w-[600px] h-[600px] pointer-events-none",
          showFlash && "animate-light-rays"
        )}
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${gem.glowColor}40 10deg, transparent 20deg, ${gem.glowColor}30 30deg, transparent 40deg, ${gem.glowColor}40 50deg, transparent 60deg, ${gem.glowColor}30 70deg, transparent 80deg, ${gem.glowColor}40 90deg, transparent 100deg, ${gem.glowColor}30 110deg, transparent 120deg)`,
          borderRadius: '50%',
        }}
      />

      {/* Gem container with zoom animation */}
      <div
        className={cn(
          "relative z-10 flex flex-col items-center gap-6",
          "transition-all duration-1000 ease-out",
          isZooming ? "animate-gem-zoom" : "scale-50 opacity-0"
        )}
      >
        {/* Gem image with glow */}
        <div
          className="relative animate-gem-pulse"
          style={{
            filter: `drop-shadow(0 0 40px ${gem.glowColor}) drop-shadow(0 0 80px ${gem.color}80) drop-shadow(0 0 120px ${gem.color}40)`,
          }}
        >
          <img
            src={gem.image}
            alt={gem.name}
            className="w-56 h-56 object-contain"
          />
        </div>

        {/* Gem name */}
        <h2
          className="font-display text-4xl tracking-[0.3em] font-semibold"
          style={{ 
            color: gem.color, 
            textShadow: `0 0 30px ${gem.glowColor}, 0 0 60px ${gem.color}80` 
          }}
        >
          {gem.name.toUpperCase()}
        </h2>
      </div>

      {/* Sparkle particles - more of them */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-sparkle"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
              animationDelay: `${i * 0.15}s`,
              opacity: 0,
              boxShadow: '0 0 6px 2px white',
            }}
          />
        ))}
      </div>

      {/* Additional outer glow ring */}
      <div
        className={cn(
          "absolute w-80 h-80 rounded-full pointer-events-none",
          "transition-all duration-1000",
          isZooming ? "opacity-60 scale-100" : "opacity-0 scale-50"
        )}
        style={{
          background: `radial-gradient(circle, transparent 40%, ${gem.color}30 60%, transparent 80%)`,
          boxShadow: `0 0 60px ${gem.color}40, inset 0 0 60px ${gem.color}20`,
        }}
      />
    </div>
  );
};
