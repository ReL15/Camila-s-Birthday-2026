import React, { useState } from 'react';
import { MikuAvatar } from '../components/MikuAvatar';
import { soundManager } from '../utils/soundEffects';
import { questConfig } from '../config/questConfig';
import { ArrowRight, RotateCcw, Check, Sparkles, HelpCircle } from 'lucide-react';

interface Game4HiddenObjectsProps {
  onComplete: () => void;
  onNextGame: () => void;
  isAlreadyCompleted: boolean;
}

export const Game4HiddenObjects: React.FC<Game4HiddenObjectsProps> = ({
  onComplete,
  onNextGame,
  isAlreadyCompleted,
}) => {
  const [foundIds, setFoundIds] = useState<string[]>(
    isAlreadyCompleted ? ['estrella', 'pastel', 'guitarra', 'regalo'] : []
  );
  const [showHint, setShowHint] = useState<string | null>(null);
  const [lastFound, setLastFound] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(isAlreadyCompleted);
  const [mikuSpeech, setMikuSpeech] = useState(
    isAlreadyCompleted
      ? "¡Has encontrado todos los objetos! El regalo está cada vez más cerca 🗝️"
      : "¡Camila, explora la habitación de música y repostería! Encuentra la estrella, el pastelito, la guitarra y la cajita de regalo ✨"
  );

  const targets = questConfig.hiddenObjects;

  const handleObjectClick = (id: string, name: string) => {
    if (foundIds.includes(id)) return;

    soundManager.playSuccess();
    const nextFound = [...foundIds, id];
    setFoundIds(nextFound);
    setLastFound(id);
    setShowHint(null);

    if (nextFound.length === targets.length) {
      setIsCompleted(true);
      setMikuSpeech("¡Has encontrado todos los objetos! El regalo está cada vez más cerca. ¡Obtuviste la Llave Dorada! 🗝️");
      onComplete();
    } else {
      setMikuSpeech(`¡Genial, encontraste: ${name}! Faltan ${targets.length - nextFound.length} objetos por descubrir.`);
    }
  };

  const handleRequestHint = () => {
    soundManager.playGentleHint();
    const remaining = targets.find((t) => !foundIds.includes(t.id));
    if (remaining) {
      setShowHint(remaining.hint);
      setMikuSpeech(`Pista para ${remaining.name}: "${remaining.hint}"`);
    }
  };

  const handleRestart = () => {
    setFoundIds([]);
    setShowHint(null);
    setLastFound(null);
    setIsCompleted(false);
    setMikuSpeech("¡A buscar de nuevo! Observa con atención cada rincón de la habitación.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title & tracker */}
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-bold bg-amber-100 px-3 py-1 rounded-full">
          Juego 4 de 5 · Búsqueda & Observación
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-purple-950 mt-2">
          El Tesoro Escondido
        </h1>
        <p className="text-sm text-purple-800 font-medium max-w-md mx-auto mt-1">
          Encuentra los cuatro objetos especiales escondidos en esta mágica habitación.
        </p>
      </div>

      {/* Miku speech */}
      <div className="mb-6">
        <MikuAvatar
          expression={isCompleted ? 'celebrating' : lastFound ? 'happy' : 'thinking'}
          customSrc={isCompleted ? '/images/miku/miku-happy.png' : '/images/miku/miku-chibi.png'}
          bubbleMessage={mikuSpeech}
          bubbleBadge="Miku Exploradora"
          size="md"
        />
      </div>

      {/* Room Canvas Container */}
      <div className="bg-white/90 border-2 border-purple-200/90 rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-md mb-6">
        {/* Top HUD with Checklist */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-950">Objetos a encontrar:</span>
            <div className="flex flex-wrap gap-2">
              {targets.map((t) => {
                const found = foundIds.includes(t.id);
                return (
                  <span
                    key={t.id}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all ${
                      found
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 line-through opacity-80'
                        : 'bg-purple-100 text-purple-900 border border-purple-300 font-bold'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                    {found && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </span>
                );
              })}
            </div>
          </div>

          {!isCompleted && (
            <button
              onClick={handleRequestHint}
              className="inline-flex items-center gap-1 text-xs text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 font-bold transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Pedir pista</span>
            </button>
          )}
        </div>

        {/* Interactive Illustrated Room SVG */}
        <div className="relative w-full aspect-[16/9] max-h-[480px] bg-gradient-to-b from-[#180a2b] via-[#26133d] to-[#160b26] rounded-2xl border border-purple-500/30 overflow-hidden shadow-inner select-none">
          
          {/* Room Background vector scene */}
          <svg
            viewBox="0 0 800 450"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Wall base & Floor */}
            <rect x="0" y="0" width="800" height="340" fill="#201138" />
            <polygon points="0,340 800,340 800,450 0,450" fill="#170c28" />
            <line x1="0" y1="340" x2="800" y2="340" stroke="#3d2166" strokeWidth="3" />

            {/* Cozy Lavender Rug */}
            <ellipse cx="400" cy="400" rx="220" ry="42" fill="#3b1f5e" stroke="#5b3294" strokeWidth="3" />
            <ellipse cx="400" cy="400" rx="190" ry="34" fill="#4c297a" />

            {/* Arched Window with Stars */}
            <path d="M 540 180 L 540 80 C 540 30, 660 30, 660 80 L 660 180 Z" fill="#0d061c" stroke="#58318e" strokeWidth="4" />
            {/* Window Pane Lines */}
            <line x1="600" y1="40" x2="600" y2="180" stroke="#412469" strokeWidth="2" />
            <line x1="540" y1="110" x2="660" y2="110" stroke="#412469" strokeWidth="2" />
            {/* Distant stars through window */}
            <circle cx="570" cy="70" r="1.5" fill="#fbcfe8" />
            <circle cx="630" cy="85" r="2" fill="#c4b5fd" />
            <circle cx="585" cy="130" r="1.5" fill="#ffffff" />
            <circle cx="620" cy="140" r="1.5" fill="#39c5bb" />

            {/* Bookshelf on the left */}
            <rect x="50" y="100" width="130" height="235" rx="6" fill="#2d174d" stroke="#502a87" strokeWidth="3" />
            <line x1="50" y1="160" x2="180" y2="160" stroke="#502a87" strokeWidth="3" />
            <line x1="50" y1="220" x2="180" y2="220" stroke="#502a87" strokeWidth="3" />
            <line x1="50" y1="280" x2="180" y2="280" stroke="#502a87" strokeWidth="3" />

            {/* Decorative books */}
            <rect x="65" y="115" width="16" height="42" fill="#8b5cf6" rx="2" />
            <rect x="85" y="122" width="14" height="35" fill="#39c5bb" rx="2" />
            <rect x="103" y="112" width="18" height="45" fill="#f472b6" rx="2" />
            <rect x="125" y="126" width="15" height="31" fill="#c084fc" rx="2" />
            <rect x="144" y="118" width="16" height="39" fill="#a78bfa" rx="2" />

            {/* Potted plant on bookshelf top */}
            <path d="M 100 98 L 120 98 L 116 80 L 104 80 Z" fill="#58318e" />
            <ellipse cx="110" cy="72" rx="12" ry="10" fill="#2dd4bf" />
            <ellipse cx="102" cy="66" rx="9" ry="8" fill="#14b8a6" />
            <ellipse cx="118" cy="66" rx="9" ry="8" fill="#14b8a6" />

            {/* Cozy Sofa / Chair in the center-left */}
            <rect x="230" y="240" width="160" height="70" rx="14" fill="#3a1c61" stroke="#552c8c" strokeWidth="3" />
            <rect x="215" y="260" width="25" height="45" rx="10" fill="#462275" />
            <rect x="380" y="260" width="25" height="45" rx="10" fill="#462275" />
            {/* Cushion */}
            <ellipse cx="310" cy="265" rx="26" ry="18" fill="#c4b5fd" opacity="0.8" />

            {/* Side Tea Table */}
            <ellipse cx="490" cy="315" rx="55" ry="20" fill="#341857" stroke="#4f2782" strokeWidth="2.5" />
            <path d="M 485 325 L 485 365" stroke="#4f2782" strokeWidth="4" />
            <path d="M 470 365 L 510 365" stroke="#4f2782" strokeWidth="4" strokeLinecap="round" />
            {/* Teacup on table */}
            <ellipse cx="465" cy="308" rx="7" ry="4" fill="#ffffff" />
            <rect x="460" y="303" width="10" height="7" fill="#ffffff" rx="2" />
            <path d="M 465 298 Q 463 293 466 288" stroke="#fbcfe8" strokeWidth="1.5" fill="none" opacity="0.6" />

            {/* Hanging String Lights */}
            <path d="M 0 35 Q 200 70 400 45 Q 600 65 800 35" fill="none" stroke="#6b21a8" strokeWidth="2" />
            <circle cx="100" cy="48" r="4" fill="#fde047" />
            <circle cx="200" cy="62" r="4" fill="#39c5bb" />
            <circle cx="300" cy="54" r="4" fill="#f472b6" />
            <circle cx="500" cy="58" r="4" fill="#c084fc" />
            <circle cx="700" cy="46" r="4" fill="#fde047" />
          </svg>

          {/* ========================================================
              TARGET 1: ESTRELLA MÁGICA
              Placed near top wall shelf / string light
          ======================================================== */}
          <button
            onClick={() => handleObjectClick('estrella', 'Estrella mágica')}
            aria-label="Estrella mágica"
            className={`absolute top-[18%] left-[42%] p-1 bg-transparent border-none rounded-full transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
              foundIds.includes('estrella')
                ? 'opacity-25 pointer-events-none scale-75'
                : 'hover:scale-125 cursor-pointer animate-gentle-float'
            }`}
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-transparent">
              <img
                src="/images/decorations/star-yellow.png"
                alt="Estrella mágica"
                className="w-full h-full object-contain bg-transparent filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]"
              />
              {!foundIds.includes('estrella') && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
            </div>
          </button>

          {/* ========================================================
              TARGET 2: PASTELITO
              Placed on the side tea table
          ======================================================== */}
          <button
            onClick={() => handleObjectClick('pastel', 'Mini pastelito')}
            aria-label="Mini pastelito"
            className={`absolute top-[58%] left-[62%] p-1 bg-transparent border-none rounded-full transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 ${
              foundIds.includes('pastel')
                ? 'opacity-25 pointer-events-none scale-75'
                : 'hover:scale-125 cursor-pointer'
            }`}
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-transparent">
              <img
                src="/images/decorations/cupcake.png"
                alt="Mini pastelito"
                className="w-full h-full object-contain bg-transparent filter drop-shadow-[0_0_12px_rgba(244,114,182,0.9)]"
              />
              {!foundIds.includes('pastel') && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
              )}
            </div>
          </button>

          {/* ========================================================
              TARGET 3: NOTA MUSICAL
              Leaning by the sofa / rug
          ======================================================== */}
          <button
            onClick={() => handleObjectClick('guitarra', 'Nota musical')}
            aria-label="Nota musical"
            className={`absolute top-[52%] left-[25%] p-1 bg-transparent border-none rounded-full transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-[#39C5BB] ${
              foundIds.includes('guitarra')
                ? 'opacity-25 pointer-events-none scale-75'
                : 'hover:scale-125 cursor-pointer rotate-12'
            }`}
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-transparent">
              <img
                src="/images/decorations/note-purple.png"
                alt="Nota musical"
                className="w-full h-full object-contain bg-transparent filter drop-shadow-[0_0_14px_rgba(57,197,187,0.9)]"
              />
              {!foundIds.includes('guitarra') && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39C5BB] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
                </span>
              )}
            </div>
          </button>

          {/* ========================================================
              TARGET 4: LAZO / REGALITO
              Beside the bookshelf on the lower left
          ======================================================== */}
          <button
            onClick={() => handleObjectClick('regalo', 'Caja de regalo')}
            aria-label="Caja de regalo"
            className={`absolute top-[68%] left-[9%] p-1 bg-transparent border-none rounded-full transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 ${
              foundIds.includes('regalo')
                ? 'opacity-25 pointer-events-none scale-75'
                : 'hover:scale-125 cursor-pointer animate-gentle-float'
            }`}
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-transparent">
              <img
                src="/images/decorations/ribbon-bow.png"
                alt="Caja de regalo"
                className="w-full h-full object-contain bg-transparent filter drop-shadow-[0_0_12px_rgba(192,132,252,0.9)]"
              />
              {!foundIds.includes('regalo') && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
              )}
            </div>
          </button>

        </div>

        {/* Hint banner if requested */}
        {showHint && !isCompleted && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 font-medium flex items-center gap-2">
            <span className="font-bold">💡 Pista:</span>
            <span>{showHint}</span>
          </div>
        )}

        {/* Completion Banner */}
        {isCompleted && (
          <div className="mt-6 pt-6 border-t border-purple-100 text-center animate-fadeIn">
            <div className="inline-flex items-center gap-3 bg-yellow-50 border-2 border-yellow-300 rounded-2xl px-6 py-4 shadow-sm mb-6">
              <span className="text-4xl animate-bounce">🗝️</span>
              <div className="text-left">
                <span className="text-xs uppercase tracking-wider font-extrabold text-yellow-700 block">
                  ¡Tercer tesoro obtenido!
                </span>
                <h4 className="text-lg font-bold text-purple-950">La Llave Dorada de Miku</h4>
                <p className="text-xs text-purple-800 font-medium">¡Ya tienes los 3 objetos para desbloquear tu regalo final!</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-sm font-bold border border-purple-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Buscar de nuevo
              </button>
              <button
                onClick={onNextGame}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-[#2da89f] text-white font-extrabold text-base shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-95 transition-all"
              >
                <span>Siguiente juego: El Regalo Final</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
