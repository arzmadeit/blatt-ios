import { BlattGame } from '@/components/game/BlattGame';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Subtle decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10">
        <BlattGame />
      </main>
    </div>
  );
};

export default Index;
