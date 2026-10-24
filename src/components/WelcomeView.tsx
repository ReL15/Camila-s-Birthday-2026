import React from 'react';
import { MikuAvatar } from './MikuAvatar';
import { soundManager } from '../utils/soundEffects';
import { ArrowRight, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface WelcomeViewProps {
  onStart: () => void;
  onOpenHowToPlay: () => void;
  completedGames: number[]; // e.g. [1, 2]
  onSelectGame: (gameNum: number) => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onStart,
  onOpenHowToPlay,
  completedGames,
  onSelectGame,
}) => {
  const hasProgress = completedGames.length > 0;

  const gameNames = [
    { num: 1, name: 'Ritmos con Miku', icon: '⭐', desc: 'Música y ritmo' },
    { num: 2, name: 'La Cocina de Camila', icon: '🍰', desc: 'Repostería dulce' },
    { num: 3, name: 'El Rompecabezas de Miku', icon: '🧩', desc: 'Armar ilustración' },
    { num: 4, name: 'El Tesoro Escondido', icon: '🗝️', desc: 'Búsqueda en la sala' },
    { num: 5, name: 'El Regalo Final', icon: '🎁', desc: 'El cofre encantado' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-16">
      {/* Hero Banner with Miku and Birthday Theme */}
      <div className="relative rounded-3xl overflow-hidden mb-8 border-2 border-purple-200/90 shadow-xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white">
        {/* Glow suave */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#39C5BB]/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 gap-6 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-1 drop-shadow-sm">
              Feliz cumpleaños Camila
            </h1>
            <p className="text-sm sm:text-base text-purple-100 font-medium mt-2 max-w-md">
              Un regalo hecho con amor y dedicación para ti ❤️
            </p>
          </div>

          <div className="w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-3xl overflow-hidden border-2 border-white/80 shadow-2xl bg-purple-900/40">
            <img
              src="/images/miku/miku-welcome.png"
              alt="Hatsune Miku sonriente saludando"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </div>

      {/* Miku Greeting Card */}
      <div className="bg-white/90 border-2 border-purple-200/90 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md mb-8">
        <MikuAvatar
          expression="cheering"
          customSrc="/images/miku/miku-welcome.png"
          size="lg"
          bubbleBadge="Hatsune Miku"
          bubbleMessage={
            "¡Hola, Camila! Soy Miku\n\n" +
            "Con Jorge hemos preparado una pequeña aventura de cumpleaños para ti. " +
            "Hay juegos, sorpresas y un regalo especial esperando al final.\n\n" +
            "¿Estás lista para comenzar?"
          }
        />

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-purple-100 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              soundManager.playClick();
              onStart();
            }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-[#2da89f] text-white font-extrabold text-base sm:text-lg shadow-xl shadow-purple-500/25 hover:brightness-105 active:scale-95 transition-all animate-pulse-glow"
          >
            <span>{hasProgress ? 'Continuar aventura' : 'Comenzar aventura'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenHowToPlay();
            }}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-purple-100/80 hover:bg-purple-200/90 border border-purple-300/80 text-purple-900 font-bold text-sm sm:text-base transition-colors shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-purple-700" />
            <span>Cómo jugar</span>
          </button>
        </div>
      </div>

      {/* Quest Journey Map (Stages) */}
      <div className="bg-white/85 border border-purple-200/90 rounded-3xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm sm:text-base font-extrabold text-purple-950">
              Mapa de la Misión ({completedGames.length} de 5 completados)
            </h2>
          </div>
          <span className="text-xs text-purple-700 font-semibold bg-purple-100 px-2.5 py-0.5 rounded-full">
            5 Desafíos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {gameNames.map((g) => {
            const isDone = completedGames.includes(g.num);
            return (
              <button
                key={g.num}
                onClick={() => {
                  soundManager.playClick();
                  onSelectGame(g.num);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 active:scale-95 shadow-xs ${
                  isDone
                    ? 'bg-emerald-50/90 border-emerald-300 hover:bg-emerald-100/90'
                    : 'bg-purple-50/70 border-purple-200 hover:border-purple-300 hover:bg-purple-100/70'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{g.icon}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="text-[10px] font-bold text-purple-600">Juego {g.num}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-purple-950 leading-tight">{g.name}</h3>
                  <p className="text-[10px] text-purple-700 font-medium">{g.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
