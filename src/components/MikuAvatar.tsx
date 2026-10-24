import React from 'react';

interface MikuAvatarProps {
  expression?: 'happy' | 'cheering' | 'singing' | 'thinking' | 'celebrating';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bubbleMessage?: string;
  bubbleBadge?: string;
  customSrc?: string;
  className?: string;
}

export const MikuAvatar: React.FC<MikuAvatarProps> = ({
  expression = 'happy',
  size = 'md',
  bubbleMessage,
  bubbleBadge = 'Hatsune Miku',
  customSrc,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-36 sm:h-36',
    xl: 'w-40 h-40 sm:w-48 sm:h-48',
  };

  // Asignar imagen del paquete oficial según la emoción
  const getImageSource = (): string => {
    if (customSrc) return customSrc;
    switch (expression) {
      case 'celebrating':
        return '/images/miku/miku-holding-cake.png';
      case 'singing':
        return '/images/miku/miku-singing.png';
      case 'cheering':
        return '/images/miku/miku-peace.png';
      case 'thinking':
        return '/images/miku/miku-sweet.png';
      case 'happy':
      default:
        return '/images/miku/miku-happy.png';
    }
  };

  const imageSrc = getImageSource();

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-4 ${className}`}>
      {/* Ilustración auténtica de Hatsune Miku del paquete de recursos */}
      <div className={`relative shrink-0 ${sizeMap[size]} transition-transform duration-300 hover:scale-105 select-none`}>
        {/* Halo de luz turquesa/lavanda */}
        <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#39C5BB]/40 via-purple-500/30 to-pink-400/40 rounded-3xl blur-md opacity-80" />
        
        <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-[#39C5BB] bg-purple-100/70 shadow-md">
          <img
            src={imageSrc}
            alt="Hatsune Miku"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Pequeña insignia decorativa */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-[#39C5BB] flex items-center justify-center text-[11px] shadow-md border border-white">
          ✨
        </div>
      </div>

      {/* Globo de diálogo en paleta morado y blanco */}
      {bubbleMessage && (
        <div className="relative flex-1 bg-white/95 border-2 border-purple-200/90 rounded-2xl p-4 sm:p-5 shadow-md text-purple-950 max-w-xl">
          {/* Flecha del diálogo apuntando a Miku */}
          <div className="hidden sm:block absolute -left-2.5 top-6 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-white" />
          
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-purple-700 tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-[#39C5BB]" />
            <span>{bubbleBadge}</span>
          </div>
          
          <p className="text-sm md:text-base leading-relaxed text-purple-950 whitespace-pre-line font-medium">
            {bubbleMessage}
          </p>
        </div>
      )}
    </div>
  );
};
