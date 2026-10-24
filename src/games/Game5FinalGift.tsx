import React, { useState } from 'react';
import { MikuAvatar } from '../components/MikuAvatar';
import { soundManager } from '../utils/soundEffects';
import { Sparkles, Gift, ArrowRight } from 'lucide-react';

interface Game5FinalGiftProps {
  relics: {
    star: boolean;
    heart: boolean;
    key: boolean;
  };
  onComplete: () => void;
  onOpenGrandFinale: () => void;
  isAlreadyCompleted: boolean;
}

export const Game5FinalGift: React.FC<Game5FinalGiftProps> = ({
  relics,
  onComplete,
  onOpenGrandFinale,
  isAlreadyCompleted,
}) => {
  const [placedItems, setPlacedItems] = useState<{ star: boolean; heart: boolean; key: boolean }>({
    star: isAlreadyCompleted,
    heart: isAlreadyCompleted,
    key: isAlreadyCompleted,
  });
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(isAlreadyCompleted);
  const [mikuSpeech, setMikuSpeech] = useState(
    isAlreadyCompleted
      ? "¡Felicidades, Camila! Has completado toda la aventura. Pero todavía queda una sorpresa..."
      : "¡Camila, has reunido los tres tesoros! Colócalos en los sellos del cofre mágico para abrir tu regalo 💜"
  );

  const allPlaced = placedItems.star && placedItems.heart && placedItems.key;

  const handlePlaceRelic = (type: 'star' | 'heart' | 'key') => {
    if (placedItems[type] || isOpened || isOpening) return;

    soundManager.playPlaceItem();
    const updated = { ...placedItems, [type]: true };
    setPlacedItems(updated);

    if (updated.star && updated.heart && updated.key) {
      setMikuSpeech("¡Los tres sellos mágicos están completos! Ahora gira la llave dorada para abrir el cofre ✨");
    } else {
      setMikuSpeech("¡Sello activado! Coloca los tesoros restantes en la cerradura.");
    }
  };

  const handleOpenChest = () => {
    if (!allPlaced || isOpening || isOpened) return;

    setIsOpening(true);
    setMikuSpeech("¡La llave dorada gira con suavidad! Una luz mágica y lavanda envuelve el cofre...");
    soundManager.playSuccess();

    setTimeout(() => {
      setIsOpening(false);
      setIsOpened(true);
      setMikuSpeech(
        "¡Felicidades, Camila!\nHas completado toda la aventura.\nPero todavía queda una sorpresa..."
      );
      onComplete();
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Title & tracker */}
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest text-purple-800 font-bold bg-purple-100 px-3 py-1 rounded-full">
          Juego 5 de 5 · El Gran Desbloqueo
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-purple-950 mt-2">
          El Regalo Final
        </h1>
        <p className="text-sm text-purple-800 font-medium max-w-md mx-auto mt-1">
          Reúne los tres objetos mágicos para abrir el cofre misterioso de cumpleaños.
        </p>
      </div>

      {/* Miku speech */}
      <div className="mb-8">
        <MikuAvatar
          expression={isOpened ? 'celebrating' : isOpening ? 'singing' : 'happy'}
          customSrc={isOpened ? '/images/miku/miku-holding-cake.png' : '/images/miku/miku-sweet.png'}
          bubbleMessage={mikuSpeech}
          bubbleBadge="Miku Guardiana"
          size="md"
        />
      </div>

      {/* Magical Chest Chamber */}
      <div className="bg-white/90 border-2 border-purple-200/90 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md text-center relative overflow-hidden">
        
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-radial from-purple-100/50 via-transparent to-transparent pointer-events-none" />

        {/* Chest illustration / Image */}
        <div className="relative max-w-xs mx-auto mb-8">
          <div className={`transition-all duration-700 ${isOpened ? 'scale-105' : ''}`}>
            <img
              src="/images/miku/miku_regalo.png"
              alt="Cofre de regalo mágico"
              className={`w-full h-auto drop-shadow-md mx-auto ${
                isOpening ? 'animate-pulse-glow' : 'animate-gentle-float'
              }`}
            />
          </div>

          {isOpened && (
            <div className="mt-4  mx-auto rounded-2xl overflow-hidden border-2 border-pink-400 shadow-md animate-fadeIn">
              <img
                src="/images/miku/miku-holding-cake.png"
                alt="Hatsune Miku festejando"
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>

        {/* The 3 Seal Slots */}
        {!isOpened ? (
          <div>
            <p className="text-xs uppercase tracking-wider text-purple-900 font-bold mb-4">
              Toca cada tesoro para colocarlo en su sello correspondiente:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
              {/* Star Slot */}
              <button
                onClick={() => handlePlaceRelic('star')}
                disabled={placedItems.star || !relics.star}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  placedItems.star
                    ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-xs'
                    : 'bg-purple-50/70 border-purple-200 hover:border-amber-400 hover:bg-amber-50/50 text-purple-950 cursor-pointer'
                }`}
              >
                <span className={`text-4xl ${placedItems.star ? 'scale-110' : ''}`}>⭐</span>
                <span className="text-xs font-bold">Estrella Musical</span>
                <span className="text-[11px] text-purple-700 font-semibold">
                  {placedItems.star ? '✓ Colocada' : 'Toca para insertar'}
                </span>
              </button>

              {/* Heart Slot */}
              <button
                onClick={() => handlePlaceRelic('heart')}
                disabled={placedItems.heart || !relics.heart}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                  placedItems.heart
                    ? 'bg-pink-50 border-pink-400 text-pink-900 shadow-xs'
                    : 'bg-purple-50/70 border-purple-200 hover:border-pink-400 hover:bg-pink-50/50 text-purple-950 cursor-pointer'
                }`}
              >
                <span className={`text-4xl ${placedItems.heart ? 'scale-110' : ''}`}>💖</span>
                <span className="text-xs font-bold">Corazón Mágico</span>
                <span className="text-[11px] text-purple-700 font-semibold">
                  {placedItems.heart ? '✓ Colocado' : 'Toca para insertar'}
                </span>
              </button>

              {/* Key Slot */}
              <button
                onClick={() => handlePlaceRelic('key')}
                disabled={placedItems.key || !relics.key}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                  placedItems.key
                    ? 'bg-yellow-50 border-yellow-400 text-yellow-900 shadow-xs'
                    : 'bg-purple-50/70 border-purple-200 hover:border-yellow-400 hover:bg-yellow-50/50 text-purple-950 cursor-pointer'
                }`}
              >
                <span className={`text-4xl ${placedItems.key ? 'scale-110' : ''}`}>🗝️</span>
                <span className="text-xs font-bold">Llave Dorada</span>
                <span className="text-[11px] text-purple-700 font-semibold">
                  {placedItems.key ? '✓ Colocada' : 'Toca para insertar'}
                </span>
              </button>
            </div>

            {/* Unlock Button */}
            {allPlaced && (
              <div className="animate-fadeIn">
                <button
                  onClick={handleOpenChest}
                  disabled={isOpening}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 text-white font-extrabold text-base shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all animate-pulse-glow"
                >
                  <Sparkles className="w-5 h-5 text-yellow-200" />
                  <span>{isOpening ? "Abriendo el cofre..." : "Girar la Llave Dorada"}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Chest is opened! Final transition call */
          <div className="py-4 animate-fadeIn">
            <div className="bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-6 max-w-md mx-auto mb-6">
              <span className="text-xs uppercase tracking-widest text-purple-800 font-extrabold block mb-1">
                ¡Misión Completada!
              </span>
              <p className="text-sm text-purple-950 leading-relaxed whitespace-pre-line mb-4 font-medium">
                Has superado los cinco juegos y reunido todos los tesoros de la aventura.
                {'\n'}Pero todavía queda una sorpresa muy especial esperando...
              </p>
              
              <button
                onClick={onOpenGrandFinale}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-[#2da89f] text-white font-extrabold text-base sm:text-lg shadow-xl shadow-purple-500/25 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-3 animate-pulse-glow"
              >
                <Gift className="w-6 h-6 text-yellow-200" />
                <span>Descubrir mi regalo</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
