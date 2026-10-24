import { useState, useEffect } from 'react';
import { QuestHeader } from './components/QuestHeader';
import { WelcomeView } from './components/WelcomeView';
import { HowToPlayModal } from './components/HowToPlayModal';
import { ConfettiEffect } from './components/ConfettiEffect';
import { Game1Concert } from './games/Game1Concert';
import { Game2Kitchen } from './games/Game2Kitchen';
import { Game3Puzzle } from './games/Game3Puzzle';
import { Game4HiddenObjects } from './games/Game4HiddenObjects';
import { Game5FinalGift } from './games/Game5FinalGift';
import { CelebrationView } from './components/CelebrationView';
import { soundManager } from './utils/soundEffects';

type Screen = 'welcome' | 'game1' | 'game2' | 'game3' | 'game4' | 'game5' | 'celebration';

const STORAGE_KEY_PROGRESS = 'camila_birthday_quest_completed';
const STORAGE_KEY_MUTED = 'camila_birthday_quest_muted';
const STORAGE_KEY_MOTION = 'camila_birthday_quest_reduce_motion';

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [completedGames, setCompletedGames] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_MUTED) === 'true';
    } catch {
      return false;
    }
  });

  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_MOTION) === 'true';
    } catch {
      return false;
    }
  });

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Sync mute state with soundManager
  useEffect(() => {
    soundManager.setMuted(isMuted);
    try {
      localStorage.setItem(STORAGE_KEY_MUTED, String(isMuted));
    } catch {
      // storage safety
    }
  }, [isMuted]);

  // Sync reduce motion with document/storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MOTION, String(reduceMotion));
    } catch {
      // storage safety
    }
  }, [reduceMotion]);

  // Persist completed games
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(completedGames));
    } catch {
      // storage safety
    }
  }, [completedGames]);

  const relics = {
    star: completedGames.includes(1),
    heart: completedGames.includes(3),
    key: completedGames.includes(4),
  };

  const triggerConfetti = (duration = 3500) => {
    if (reduceMotion) return;
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), duration);
  };

  const markGameComplete = (gameNum: number) => {
    setCompletedGames((prev) => {
      if (!prev.includes(gameNum)) {
        return [...prev, gameNum];
      }
      return prev;
    });
    triggerConfetti(3500);
  };

  const handleStartAdventure = () => {
    // Navigate to next unfinished game or game 1
    for (let i = 1; i <= 5; i++) {
      if (!completedGames.includes(i)) {
        setScreen(`game${i}` as Screen);
        return;
      }
    }
    // If all completed, open celebration
    setScreen('celebration');
    triggerConfetti(5000);
  };

  const handleSelectGame = (gameNum: number) => {
    // If selecting game 5, ensure previous games or allow viewing
    setScreen(`game${gameNum}` as Screen);
  };

  const handleResetQuest = () => {
    soundManager.playClick();
    setCompletedGames([]);
    try {
      localStorage.removeItem(STORAGE_KEY_PROGRESS);
    } catch {
      // storage safety
    }
    setScreen('welcome');
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-[#FAF5FF] via-[#F5EDFF] to-[#EDE5FC] text-purple-950 flex flex-col font-sans relative selection:bg-purple-300 selection:text-purple-950 ${
        reduceMotion ? 'reduce-motion' : ''
      }`}
    >
      {/* Ambient background decoration with gentle purple and white glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-pink-100/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-[#39C5BB]/15 rounded-full blur-3xl" />
      </div>

      {/* Celebratory Confetti Layer */}
      <ConfettiEffect active={showConfetti} duration={3500} />

      {/* Persistent Quest Header & Relics Tracker */}
      <QuestHeader
        relics={relics}
        currentScreen={screen}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        reduceMotion={reduceMotion}
        onToggleReduceMotion={() => setReduceMotion((prev) => !prev)}
        onResetQuest={handleResetQuest}
        onHomeClick={() => setScreen('welcome')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10">
        {screen === 'welcome' && (
          <WelcomeView
            onStart={handleStartAdventure}
            onOpenHowToPlay={() => setShowHowToPlay(true)}
            completedGames={completedGames}
            onSelectGame={handleSelectGame}
          />
        )}

        {screen === 'game1' && (
          <Game1Concert
            onComplete={() => markGameComplete(1)}
            onNextGame={() => setScreen('game2')}
            isAlreadyCompleted={completedGames.includes(1)}
          />
        )}

        {screen === 'game2' && (
          <Game2Kitchen
            onComplete={() => markGameComplete(2)}
            onNextGame={() => setScreen('game3')}
            isAlreadyCompleted={completedGames.includes(2)}
          />
        )}

        {screen === 'game3' && (
          <Game3Puzzle
            onComplete={() => markGameComplete(3)}
            onNextGame={() => setScreen('game4')}
            isAlreadyCompleted={completedGames.includes(3)}
          />
        )}

        {screen === 'game4' && (
          <Game4HiddenObjects
            onComplete={() => markGameComplete(4)}
            onNextGame={() => setScreen('game5')}
            isAlreadyCompleted={completedGames.includes(4)}
          />
        )}

        {screen === 'game5' && (
          <Game5FinalGift
            relics={relics}
            onComplete={() => markGameComplete(5)}
            onOpenGrandFinale={() => {
              setScreen('celebration');
              triggerConfetti(6000);
            }}
            isAlreadyCompleted={completedGames.includes(5)}
          />
        )}

        {screen === 'celebration' && (
          <CelebrationView
            onReplayAdventure={() => {
              soundManager.playClick();
              setScreen('welcome');
            }}
          />
        )}
      </main>

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />

      {/* Quiet, elegant footer in purple & white theme */}
      <footer className="py-6 px-4 border-t border-purple-200/80 text-center text-xs text-purple-700/80 bg-white/70 backdrop-blur-sm relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Feliz cumpleaños, Camila 💜 Hecho con amor y cuidado para ti por Jorge 💜</span>
          <div className="flex items-center gap-3 font-semibold">
            <button
              onClick={() => setShowHowToPlay(true)}
              className="hover:text-purple-950 transition-colors"
            >
              Instrucciones
            </button>
            <span>·</span>
            <button
              onClick={() => setScreen('welcome')}
              className="hover:text-purple-950 transition-colors"
            >
              Inicio
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
