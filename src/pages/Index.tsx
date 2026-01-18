import { BlattGame } from '@/components/game/BlattGame';
import backgroundPattern from '@/assets/background-pattern.png';

const Index = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${backgroundPattern})`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      <main className="relative z-10">
        <BlattGame />
      </main>
    </div>
  );
};

export default Index;
