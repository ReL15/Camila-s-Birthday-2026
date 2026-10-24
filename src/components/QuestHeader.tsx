import React, { useState } from 'react';
import { Volume2, VolumeX, Eye, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface QuestHeaderProps {
  relics: {
    star: boolean;
    heart: boolean;
    key: boolean;
  };
  currentScreen: string;
  isMuted: boolean;
  onToggleMute: () => void;
  reduceMotion: boolean;
  onToggleReduceMotion: () => void;
  onResetQuest: () => void;
  onHomeClick?: () => void;
}

export const QuestHeader: React.FC<QuestHeaderProps> = ({
  relics,
  isMuted,
  onToggleMute,
  reduceMotion,
  onToggleReduceMotion,
  onResetQuest,
  onHomeClick,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-purple-200/80 px-4 md:px-8 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <button
            onClick={onHomeClick}
            className="flex items-center gap-2 text-left group transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg p-1"
          >
            <span className="text-xl">💜</span>
            <div>
              <span className="font-extrabold text-base md:text-lg text-purple-950 group-hover:text-purple-700 transition-colors whitespace-nowrap">
                Feliz Cumpleaños Camila 2026 💜✨
              </span>
            </div>
          </button>

          {/* Relic Tracker HUD */}
          <div className="flex items-center gap-2 bg-purple-100/80 border border-purple-200/90 rounded-full px-3 py-1.5 shadow-xs">
            <span className="text-xs text-purple-800 font-semibold hidden sm:inline mr-1">Tesoros:</span>
            
            {/* Relic 1: Star */}
            <div
              title={relics.star ? "Estrella musical (Obtenida)" : "Estrella musical (Pendiente)"}
              className={`flex items-center justify-center w-7 h-7 rounded-full text-sm transition-all ${
                relics.star
                  ? "bg-amber-400/30 text-amber-600 ring-1 ring-amber-400/80 shadow-xs scale-105"
                  : "bg-purple-200/50 text-purple-400/50 opacity-50"
              }`}
            >
              ⭐
            </div>

            {/* Relic 2: Heart */}
            <div
              title={relics.heart ? "Corazón mágico (Obtenido)" : "Corazón mágico (Pendiente)"}
              className={`flex items-center justify-center w-7 h-7 rounded-full text-sm transition-all ${
                relics.heart
                  ? "bg-pink-500/20 text-pink-600 ring-1 ring-pink-400/80 shadow-xs scale-105"
                  : "bg-purple-200/50 text-purple-400/50 opacity-50"
              }`}
            >
              💖
            </div>

            {/* Relic 3: Key */}
            <div
              title={relics.key ? "Llave dorada (Obtenida)" : "Llave dorada (Pendiente)"}
              className={`flex items-center justify-center w-7 h-7 rounded-full text-sm transition-all ${
                relics.key
                  ? "bg-yellow-400/30 text-yellow-600 ring-1 ring-yellow-400/80 shadow-xs scale-105"
                  : "bg-purple-200/50 text-purple-400/50 opacity-50"
              }`}
            >
              🗝️
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                onToggleMute();
                soundManager.playClick();
              }}
              title={isMuted ? "Activar efectos de sonido" : "Silenciar efectos de sonido"}
              className="p-2 rounded-xl text-purple-700 hover:text-purple-950 hover:bg-purple-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-[#2da89f]" />}
            </button>

            {/* Reduced Motion Toggle */}
            <button
              onClick={() => {
                onToggleReduceMotion();
                soundManager.playClick();
              }}
              title={reduceMotion ? "Animaciones desactivadas" : "Reducir animaciones"}
              className={`p-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                reduceMotion ? "bg-purple-200 text-amber-700" : "text-purple-700 hover:text-purple-950 hover:bg-purple-100"
              }`}
              aria-label="Alternar reducción de movimiento"
            >
              <Eye className="w-5 h-5" />
            </button>

            {/* Reset Quest */}
            <button
              onClick={() => setShowConfirmReset(true)}
              title="Reiniciar aventura"
              className="p-2 rounded-xl text-purple-700 hover:text-red-500 hover:bg-purple-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              aria-label="Reiniciar aventura"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Modal de confirmación para reiniciar */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm">
          <div className="bg-white border-2 border-purple-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <span className="text-3xl mb-2 block">✨</span>
            <h3 className="text-lg font-bold text-purple-950 mb-2">¿Reiniciar la aventura?</h3>
            <p className="text-sm text-purple-800/80 mb-6 leading-relaxed">
              Volverás al comienzo y se reiniciará el progreso de los juegos. Podrás completarlos de nuevo cuando gustes.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  onResetQuest();
                }}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md hover:brightness-105 transition-all"
              >
                Sí, reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
