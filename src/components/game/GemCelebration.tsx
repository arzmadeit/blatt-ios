import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Import gem images
import emeraldImg from '@/assets/gems/emerald.png';
import sapphireImg from '@/assets/gems/sapphire.png';
import rubyImg from '@/assets/gems/ruby.png';
import diamondImg from '@/assets/gems/diamond.png';

// Map tile values to gems - emerald=8, sapphire=9, ruby=10, diamond=11
const gemMap: Record<number, { image: string; name: string; color: string }> = {
  8: { image: emeraldImg, name: 'Emerald', color: 'hsl(145, 70%, 45%)' },
  9: { image: sapphireImg, name: 'Sapphire', color: 'hsl(220, 80%, 55%)' },
  10: { image: rubyImg, name: 'Ruby', color: 'hsl(350, 85%, 50%)' },
  11: { image: diamondImg, name: 'Diamond', color: 'hsl(0, 0%, 85%)' },
};

interface GemCelebrationProps {
  gemValue: number | null;
  onComplete: () => void;
}

export const GemCelebration = ({ gemValue, onComplete }: GemCelebrationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    if (gemValue && gemMap[gemValue]) {
      setIsVisible(true);
      setIsZooming(true);

      // Start fade out after 1.5 seconds
      const fadeTimer = setTimeout(() => {
        setIsZooming(false);
      }, 1500);

      // Complete and hide after 2 seconds
      const completeTimer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 2000);

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
        "transition-opacity duration-500",
        isZooming ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

      {/* Light flash effect */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          isZooming ? "animate-light-flash" : "opacity-0"
        )}
        style={{
          background: `radial-gradient(circle at center, ${gem.color}40 0%, transparent 70%)`,
        }}
      />

      {/* Gem container with zoom animation */}
      <div
        className={cn(
          "relative z-10 flex flex-col items-center gap-4",
          "transition-all duration-700 ease-out",
          isZooming ? "animate-gem-zoom" : "scale-75 opacity-0"
        )}
      >
        {/* Gem image with glow */}
        <div
          className="relative animate-gem-pulse"
          style={{
            filter: `drop-shadow(0 0 30px ${gem.color}) drop-shadow(0 0 60px ${gem.color}60)`,
          }}
        >
          <img
            src={gem.image}
            alt={gem.name}
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Gem name */}
        <h2
          className="font-display text-3xl tracking-widest"
          style={{ color: gem.color, textShadow: `0 0 20px ${gem.color}80` }}
        >
          {gem.name.toUpperCase()}
        </h2>
      </div>

      {/* Sparkle particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-sparkle"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.1}s`,
              opacity: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};
