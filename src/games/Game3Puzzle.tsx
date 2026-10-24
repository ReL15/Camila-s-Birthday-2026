import React, { useState } from 'react';
import { MikuAvatar } from '../components/MikuAvatar';
import { soundManager } from '../utils/soundEffects';
import { questConfig } from '../config/questConfig';
import { ArrowRight, RotateCcw, Eye, Check } from 'lucide-react';

interface Game3PuzzleProps {
  onComplete: () => void;
  onNextGame: () => void;
  isAlreadyCompleted: boolean;
}

// Rompecabezas 3x3 = 9 piezas
const TOTAL_PIECES = 9;
const GRID_SIZE = 3;
const PUZZLE_IMAGE_URL = '/images/miku/miku-puzzle.jpg';

/**
 * Componente que recorta mediante CSS cada pieza del rompecabezas
 * a partir de la imagen base completa proporcionada en el paquete.
 */
const PuzzlePiece: React.FC<{
  pieceId: number;
  className?: string;
}> = ({ pieceId, className = '' }) => {
  const row = Math.floor(pieceId / GRID_SIZE);
  const col = pieceId % GRID_SIZE;
  const posX = (col / (GRID_SIZE - 1)) * 100;
  const posY = (row / (GRID_SIZE - 1)) * 100;

  return (
    <div
      className={`w-full h-full bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url('${PUZZLE_IMAGE_URL}')`,
        backgroundSize: '300% 300%',
        backgroundPosition: `${posX}% ${posY}%`,
      }}
    />
  );
};

