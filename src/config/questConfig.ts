/**
 * Configuración centralizada para "Camila's Birthday Quest 💜"
 * Puedes editar aquí textos, mensajes, preguntas, ingredientes y dedicatoria.
 */

export interface QuestConfig {
  recipientName: string;
  title: string;
  subtitle: string;
  welcomeMessage: {
    greeting: string;
    body: string;
    cta: string;
    secondaryCta: string;
  };
  audioPath: string; // Ruta local del archivo de audio de Miku
  colors: {
    primaryPurple: string;
    lavender: string;
    darkPurple: string;
    pastelPink: string;
    white: string;
    mikuTeal: string;
  };
  puzzleConfig: {
    title: "El rompecabezas de Miku",
    subtitle: "Arma la ilustración pieza a pieza a tu propio ritmo",
    introNote: "Tómate tu tiempo, sin prisas. Puedes arrastrar las piezas o tocarlas para intercambiarlas ✨",
    completionMessage: "¡Lo lograste, Camila! 💜\n\nMiku está muy feliz de que hayas completado esta pequeña aventura.\n\nCada pieza encontró su lugar y ahora estamos un poquito más cerca de tu sorpresa.",
  };
  kitchenIngredients: {
    correct: Array<{ id: string; name: string; icon: string; description: string }>;
    incorrect: Array<{ id: string; name: string; icon: string; hint: string }>;
  };
  hiddenObjects: Array<{
    id: string;
    name: string;
    icon: string;
    hint: string;
  }>;
  albumCards: Array<{
    id: number;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    badge: string;
  }>;
  personalDedication: {
    title: string;
    buttonLabel: string;
    paragraphs: string[];
    signature: string;
  };
}

export const questConfig: QuestConfig = {
  recipientName: "Camila",
  title: "Camila's Birthday Quest",
  subtitle: "Una aventura hecha especialmente para ti 💜",
  welcomeMessage: {
    greeting: "¡Hola, Camila!",
    body: "Miku ha preparado una pequeña aventura de cumpleaños para ti.\nHay juegos, sorpresas y un regalo especial esperando al final.\n\n¿Estás lista para comenzar?",
    cta: "Comenzar aventura",
    secondaryCta: "Cómo jugar",
  },
  audioPath: "/audio/miku-birthday.mp3",
  colors: {
    primaryPurple: "#8B5CF6",
    lavender: "#C4B5FD",
    darkPurple: "#24133D",
    pastelPink: "#FBCFE8",
    white: "#FFFFFF",
    mikuTeal: "#39C5BB",
  },
  puzzleConfig: {
    title: "El rompecabezas de Miku",
    subtitle: "Arma la ilustración pieza a pieza a tu propio ritmo",
    introNote: "Tómate tu tiempo, sin prisas. Puedes arrastrar las piezas o tocarlas para intercambiarlas ✨",
    completionMessage: "¡Lo lograste, Camila! 💜\n\nMiku está muy feliz de que hayas completado esta pequeña aventura.\n\nCada pieza encontró su lugar y ahora estamos un poquito más cerca de tu sorpresa.",
  },
  kitchenIngredients: {
    correct: [
      { id: "harina", name: "Harina suave", icon: "🌾", description: "Base esponjosa y perfecta para el pastel." },
      { id: "huevos", name: "Huevos frescos", icon: "🥚", description: "Le darán la textura suave y dorada." },
      { id: "azucar", name: "Azúcar dulce", icon: "✨", description: "Dulzura justa para alegrar el paladar." },
      { id: "fresas", name: "Fresas jugosas", icon: "🍓", description: "El toque frutal y festivo ideal." },
    ],
    incorrect: [
      { id: "sal", name: "Sal de mesa", icon: "🧂", hint: "¡Uy! Demasiada sal arruinaría el dulce sabor del pastel, Camila jeje." },
      { id: "pimienta", name: "Pimienta negra", icon: "🌶️", hint: "¡Ups! La pimienta pica mucho, mejor guardarla para otra receta." },
      { id: "tomate", name: "Salsa de tomate", icon: "🥫", hint: "¡Miku dice que eso es para una pizza, no para tu pastel de cumpleaños!" },
    ],
  },
  hiddenObjects: [
    {
      id: "estrella",
      name: "Estrella mágica",
      icon: "⭐",
      hint: "Brilla suavemente cerca de la ventana estrellada o en la repisa superior.",
    },
    {
      id: "pastel",
      name: "Mini pastelito",
      icon: "🧁",
      hint: "Descansa sobre la mesa de té decorada con flores lavanda.",
    },
    {
      id: "guitarra",
      name: "Guitarra turquesa",
      icon: "🎸",
      hint: "Apoyada junto al amplificador y el sillón de descanso.",
    },
    {
      id: "regalo",
      name: "Caja de regalo",
      icon: "🎁",
      hint: "Escondida delicadamente al lado del mueble de libros.",
    },
  ],
  albumCards: [
    {
      id: 1,
      title: "La musica",
      subtitle: "Melodias que alegran el corazon",
      description: "Adoro cuando me muestras videos de canciones de Miku y de como Miku es tu heroina.",
      icon: "🎵",
      badge: "Armonía",
    },
    {
      id: 2,
      title: "Tu pasión por cocinar",
      subtitle: "El arte de crear",
      description: "Me gusta mucho cuando me muestras lo que cocinas y horneas. Disfruto mucho esos momentos.",
      icon: "👩‍🍳",
      badge: "Dulzura",
    },
    {
      id: 3,
      title: "Tu cumpleaños",
      subtitle: "Celebrando un año más",
      description: "Me alegra poder compartir este dia tan especial contigo por primera vez.",
      icon: "🎂",
      badge: "Celebración",
    },
    {
      id: 4,
      title: "Tus sueños",
      subtitle: "Metas por alcanzar",
      description: "Tienes la fuerza, el talento y la luz para cumplir todo lo que te propongas.",
      icon: "✨",
      badge: "Futuro",
    },
  ],
  personalDedication: {
    title: "Una dedicatoria para ti",
    buttonLabel: "Hay algo que quiero decirte...",
    paragraphs: [
      "Camila...",
      "Quería hacer algo especial para ti en tu cumpleaños.",
      "Sé que he cometido errores y que hay cosas que no puedo cambiar simplemente con palabras.",
      "No quiero que este regalo sea una forma de pedirte algo, ni de hacerte sentir que tienes que darme una oportunidad.",
      "Lo hice porque sigues siendo una persona muy especial para mí. Y en este dia tan especial, quiero que disfrutes mucho.",
      "Me alegra que hayamos vuelto a hablar y quiero que sepas que todavía te quiero.",
      "Estoy aprendiendo de mis errores, quiero mejorar como persona y demostrar con hechos que puedo hacer las cosas de una manera diferente.",
      "No espero que olvides lo que pasó, ni que tengas que decidir nada por este regalo.",
      "Simplemente quería regalarte un momento bonito, hacerte sonreír y recordarte lo mucho que significas para mí. Y hay mucho que decir, pero lo mas importarte este dia es decirte:",
      "Feliz cumpleaños, Camila. 💜",
      "Espero que este nuevo año de tu vida esté lleno de cosas bonitas, sueños cumplidos y mucha felicidad y de lindos momentos juntos.",
    ],
    signature: "Con cariño... de Jorge",
  },
};
