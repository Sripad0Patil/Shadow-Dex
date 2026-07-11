export default function GameContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 grid-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-4 py-8 md:px-8">
        <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
