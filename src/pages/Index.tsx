import { BlattGame } from '@/components/game/BlattGame';
import backgroundPattern from '@/assets/background-pattern.png';

const Index = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${backgroundPattern})`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Dark overlay to reduce pattern visibility */}
      <div className="absolute inset-0 bg-background/70" />
      
      <main className="relative z-10">
        <BlattGame />
      </main>
    </div>
  );
};

export default Index;
