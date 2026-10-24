import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MikuAvatar } from '../components/MikuAvatar';
import { soundManager } from '../utils/soundEffects';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface Game1ConcertProps {
  onComplete: () => void;
  onNextGame: () => void;
  isAlreadyCompleted: boolean;
}

const PADS = [
  { id: 0, name: 'Aqua Do', icon: '🎵', freq: 523.25, baseColor: 'bg-teal-50/90 border-teal-300 text-teal-900 shadow-xs', activeColor: 'bg-[#39C5BB] text-purple-950 shadow-md scale-95 border-teal-400' },
  { id: 1, name: 'Lavanda Mi', icon: '⭐', freq: 659.25, baseColor: 'bg-indigo-50/90 border-indigo-200 text-indigo-900 shadow-xs', activeColor: 'bg-indigo-400 text-white shadow-md scale-95 border-indigo-400' },
  { id: 2, name: 'Rosa Sol', icon: '💖', freq: 783.99, baseColor: 'bg-pink-50/90 border-pink-200 text-pink-900 shadow-xs', activeColor: 'bg-pink-400 text-white shadow-md scale-95 border-pink-400' },
  { id: 3, name: 'Morado Si', icon: '✨', freq: 987.77, baseColor: 'bg-purple-50/90 border-purple-200 text-purple-900 shadow-xs', activeColor: 'bg-purple-500 text-white shadow-md scale-95 border-purple-500' },
];

