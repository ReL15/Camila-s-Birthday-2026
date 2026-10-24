import React, { useState } from 'react';
import { MikuAvatar } from '../components/MikuAvatar';
import { soundManager } from '../utils/soundEffects';
import { questConfig } from '../config/questConfig';
import { ArrowRight, RotateCcw, Sparkles, Check } from 'lucide-react';

interface Game2KitchenProps {
  onComplete: () => void;
  onNextGame: () => void;
  isAlreadyCompleted: boolean;
}

export const Game2Kitchen: React.FC<Game2KitchenProps> = ({
  onComplete,
  onNextGame,
  isAlreadyCompleted,
}) => {
  const [selectedCorrect, setSelectedCorrect] = useState<string[]>(
    isAlreadyCompleted ? ['harina', 'huevos', 'azucar', 'fresas'] : []
  );
  const [isBaking, setIsBaking] = useState(false);
  const [isBaked, setIsBaked] = useState(isAlreadyCompleted);
  const [mikuSpeech, setMikuSpeech] = useState(
    isAlreadyCompleted
      ? "¡El pastel está listo! ¡Qué delicioso! Camila, eres una repostera mágica 🎂"
      : "¡Bienvenida a tu cocina, Camila! Vamos a preparar un pastel de cumpleaños esponjoso. Escoge los 4 ingredientes dulces necesarios 🍓"
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const { correct: correctItems, incorrect: incorrectItems } = questConfig.kitchenIngredients;
  const allIngredients = [...correctItems, ...incorrectItems].sort((a, b) => a.name.localeCompare(b.name));

  const handleIngredientClick = (id: string) => {
    if (isBaking || isBaked) return;

    // Check if it's correct
    const isCorrect = correctItems.some((item) => item.id === id);

    if (isCorrect) {
      if (selectedCorrect.includes(id)) {
        return;
      }
      soundManager.playPlaceItem();
      const updated = [...selectedCorrect, id];
      setSelectedCorrect(updated);
      setFeedback(null);

      if (updated.length === correctItems.length) {
        setMikuSpeech("¡Tenemos todos los ingredientes listos! Ahora pulsa 'Hornear pastel con magia' para que quede perfecto ✨");
      } else {
        const item = correctItems.find(i => i.id === id);
        setMikuSpeech(`¡Genial! Añadiste ${item?.name.toLowerCase()}. ¡Faltan ${correctItems.length - updated.length}!`);
      }
    } else {
      // Incorrect item
      const item = incorrectItems.find((i) => i.id === id);
      soundManager.playGentleHint();
      setFeedback(item?.hint || "¡Ese ingrediente no combina con un pastel dulce!");
      setMikuSpeech(item?.hint || "¡Ups! Recuerda que estamos horneando un pastel dulce para tu cumple 💜");
    }
  };

  const handleBakeCake = () => {
    if (selectedCorrect.length !== correctItems.length || isBaking) return;

    setIsBaking(true);
    setMikuSpeech("¡Miku y Camila mezclan la masa y encienden el horno mágico! Huele a vainilla y fresas...");
    soundManager.playPlaceItem();

    setTimeout(() => {
      soundManager.playSuccess();
      setIsBaking(false);
      setIsBaked(true);
      setMikuSpeech("¡El pastel está listo! ¡Qué delicioso! Camila, quedó hermoso y suave 🎂");
      onComplete();
    }, 2200);
  };

  const handleRestart = () => {
    setSelectedCorrect([]);
    setIsBaking(false);
    setIsBaked(false);
    setFeedback(null);
    setMikuSpeech("¡Vamos a hornear otro delicioso pastel! Selecciona los 4 ingredientes correctos.");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Title & tracker */}
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest text-pink-700 font-bold bg-pink-100 px-3 py-1 rounded-full">
          Juego 2 de 5 · Repostería & Dulzura
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-purple-950 mt-2">
          La Cocina de Camila
        </h1>
        <p className="text-sm text-purple-800 font-medium max-w-md mx-auto mt-1">
          Elige los ingredientes adecuados para hornear tu pastel de cumpleaños ideal.
        </p>
      </div>

      {/* Miku speech */}
      <div className="mb-8">
        <MikuAvatar
          expression={isBaked ? 'celebrating' : isBaking ? 'singing' : 'happy'}
          customSrc={isBaked ? '/images/miku/miku-holding-cake.png' : '/images/miku/miku-cooking.jpg'}
          bubbleMessage={mikuSpeech}
          bubbleBadge="Miku Chef Repostera"
          size="md"
        />
      </div>

      {/* Main Kitchen Board */}
      <div className="bg-white/90 border-2 border-purple-200/90 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
        
        {/* Ingredient selection or Baked result */}
        {!isBaked ? (
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-purple-100">
              <span className="text-xs sm:text-sm font-bold text-purple-950">
                Tazón de mezcla: {selectedCorrect.length} de {correctItems.length} ingredientes listos
              </span>
              <span className="text-xs text-pink-600 font-bold">
                {selectedCorrect.length === correctItems.length ? "¡Listo para hornear!" : "Selecciona ingredientes"}
              </span>
            </div>

            {/* Mixing Bowl preview */}
            <div className="bg-gradient-to-b from-purple-50/80 to-white border-2 border-purple-200 rounded-2xl p-6 mb-6 text-center relative overflow-hidden shadow-xs">
              <div className="text-5xl mb-2 animate-bounce select-none" style={{ animationDuration: '3s' }}>
                🥣
              </div>
              <p className="text-xs text-purple-800 font-bold mb-3">Ingredientes en el tazón mágico:</p>
              
              <div className="flex flex-wrap justify-center gap-2">
                {selectedCorrect.length === 0 ? (
                  <span className="text-xs italic text-purple-500 font-medium">El tazón está esperando tus ingredientes dulces...</span>
                ) : (
                  selectedCorrect.map((id) => {
                    const item = correctItems.find((i) => i.id === id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 border border-purple-300 text-xs font-bold text-purple-900 shadow-xs animate-fadeIn"
                      >
                        <span>{item?.icon}</span>
                        <span>{item?.name}</span>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                    );
                  })
                )}
              </div>

              {/* Bake action button */}
              {selectedCorrect.length === correctItems.length && (
                <div className="mt-5">
                  <button
                    onClick={handleBakeCake}
                    disabled={isBaking}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-[#2da89f] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all animate-pulse-glow"
                  >
                    <Sparkles className="w-5 h-5 text-amber-200" />
                    <span>{isBaking ? "Horneando con magia..." : "¡Hornear pastel con magia de Miku!"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Friendly hint banner if user clicked incorrect item */}
            {feedback && (
              <div className="mb-4 p-3 rounded-xl bg-pink-50 border border-pink-300 text-xs text-pink-900 font-medium flex items-center gap-2">
                <span className="text-base">💡</span>
                <span>{feedback}</span>
              </div>
            )}

            {/* Ingredients Pantry Grid */}
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-purple-900 mb-3">
              Alacena de Repostería (Haz clic para agregar):
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {allIngredients.map((item) => {
                const isSelected = selectedCorrect.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleIngredientClick(item.id)}
                    disabled={isSelected || isBaking}
                    className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 active:scale-95 ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-300 opacity-60 cursor-default"
                        : "bg-purple-50/70 hover:bg-white border-purple-200 hover:border-purple-300 cursor-pointer shadow-xs hover:shadow-sm"
                    }`}
                  >
                    <span className="text-3xl mb-1.5">{item.icon}</span>
                    <span className="text-xs font-bold text-purple-950">{item.name}</span>
                    {isSelected && (
                      <span className="mt-1 text-[10px] text-emerald-700 font-bold">✓ Añadido</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Finished Baked Cake Showcase */
          <div className="text-center py-4 animate-fadeIn">
            <div className="max-w-xs mx-auto mb-4 bg-purple-50 p-4 rounded-3xl border-2 border-purple-200 shadow-md">
              <img
                src="/images/miku/miku-holding-cake.png"
                alt="Hatsune Miku con el pastel de cumpleaños para Camila"
                className="w-full h-auto max-h-64 object-contain mx-auto rounded-2xl drop-shadow-md"
              />
            </div>

            <div className="inline-flex items-center gap-3 bg-pink-50 border-2 border-pink-200 rounded-2xl px-6 py-4 shadow-sm mb-6">
              <span className="text-4xl">📜</span>
              <div className="text-left">
                <span className="text-xs uppercase tracking-wider font-extrabold text-pink-700 block">
                  ¡Recompensa de repostería!
                </span>
                <h4 className="text-lg font-bold text-purple-950">Receta de Cumpleaños Virtual</h4>
                <p className="text-xs text-purple-800 font-medium">¡Tu pastel de cumple quedó listo, tierno y esponjoso!</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-sm font-bold border border-purple-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Hornear de nuevo
              </button>
              <button
                onClick={onNextGame}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-[#2da89f] text-white font-extrabold text-base shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-95 transition-all"
              >
                <span>Siguiente juego: El Rompecabezas de Miku</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
