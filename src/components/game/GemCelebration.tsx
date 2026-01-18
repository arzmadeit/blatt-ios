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
        "transition-opacity duration-500",
        isZooming ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/98 backdrop-blur-lg" />

      {/* Intense center light beam burst */}
      <div
        className={cn(
          "absolute w-[800px] h-[800px] pointer-events-none",
          showFlash && "animate-light-beam"
        )}
        style={{
          background: `radial-gradient(circle at center, ${gem.glowColor} 0%, ${gem.color}90 20%, ${gem.color}40 40%, transparent 70%)`,
        }}
      />

      {/* Light rays shooting out from center */}
      <div
        className={cn(
          "absolute w-[900px] h-[900px] pointer-events-none",
          showFlash && "animate-light-rays"
        )}
        style={{
          background: `conic-gradient(from 0deg, 
            transparent 0deg, ${gem.glowColor}80 5deg, transparent 10deg,
            transparent 20deg, ${gem.glowColor}60 25deg, transparent 30deg,
            transparent 40deg, ${gem.glowColor}80 45deg, transparent 50deg,
            transparent 60deg, ${gem.glowColor}60 65deg, transparent 70deg,
            transparent 80deg, ${gem.glowColor}80 85deg, transparent 90deg,
            transparent 100deg, ${gem.glowColor}60 105deg, transparent 110deg,
            transparent 120deg, ${gem.glowColor}80 125deg, transparent 130deg,
            transparent 140deg, ${gem.glowColor}60 145deg, transparent 150deg,
            transparent 160deg, ${gem.glowColor}80 165deg, transparent 170deg,
            transparent 180deg, ${gem.glowColor}60 185deg, transparent 190deg,
            transparent 200deg, ${gem.glowColor}80 205deg, transparent 210deg,
            transparent 220deg, ${gem.glowColor}60 225deg, transparent 230deg,
            transparent 240deg, ${gem.glowColor}80 245deg, transparent 250deg,
            transparent 260deg, ${gem.glowColor}60 265deg, transparent 270deg,
            transparent 280deg, ${gem.glowColor}80 285deg, transparent 290deg,
            transparent 300deg, ${gem.glowColor}60 305deg, transparent 310deg,
            transparent 320deg, ${gem.glowColor}80 325deg, transparent 330deg,
            transparent 340deg, ${gem.glowColor}60 345deg, transparent 350deg,
            transparent 355deg, ${gem.glowColor}80 360deg
          )`,
          borderRadius: '50%',
        }}
      />

      {/* Starburst effect behind gem */}
      <div
        className={cn(
          "absolute w-[500px] h-[500px] pointer-events-none",
          showFlash && "animate-starburst"
        )}
        style={{
          background: `conic-gradient(from 45deg,
            ${gem.glowColor}90 0deg, transparent 15deg,
            ${gem.glowColor}90 30deg, transparent 45deg,
            ${gem.glowColor}90 60deg, transparent 75deg,
            ${gem.glowColor}90 90deg, transparent 105deg,
            ${gem.glowColor}90 120deg, transparent 135deg,
            ${gem.glowColor}90 150deg, transparent 165deg,
            ${gem.glowColor}90 180deg, transparent 195deg,
            ${gem.glowColor}90 210deg, transparent 225deg,
            ${gem.glowColor}90 240deg, transparent 255deg,
            ${gem.glowColor}90 270deg, transparent 285deg,
            ${gem.glowColor}90 300deg, transparent 315deg,
            ${gem.glowColor}90 330deg, transparent 345deg,
            ${gem.glowColor}90 360deg
          )`,
          borderRadius: '50%',
        }}
      />

      {/* Pulsing center glow */}
      <div
        className={cn(
          "absolute w-96 h-96 rounded-full pointer-events-none",
          isZooming && "animate-center-glow"
        )}
        style={{
          background: `radial-gradient(circle, ${gem.glowColor}60 0%, ${gem.color}30 40%, transparent 70%)`,
          boxShadow: `0 0 100px ${gem.color}80, 0 0 200px ${gem.color}40`,
        }}
      />

      {/* Diamond-only massive light burst */}
      {gemValue === 11 && (
        <div
          className={cn(
            "absolute w-[1200px] h-[1200px] pointer-events-none",
            showFlash && "animate-diamond-burst"
          )}
          style={{
            background: `radial-gradient(circle at center, 
              white 0%, 
              hsl(0, 0%, 95%) 5%,
              hsl(0, 0%, 90%)80 15%, 
              hsl(0, 0%, 85%)50 30%, 
              hsl(0, 0%, 80%)20 50%, 
              transparent 70%)`,
            boxShadow: `0 0 200px 100px rgba(255,255,255,0.8), 0 0 400px 200px rgba(255,255,255,0.4)`,
          }}
        />
      )}

      {/* Gem container with zoom + hover animation */}
      <div
        className={cn(
          "relative z-10 flex flex-col items-center gap-8",
          isZooming ? "animate-gem-zoom" : "scale-0 opacity-0"
        )}
        style={{
          animationFillMode: 'forwards',
        }}
      >
        {/* Gem image with intense glow and hover */}
        <div
          className={cn(
            "relative",
            isZooming && "animate-gem-hover"
          )}
          style={{
            animationDelay: '1s',
            filter: gemValue === 11 
              ? `drop-shadow(0 0 80px white) drop-shadow(0 0 150px white) drop-shadow(0 0 250px ${gem.color})`
              : `drop-shadow(0 0 50px ${gem.glowColor}) drop-shadow(0 0 100px ${gem.color}) drop-shadow(0 0 150px ${gem.color}80)`,
          }}
        >
          <img
            src={gem.image}
            alt={gem.name}
            className={cn(
              "object-contain animate-gem-pulse",
              gemValue === 11 ? "w-96 h-96" : "w-80 h-80"
            )}
            style={{ color: gem.color }}
          />
        </div>

        {/* Gem name with glow */}
        <h2
          className={cn(
            "font-display tracking-[0.4em] font-bold",
            gemValue === 11 ? "text-6xl" : "text-5xl"
          )}
          style={{ 
            color: gem.color, 
            textShadow: gemValue === 11 
              ? `0 0 60px white, 0 0 120px white, 0 0 180px ${gem.color}`
              : `0 0 40px ${gem.glowColor}, 0 0 80px ${gem.color}, 0 0 120px ${gem.color}60` 
          }}
        >
          {gem.name.toUpperCase()}
        </h2>
      </div>

      {/* Sparkle particles - more intense */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white rounded-full animate-sparkle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.1}s`,
              opacity: 0,
              boxShadow: `0 0 10px 4px white, 0 0 20px 6px ${gem.glowColor}`,
            }}
          />
        ))}
      </div>

      {/* Outer glow ring */}
      <div
        className={cn(
          "absolute w-[450px] h-[450px] rounded-full pointer-events-none",
          "transition-all duration-1000",
          isZooming ? "opacity-70 scale-100" : "opacity-0 scale-50"
        )}
        style={{
          background: `radial-gradient(circle, transparent 50%, ${gem.color}40 70%, transparent 90%)`,
          boxShadow: `0 0 80px ${gem.color}50, inset 0 0 80px ${gem.color}30`,
        }}
      />
    </div>
  );
};