export const Game1Concert: React.FC<Game1ConcertProps> = ({
  onComplete,
  onNextGame,
  isAlreadyCompleted,
}) => {
  const [round, setRound] = useState(1); // 1 to 3
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [mikuSpeech, setMikuSpeech] = useState(
    "¡Hola Camila! Escucha con atención la melodía que toco y repite las notas en el mismo orden 🎶"
  );
  const [gameWon, setGameWon] = useState(isAlreadyCompleted);
  const isPlayingRef = useRef(false);

  // Generate sequence for current round
  const startRound = useCallback((roundNum: number) => {
    setUserStep(0);
    setIsPlayingSeq(true);
    isPlayingRef.current = true;
    setMikuSpeech(`Ronda ${roundNum} de 3: ¡Miku está tocando la melodía! Escucha con atención...`);

    const seqLength = roundNum + 2; // Round 1: 3 notes, Round 2: 4 notes, Round 3: 5 notes
    const newSeq: number[] = [];
    for (let i = 0; i < seqLength; i++) {
      newSeq.push(Math.floor(Math.random() * 4));
    }
    setSequence(newSeq);

    // Play back sequence
    let delay = 600;
    newSeq.forEach((padId, index) => {
      setTimeout(() => {
        setActivePad(padId);
        soundManager.playNote(PADS[padId].freq, 0.45);
        setTimeout(() => {
          setActivePad(null);
        }, 320);

        if (index === newSeq.length - 1) {
          setTimeout(() => {
            setIsPlayingSeq(false);
            isPlayingRef.current = false;
            setMikuSpeech(`¡Tu turno, Camila! Toca las ${seqLength} notas en orden.`);
          }, 450);
        }
      }, delay);
      delay += 550;
    });
  }, []);

  useEffect(() => {
    if (!gameWon) {
      startRound(1);
    }
  }, [gameWon, startRound]);

  // Handle pad click by user
  const handlePadClick = (padId: number) => {
    if (isPlayingSeq || gameWon) return;

    // Play sound and light up
    setActivePad(padId);
    soundManager.playNote(PADS[padId].freq, 0.35);
    setTimeout(() => setActivePad(null), 250);

    // Check if match
    if (sequence[userStep] === padId) {
      const nextStep = userStep + 1;
      setUserStep(nextStep);

      // Completed sequence for this round?
      if (nextStep === sequence.length) {
        if (round < 3) {
          soundManager.playSuccess();
          setMikuSpeech(`¡Excelente ritmo, Camila! Superaste la ronda ${round}. ¡Vamos a la siguiente!`);
          setIsPlayingSeq(true);
          setTimeout(() => {
            setRound(r => r + 1);
            startRound(round + 1);
          }, 1200);
        } else {
          // WON ENTIRE GAME!
          soundManager.playSuccess();
          setGameWon(true);
          setMikuSpeech("¡Lo lograste! Miku está muy orgullosa de ti. ¡Has obtenido la Estrella Musical! ⭐");
          onComplete();
        }
      }
    } else {
      // Mistake: gentle retry
      soundManager.playGentleHint();
      setMikuSpeech("¡Casi, Camila! No te preocupes, escuchemos la secuencia una vez más 🎶");
      setIsPlayingSeq(true);
      setUserStep(0);
      setTimeout(() => {
        // Re-play current sequence
        let delay = 600;
        sequence.forEach((pId, idx) => {
          setTimeout(() => {
            setActivePad(pId);
            soundManager.playNote(PADS[pId].freq, 0.4);
            setTimeout(() => setActivePad(null), 280);

            if (idx === sequence.length - 1) {
              setTimeout(() => {
                setIsPlayingSeq(false);
                setMikuSpeech(`¡Ahora inténtalo tú de nuevo! Tú puedes 💜`);
              }, 400);
            }
          }, delay);
          delay += 520;
        });
      }, 900);
    }
  };

  const handleRestart = () => {
    setGameWon(false);
    setRound(1);
    startRound(1);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Title & Stage tracker */}
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest text-purple-700 font-bold bg-purple-100 px-3 py-1 rounded-full">
          Juego 1 de 5 · Música y Ritmo
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-purple-950 mt-2">
          El Concierto de Miku
        </h1>
        <p className="text-sm text-purple-800 font-medium max-w-md mx-auto mt-1">
          Sigue las notas musicales de Miku para afinar el concierto de tu cumpleaños.
        </p>
      </div>

      {/* Miku speech */}
      <div className="mb-8">
        <MikuAvatar
          expression={gameWon ? 'celebrating' : isPlayingSeq ? 'singing' : 'happy'}
          customSrc={isPlayingSeq ? '/images/miku/miku-singing.png' : gameWon ? '/images/miku/miku-music.jpg' : '/images/miku/miku-singing.png'}
          bubbleMessage={mikuSpeech}
          bubbleBadge="Miku Vocalista"
          size="md"
        />
      </div>

      {/* Game board */}
      <div className="bg-white/90 border-2 border-purple-200/90 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
        {/* Subtle background decoration */}
        <div className="absolute top-2 right-4 text-6xl text-purple-200/40 select-none pointer-events-none">
          🎵
        </div>

        {/* Round indicators */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-800 font-bold">Progreso del concierto:</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((r) => (
                <div
                  key={r}
                  className={`w-7 h-2 rounded-full transition-all ${
                    round > r || gameWon
                      ? 'bg-[#2da89f]'
                      : round === r
                      ? 'bg-purple-600 animate-pulse'
                      : 'bg-purple-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
            Ronda {round}/3
          </span>
        </div>

        {/* 4 Interactive Musical Pads */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto mb-6">
          {PADS.map((pad) => {
            const isActive = activePad === pad.id;
            return (
              <button
                key={pad.id}
                onClick={() => handlePadClick(pad.id)}
                disabled={isPlayingSeq || gameWon}
                aria-label={`Nota ${pad.name}`}
                className={`relative flex flex-col items-center justify-center h-28 sm:h-36 rounded-2xl border-2 transition-all duration-150 transform select-none cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-400 active:scale-95 disabled:cursor-default ${
                  isActive ? pad.activeColor : pad.baseColor
                } hover:brightness-105`}
              >
                <span className="text-3xl sm:text-4xl mb-1">{pad.icon}</span>
                <span className="text-xs sm:text-sm font-bold tracking-wide">{pad.name}</span>
                {isActive && (
                  <span className="absolute inset-0 rounded-2xl ring-4 ring-purple-400/50 animate-ping opacity-60" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback / Instructions */}
        <div className="text-center text-xs text-purple-800 font-semibold">
          {isPlayingSeq
            ? "🎶 Escucha con atención la melodía..."
            : gameWon
            ? "✨ ¡Concierto completado con éxito!"
            : `Toca las notas en el orden correcto (${userStep}/${sequence.length})`}
        </div>

        {/* Reward celebration banner if won */}
        {gameWon && (
          <div className="mt-6 pt-6 border-t border-purple-100 text-center animate-fadeIn">
            <div className="inline-flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-2xl px-6 py-4 shadow-sm mb-6">
              <span className="text-4xl animate-bounce">⭐</span>
              <div className="text-left">
                <span className="text-xs uppercase tracking-wider font-extrabold text-amber-700 block">
                  ¡Recompensa desbloqueada!
                </span>
                <h4 className="text-lg font-bold text-purple-950">Estrella Musical de Miku</h4>
                <p className="text-xs text-purple-800 font-medium">La primera llave para abrir el cofre.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-sm font-bold border border-purple-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Repetir juego
              </button>
              <button
                onClick={onNextGame}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-[#2da89f] text-white font-extrabold text-base shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-95 transition-all"
              >
                <span>Siguiente juego: La Cocina de Camila</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