export const Game3Puzzle: React.FC<Game3PuzzleProps> = ({
  onComplete,
  onNextGame,
  isAlreadyCompleted,
}) => {
  // Estado de las posiciones actuales (0 a 8)
  const [board, setBoard] = useState<number[]>(() => {
    if (isAlreadyCompleted) {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8];
    }
    // Desorden inicial moderado y amigable
    return [4, 0, 2, 7, 1, 5, 3, 8, 6];
  });

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [draggedSlot, setDraggedSlot] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(isAlreadyCompleted);
  const [showPreview, setShowPreview] = useState(false);
  const [mikuSpeech, setMikuSpeech] = useState(
    isAlreadyCompleted
      ? questConfig.puzzleConfig.completionMessage
      : "¡Hola Camila! He preparado un rompecabezas con una ilustración especial para ti. Toca o arrastra las piezas para ordenarlas con calma 🧩"
  );

  // Verificar si todas las piezas están en su casilla correspondiente
  const checkSolved = (currentBoard: number[]) => {
    return currentBoard.every((pieceId, index) => pieceId === index);
  };

  const handleSwapSlots = (fromSlot: number, toSlot: number) => {
    if (fromSlot === toSlot || isSolved) return;

    const newBoard = [...board];
    const temp = newBoard[fromSlot];
    newBoard[fromSlot] = newBoard[toSlot];
    newBoard[toSlot] = temp;

    setBoard(newBoard);
    setSelectedSlot(null);

    // Sonido y feedback amigable si encajó correctamente
    if (newBoard[toSlot] === toSlot || newBoard[fromSlot] === fromSlot) {
      soundManager.playPlaceItem();
      setMikuSpeech("¡Bien hecho! Esa pieza encajó en su lugar exacto ✨");
    } else {
      soundManager.playClick();
    }

    if (checkSolved(newBoard)) {
      soundManager.playSuccess();
      setIsSolved(true);
      setMikuSpeech(questConfig.puzzleConfig.completionMessage);
      onComplete();
    }
  };

  // Manejo de clic para móviles y pantallas táctiles
  const handleSlotClick = (slotIndex: number) => {
    if (isSolved) return;

    if (selectedSlot === null) {
      setSelectedSlot(slotIndex);
      soundManager.playClick();
    } else if (selectedSlot === slotIndex) {
      setSelectedSlot(null);
    } else {
      handleSwapSlots(selectedSlot, slotIndex);
    }
  };

  // Drag and drop estándar
  const handleDragStart = (e: React.DragEvent, slotIndex: number) => {
    if (isSolved) return;
    setDraggedSlot(slotIndex);
    e.dataTransfer.setData('text/plain', slotIndex.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetSlot: number) => {
    e.preventDefault();
    if (draggedSlot !== null) {
      handleSwapSlots(draggedSlot, targetSlot);
      setDraggedSlot(null);
    }
  };

  const handleRestart = () => {
    setBoard([4, 0, 2, 7, 1, 5, 3, 8, 6]);
    setSelectedSlot(null);
    setIsSolved(false);
    setMikuSpeech("¡Vamos de nuevo! Tómate tu tiempo y disfruta armando la imagen 💜");
  };

  const correctlyPlacedCount = board.filter((pieceId, index) => pieceId === index).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Título de la etapa */}
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest text-indigo-700 font-bold bg-indigo-100 px-3 py-1 rounded-full">
          Juego 3 de 5 · Calma & Arte
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-purple-950 mt-2">
          {questConfig.puzzleConfig.title}
        </h1>
        <p className="text-sm text-purple-800 font-medium max-w-md mx-auto mt-1">
          {questConfig.puzzleConfig.subtitle}
        </p>
      </div>

      {/* Mascota Miku con globo de diálogo */}
      <div className="mb-8">
        <MikuAvatar
          expression={isSolved ? 'celebrating' : selectedSlot !== null ? 'thinking' : 'happy'}
          customSrc={isSolved ? '/images/miku/miku-happy.png' : '/images/miku/miku-sweet.png'}
          bubbleMessage={mikuSpeech}
          bubbleBadge="Miku Artista"
          size="md"
        />
      </div>

      {/* Contenedor principal del juego */}
      <div className="bg-white/90 border-2 border-purple-200/90 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
        
        {/* Barra superior del tablero */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-800 font-bold">Progreso:</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
              {correctlyPlacedCount} de {TOTAL_PIECES} piezas en su lugar
            </span>
          </div>

          <button
            onClick={() => setShowPreview((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs text-purple-900 hover:text-purple-950 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-xl border border-purple-200 font-bold transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-purple-700" />
            <span>{showPreview ? 'Ocultar guía' : 'Ver imagen guía'}</span>
          </button>
        </div>

        {/* Guía previa desplegable */}
        {showPreview && (
          <div className="mb-6 p-4 rounded-2xl bg-purple-50/90 border-2 border-purple-200 flex flex-col sm:flex-row items-center gap-4 animate-fadeIn">
            <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden border border-purple-300 shadow-md">
              <img
                src={PUZZLE_IMAGE_URL}
                alt="Guía de la ilustración completa"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs text-purple-900 leading-relaxed text-center sm:text-left">
              <p className="font-bold text-purple-950 mb-1">Ilustración de cumpleaños de Miku:</p>
              <p className="font-medium text-purple-800">Miku en su vestido festivo con piano, notas y fresas. Puedes volver a ocultar esta ventana cuando gustes.</p>
            </div>
          </div>
        )}

        {/* Tablero del rompecabezas */}
        <div className="max-w-[340px] sm:max-w-[380px] mx-auto mb-6">
          {!isSolved ? (
            <div className="grid grid-cols-3 gap-1.5 p-2 bg-gradient-to-br from-purple-100 via-purple-50 to-white border-2 border-purple-300 rounded-2xl shadow-inner select-none">
              {board.map((pieceId, slotIndex) => {
                const isSelected = selectedSlot === slotIndex;
                const isCorrect = pieceId === slotIndex;

                return (
                  <div
                    key={slotIndex}
                    onClick={() => handleSlotClick(slotIndex)}
                    draggable={!isSolved}
                    onDragStart={(e) => handleDragStart(e, slotIndex)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, slotIndex)}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-150 transform active:scale-95 ${
                      isSelected
                        ? 'ring-4 ring-purple-600 scale-105 shadow-md z-10'
                        : isCorrect
                        ? 'border-2 border-emerald-500/80 hover:brightness-105'
                        : 'border border-purple-300/80 hover:border-purple-500 hover:scale-[1.02]'
                    }`}
                  >
                    {/* Pieza recortada de la imagen original */}
                    <PuzzlePiece pieceId={pieceId} />

                    {/* Indicador cuando la pieza está en su lugar correcto */}
                    {isCorrect && (
                      <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-sm">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}

                    {/* Halo de selección activa */}
                    {isSelected && (
                      <span className="absolute inset-0 bg-purple-500/20 pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Ilustración completa revelada con marco brillante al ganar */
            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-pink-400 shadow-xl animate-fadeIn">
              <img
                src={PUZZLE_IMAGE_URL}
                alt="Rompecabezas de Hatsune Miku completado"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Instrucción breve y humana */}
        {!isSolved && (
          <p className="text-center text-xs text-purple-800 mb-6 font-semibold">
            💡 {questConfig.puzzleConfig.introNote}
          </p>
        )}

        {/* Recompensa de victoria y avance */}
        {isSolved && (
          <div className="pt-4 border-t border-purple-100 text-center animate-fadeIn">
            <div className="inline-flex items-center gap-3 bg-pink-50 border-2 border-pink-200 rounded-2xl px-6 py-4 shadow-sm mb-6 max-w-lg mx-auto">
              <span className="text-4xl animate-bounce">💖</span>
              <div className="text-left">
                <span className="text-xs uppercase tracking-wider font-extrabold text-pink-700 block">
                  ¡Segundo tesoro desbloqueado!
                </span>
                <h4 className="text-lg font-bold text-purple-950">El Corazón Mágico 💜</h4>
                <p className="text-xs text-purple-800 font-medium">
                  Cada pieza encontró su lugar y ahora estamos un poquito más cerca de tu sorpresa.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-sm font-bold border border-purple-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Armar de nuevo
              </button>
              <button
                onClick={onNextGame}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-[#2da89f] text-white font-extrabold text-base shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-95 transition-all"
              >
                <span>Continuar aventura</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
