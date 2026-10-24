import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border-2 border-purple-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-purple-950 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-purple-100 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-purple-950">Cómo jugar la aventura</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-400 hover:text-purple-950 hover:bg-purple-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-purple-900 leading-relaxed">
          <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-200">
            <h3 className="font-bold text-purple-900 mb-1 flex items-center gap-2">
              <span>🎯</span> Tu Misión
            </h3>
            <p className="text-purple-800">
              Acompaña a Hatsune Miku a través de 5 divertidos mini-juegos. Tu meta es reunir los tres objetos mágicos de cumpleaños:
            </p>
            <div className="flex justify-around mt-3 text-center">
              <div className="bg-white px-3 py-2 rounded-xl border border-purple-200 shadow-xs">
                <span className="text-xl block">⭐</span>
                <span className="text-xs text-amber-700 font-bold">Estrella musical</span>
              </div>
              <div className="bg-white px-3 py-2 rounded-xl border border-purple-200 shadow-xs">
                <span className="text-xl block">💖</span>
                <span className="text-xs text-pink-700 font-bold">Corazón mágico</span>
              </div>
              <div className="bg-white px-3 py-2 rounded-xl border border-purple-200 shadow-xs">
                <span className="text-xl block">🗝️</span>
                <span className="text-xs text-yellow-700 font-bold">Llave dorada</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-purple-950">Los 5 Desafíos:</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 bg-purple-50/70 p-2.5 rounded-xl border border-purple-100">
                <span className="text-base shrink-0">1️⃣</span>
                <div>
                  <strong className="text-purple-950 block text-xs uppercase tracking-wider font-bold">El Concierto de Miku</strong>
                  <span className="text-xs text-purple-800">Repite la alegre secuencia de notas musicales y ritmo.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5 bg-purple-50/70 p-2.5 rounded-xl border border-purple-100">
                <span className="text-base shrink-0">2️⃣</span>
                <div>
                  <strong className="text-purple-950 block text-xs uppercase tracking-wider font-bold">La Cocina de Camila</strong>
                  <span className="text-xs text-purple-800">Escoge los ingredientes dulces para hornear tu pastel de cumpleaños.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5 bg-purple-50/70 p-2.5 rounded-xl border border-purple-100">
                <span className="text-base shrink-0">3️⃣</span>
                <div>
                  <strong className="text-purple-950 block text-xs uppercase tracking-wider font-bold">El rompecabezas de Miku</strong>
                  <span className="text-xs text-purple-800">Arma la ilustración pieza a pieza a tu propio ritmo.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5 bg-purple-50/70 p-2.5 rounded-xl border border-purple-100">
                <span className="text-base shrink-0">4️⃣</span>
                <div>
                  <strong className="text-purple-950 block text-xs uppercase tracking-wider font-bold">El Tesoro Escondido</strong>
                  <span className="text-xs text-purple-800">Encuentra los cuatro objetos en la acogedora habitación mágica.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5 bg-purple-50/70 p-2.5 rounded-xl border border-purple-100">
                <span className="text-base shrink-0">5️⃣</span>
                <div>
                  <strong className="text-purple-950 block text-xs uppercase tracking-wider font-bold">El Regalo Final</strong>
                  <span className="text-xs text-purple-800">Combina los tres tesoros para abrir la gran sorpresa de cumpleaños.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="text-xs text-purple-900 bg-purple-100/70 p-3 rounded-xl border border-purple-200">
            ✨ <span className="font-bold">Sin presiones:</span> No hay tiempo límite ni penalizaciones. Tu progreso se guarda automáticamente en tu navegador.
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-purple-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-[#2da89f] text-white font-bold shadow-md hover:brightness-105 active:scale-[0.98] transition-all"
          >
            ¡Entendido, vamos a jugar! 💜
          </button>
        </div>
      </div>
    </div>
  );
};
