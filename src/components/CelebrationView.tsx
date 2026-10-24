import React, { useState, useRef, useEffect } from 'react';
import { questConfig } from '../config/questConfig';
import { soundManager } from '../utils/soundEffects';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  Music,
  Sparkles,
  Mic,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CelebrationViewProps {
  onReplayAdventure: () => void;
}

export const CelebrationView: React.FC<CelebrationViewProps> = ({ onReplayAdventure }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio track mode: 'voice' (real Miku MP3) or 'synth' (Web Audio Happy Birthday melody)
  const [audioMode, setAudioMode] = useState<'voice' | 'synth'>('voice');

  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isPlayingSynth, setIsPlayingSynth] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [synthProgress, setSynthProgress] = useState(0); // 0 to 100%
  const [audioError, setAudioError] = useState(false);
  const [audioFinished, setAudioFinished] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Dedication modal / expanded state
  const [showDedication, setShowDedication] = useState(false);

  // Equalizer visual animation frame
  const [equalizerBars, setEqualizerBars] = useState([30, 60, 45, 80, 50, 70, 40]);

  const isAnyPlaying = isPlayingVoice || isPlayingSynth;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAnyPlaying) {
      interval = setInterval(() => {
        setEqualizerBars(
          Array.from({ length: 7 }, () => Math.floor(Math.random() * 65) + 25)
        );
      }, 140);
    } else {
      setEqualizerBars([25, 30, 25, 35, 25, 30, 25]);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnyPlaying]);

  // Handle switching audio mode
  const handleSelectMode = (mode: 'voice' | 'synth') => {
    if (mode === audioMode) return;

    // Stop current playback
    stopAllAudio();
    setAudioMode(mode);
    setAudioFinished(false);
  };

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    soundManager.stopSampleBirthdaySong();
    setIsPlayingVoice(false);
    setIsPlayingSynth(false);
  };

  // Play / Pause toggler for Voice
  const handleToggleVoice = () => {
    if (!audioRef.current) return;

    if (isPlayingVoice) {
      audioRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      // Stop synth if playing
      soundManager.stopSampleBirthdaySong();
      setIsPlayingSynth(false);
      setAudioMode('voice');

      audioRef.current
        .play()
        .then(() => {
          setIsPlayingVoice(true);
          setAudioError(false);
          setAudioFinished(false);
        })
        .catch(() => {
          setAudioError(true);
          setIsPlayingVoice(false);
        });
    }
  };

  // Play / Pause toggler for Synth
  const handleToggleSynth = () => {
    if (isPlayingSynth) {
      soundManager.stopSampleBirthdaySong();
      setIsPlayingSynth(false);
    } else {
      // Stop voice if playing
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingVoice(false);
      setAudioMode('synth');
      setIsPlayingSynth(true);
      setSynthProgress(0);
      setAudioFinished(false);

      soundManager.playSampleBirthdaySong(
        () => {
          setIsPlayingSynth(false);
          setSynthProgress(100);
          setAudioFinished(true);
          soundManager.playSuccess();
        },
        (percent) => {
          setSynthProgress(percent);
        }
      );
    }
  };

  // Main primary button click (plays whichever mode is active)
  const handleMainAction = () => {
    if (audioMode === 'voice') {
      handleToggleVoice();
    } else {
      handleToggleSynth();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setAudioError(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlayingVoice(false);
    setAudioFinished(true);
    soundManager.playSuccess();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioMode === 'voice' && audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    setIsAudioMuted(newVol === 0);
    soundManager.setMuted(newVol === 0);
  };

  const handleToggleAudioMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
    soundManager.setMuted(nextMuted);
  };

  const handleReplayCurrent = () => {
    if (audioMode === 'voice') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => {
          setIsPlayingVoice(true);
          setAudioFinished(false);
        });
      }
    } else {
      handleToggleSynth();
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-16">
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={questConfig.audioPath}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        onError={() => setAudioError(true)}
        preload="auto"
      />

      {/* Hero Celebration Header */}
      <div className="text-center mb-8 animate-fadeIn">
        <div className="inline-block p-2 px-4 rounded-full bg-purple-100 border border-purple-200 text-xs font-bold text-purple-800 mb-3 shadow-xs">
          Un momento especial para ti 💜
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-700 mb-3">
          ¡Feliz cumpleaños, Camila! 💜
        </h1>
        <p className="text-sm sm:text-base text-purple-800 font-medium max-w-xl mx-auto leading-relaxed">
          Has completado cada juego y reunido todos los tesoros mágicos.
          {'\n'}Jorge y yo tenemos un regalo muy especial que queremos compartir contigo.
        </p>

        {/* Ilustración de celebración de Miku */}
        <div className="mt-6 max-w-sm sm:max-w-md mx-auto rounded-3xl overflow-hidden border-2 border-purple-200 shadow-xl bg-white p-2">
          <img
            src="/images/miku/miku-birthday.jpg"
            alt="Hatsune Miku con pastel y velas mágicas de cumpleaños"
            className="w-full h-auto rounded-2xl object-cover"
          />
        </div>
      </div>

      {/* SECTION: FOTO DE MIKU CON GLOBO DE TEXTO DE FELIZ CUMPLE */}
      <div className="bg-white/95 border-2 border-purple-200/90 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md mb-10 relative overflow-hidden">
        {/* Glow suave de fondo */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-100/60 rounded-full blur-3xl pointer-events-none" />

        {/* Miku con Globo de texto personalizado */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-purple-100 mb-6 relative z-10">
          {/* Foto de Miku destacada */}
          <div className="relative shrink-0 group">
            {/* Halo pulsante cuando suena el audio */}
            <div
              className={`absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#39C5BB]/60 via-purple-300 to-pink-300 blur-md transition-opacity duration-300 ${
                isAnyPlaying ? 'opacity-80 animate-pulse' : 'opacity-30 group-hover:opacity-60'
              }`}
            />
            
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-purple-300 bg-purple-50 shadow-md">
              <img
                src="/images/miku/miku-holding-cake.png"
                alt="Hatsune Miku con pastel de feliz cumpleaños"
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
              {/* Insignia con notas musicales si está sonando */}
              {isAnyPlaying && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#2da89f] text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md animate-bounce">
                  <span>♪</span>
                  <span>En vivo</span>
                </div>
              )}
            </div>
            
            {/* Pie de foto */}
            <div className="text-center mt-2">
              <span className="text-xs font-bold text-purple-800 tracking-wide">
                Hatsune Miku 🎵
              </span>
            </div>
          </div>

          {/* Globo de texto (Speech Bubble) de Feliz Cumple */}
          <div className="flex-1 relative w-full">
            {/* Flecha apuntando a Miku (en escritorio a la izquierda, en móvil hacia arriba) */}
            <div className="hidden md:block absolute -left-3 top-8 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-purple-50" />
            <div className="md:hidden absolute left-1/2 -top-3 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[12px] border-b-purple-50" />

            <div className="bg-gradient-to-br from-white via-purple-50/70 to-purple-100/50 border-2 border-purple-300 rounded-2xl p-5 sm:p-6 shadow-md relative">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-purple-700">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="uppercase tracking-wider">Mensaje de cumpleaños</span>
                <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-purple-100 border border-purple-200 text-purple-800 font-bold">
                  Especial para Camila
                </span>
              </div>

              {/* Título en globo de texto */}
              <h2 className="text-xl sm:text-2xl font-black text-purple-950 mb-2">
                ¡Feliz Cumpleaños, Camila! 💜🎂
              </h2>

              {/* Mensaje principal */}
              <p className="text-sm sm:text-base font-bold text-purple-900 mb-2 leading-relaxed">
                «カミラさん、お誕生日おめでとうございます！»
              </p>
              
              <p className="text-xs sm:text-sm text-purple-800 font-medium leading-relaxed">
                ¡Que este nuevo año de vida esté lleno de música, sonrisas dulces, momentos inolvidables y mucha magia! Gracias por acompañarme en esta aventura. 💜✨
              </p>
            </div>
          </div>
        </div>

        {/* SELECTOR DE AUDIO: VOZ DE MIKU vs CANCIÓN CON SINTETIZADOR */}
        <div className="mb-6 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-900">
              Dos mensajes para ti:
            </span>
            {/* Equalizer Waveform animation */}
            <div className="flex items-end gap-1 h-6">
              {equalizerBars.map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className="w-1.5 rounded-full bg-gradient-to-t from-purple-500 to-[#2da89f] transition-all duration-150"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Opción 1: Voz Real de Miku */}
            <button
              onClick={() => handleSelectMode('voice')}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                audioMode === 'voice'
                  ? 'bg-purple-50/90 border-purple-500 shadow-sm'
                  : 'bg-white hover:bg-purple-50/50 border-purple-200 opacity-90 hover:opacity-100'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  audioMode === 'voice'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                <Mic className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-purple-950">Mi mensaje</span>
                  {isPlayingVoice && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-200 text-purple-900">
                      Sonando
                    </span>
                  )}
                </div>
                <p className="text-xs text-purple-800 font-medium mt-0.5 line-clamp-2">
                  Este es mi mensaje para ti Camila :D
                </p>
              </div>
            </button>

            {/* Opción 2: Canción Sintetizada */}
            <button
              onClick={() => handleSelectMode('synth')}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                audioMode === 'synth'
                  ? 'bg-pink-50/90 border-pink-400 shadow-sm'
                  : 'bg-white hover:bg-purple-50/50 border-purple-200 opacity-90 hover:opacity-100'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  audioMode === 'synth'
                    ? 'bg-pink-500 text-white'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                <Music className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-purple-950">Las tonadas de Jorge</span>
                  {isPlayingSynth && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-200 text-pink-900">
                      Sonando
                    </span>
                  )}
                </div>
                <p className="text-xs text-purple-800 font-medium mt-0.5 line-clamp-2">
                  Tonadas hechas por mi para ti Camila ❤️
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* CONTROLES DE REPRODUCCIÓN */}
        <div className="space-y-4 bg-purple-50/70 rounded-2xl p-5 border border-purple-200 relative z-10">
          {/* Botón principal de reproducción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
            <button
              onClick={handleMainAction}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base sm:text-lg shadow-lg transition-all transform active:scale-95 ${
                isAnyPlaying
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-pink-500/20'
                  : audioMode === 'voice'
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-[#2da89f] text-white hover:brightness-105 shadow-purple-500/20 animate-pulse-glow'
                  : 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 text-white hover:brightness-105 shadow-pink-500/20 animate-pulse-glow'
              }`}
            >
              {isAnyPlaying ? (
                <>
                  <Pause className="w-6 h-6 fill-current" />
                  <span>
                    {isPlayingVoice
                      ? 'Pausar voz de Miku'
                      : 'Pausar canción sintetizada'}
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  <span>
                    {audioMode === 'voice'
                      ? 'Escuchar mensaje 🎙️'
                      : 'Escuchar canción  🎹'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Barra de progreso */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-purple-800 font-bold tabular-nums px-1">
              <span>
                {audioMode === 'voice'
                  ? formatTime(currentTime)
                  : `${synthProgress}%`}
              </span>
              <span>
                {audioMode === 'voice'
                  ? formatTime(duration)
                  : 'Melodía completa'}
              </span>
            </div>
            
            {audioMode === 'voice' ? (
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                disabled={duration === 0}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                aria-label="Barra de progreso del audio de voz"
              />
            ) : (
              <div className="w-full h-2 bg-purple-200 rounded-lg overflow-hidden">
                <div
                  style={{ width: `${synthProgress}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-400 to-[#2da89f] transition-all duration-200"
                />
              </div>
            )}
          </div>

          {/* Barra de herramientas inferior (Repetir y Volumen) */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleReplayCurrent}
              className="inline-flex items-center gap-1.5 text-xs text-purple-800 hover:text-purple-950 font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reproducir de nuevo</span>
            </button>

            {/* Control de volumen */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleAudioMute}
                className="text-purple-800 hover:text-purple-950 transition-colors p-1"
                aria-label={isAudioMuted ? 'Activar sonido' : 'Silenciar sonido'}
              >
                {isAudioMuted ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isAudioMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                aria-label="Control de volumen"
              />
            </div>
          </div>
        </div>

        {/* Mensaje de cierre obligatorio: "Espero que hayas disfrutado tu sorpresa." */}
        {audioFinished && (
          <div className="mt-6 pt-4 border-t border-purple-100 text-center animate-fadeIn">
            <div className="inline-block px-5 py-2.5 rounded-2xl bg-pink-50 border-2 border-pink-300 shadow-sm">
              <p className="text-base sm:text-lg font-bold text-purple-950">
                "Espero que hayas disfrutado tu sorpresa." 💜✨
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Optional Personal Dedication Button & Expandable Card */}
      <div className="mb-12 text-center">
        {!showDedication ? (
          <div className="bg-white/90 border-2 border-purple-200/90 rounded-3xl p-6 sm:p-8 max-w-xl mx-auto shadow-md">
            <span className="text-3xl block mb-2">💌</span>
            <h3 className="text-lg font-bold text-purple-950 mb-2">Una carta de Jorge</h3>
            <p className="text-xs sm:text-sm text-purple-800/90 mb-5 max-w-md mx-auto leading-relaxed font-medium">
              Hay unas palabras sinceras escritas desde el respeto y el cariño. Puedes leerlas si tu quieres (es adicional al regalo).
            </p>
            <button
              onClick={() => {
                setShowDedication(true);
                soundManager.playClick();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold text-sm border border-purple-300 shadow-xs transition-all active:scale-95"
            >
              <Heart className="w-4 h-4 text-pink-600 fill-pink-600/30" />
              <span>{questConfig.personalDedication.buttonLabel}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="bg-white border-2 border-pink-200 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto shadow-xl text-left animate-fadeIn relative">
            <div className="flex items-center justify-between pb-4 border-b border-purple-100 mb-6">
              <div className="flex items-center gap-2 text-pink-600 font-bold text-sm">
                <Heart className="w-4 h-4 fill-pink-600" />
                <span>{questConfig.personalDedication.title}</span>
              </div>
              <button
                onClick={() => setShowDedication(false)}
                className="inline-flex items-center gap-1 text-xs text-purple-700 hover:text-purple-950 px-3 py-1 rounded-lg bg-purple-100 transition-colors font-semibold"
              >
                <span>Ocultar carta</span>
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-purple-950 text-sm sm:text-base leading-relaxed font-normal">
              {questConfig.personalDedication.paragraphs.map((p, index) => (
                <p
                  key={index}
                  className={
                    p.startsWith('Feliz cumpleaños') ? 'font-black text-pink-600 text-lg my-4' : 'text-purple-900'
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-purple-100 text-right">
              <span className="text-pink-600 font-bold italic text-base">
                {questConfig.personalDedication.signature}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Section: Pequeños detalles para ti (4 Cards Album) */}
      <div className="mb-12">
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest text-purple-700 font-bold bg-purple-100 px-3 py-1 rounded-full">
            Álbum de Recuerdos
          </span>
          <h2 className="text-2xl font-black text-purple-950 mt-2">Pequeños detalles para ti</h2>
          <p className="text-xs sm:text-sm text-purple-800 font-medium max-w-md mx-auto mt-1">
            Cuatro pequeños homenajes a lo que hace especial tu mundo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {questConfig.albumCards.map((card) => (
            <div
              key={card.id}
              className="bg-white/90 border border-purple-200 hover:border-purple-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl p-2 rounded-xl bg-purple-100 border border-purple-200">
                  {card.icon}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  {card.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-purple-950 mb-1">{card.title}</h3>
              <p className="text-xs font-bold text-purple-700 mb-2">{card.subtitle}</p>
              <p className="text-xs text-purple-900 leading-relaxed font-medium">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="text-center pt-6 border-t border-purple-200">
        <button
          onClick={onReplayAdventure}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-950 text-sm font-bold transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Volver a jugar la aventura desde el inicio</span>
        </button>
      </div>
    </div>
  );
};
