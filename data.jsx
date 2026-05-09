// Data layer — quests, character, achievements, history
const HERO = {
  name: "Sir Tomás de Valoria",
  title: "Caballero del Hábito",
  level: 12,
  xp: 740,
  xpNext: 1000,
  gold: 1247,
  streak: 23,
  rank: 47,
  stats: {
    fuerza:      { value: 18, label: "Fuerza",      glyph: "⚔" },
    sabiduria:   { value: 22, label: "Sabiduría",   glyph: "✦" },
    constitucion:{ value: 16, label: "Constitución",glyph: "♥" },
    disciplina:  { value: 24, label: "Disciplina",  glyph: "❖" },
    carisma:     { value: 14, label: "Carisma",     glyph: "✿" },
    fortuna:     { value: 11, label: "Fortuna",     glyph: "✪" },
  }
};

const QUESTS = [
  { id: "q1", type: "diaria",  title: "Beberás 3 litros del manantial",
    sub: "Hidrata el alma del guerrero",
    desc: "Cada gota fortalece la sangre. El cuerpo es el templo del valor — manténlo lleno como el cáliz del rey.",
    tasks: ["Litro al alba","Litro al mediodía","Litro al ocaso"],
    xp: 40, gold: 12, stat: "constitucion", icon: "💧",
    tint: "#a4c4d4", rotate: -3, completed: false },
  { id: "q2", type: "diaria",  title: "Marcha de mil pasos",
    sub: "Un paseo bajo el sol",
    desc: "Camina al menos cuarenta minutos. Que las suelas conozcan los caminos del reino.",
    tasks: ["Salir de la fortaleza","40 minutos de marcha","Volver con honor"],
    xp: 35, gold: 10, stat: "fuerza", icon: "👣", tint: "#d4c094", rotate: 2 },
  { id: "q3", type: "diaria",  title: "Ordena tus aposentos",
    sub: "El caos invita al dragón",
    desc: "Un caballero sin cama tendida no tiene reino. Ordena tu cámara con disciplina.",
    tasks: ["Tender el lecho","Recoger las vestiduras","Limpiar el polvo del escritorio"],
    xp: 25, gold: 8, stat: "disciplina", icon: "🛏", tint: "#e0d2a8", rotate: -2 },
  { id: "q4", type: "semanal", title: "Vianda noble por siete soles",
    sub: "Sin azúcar, sin engaño",
    desc: "Durante esta semana evitarás el azúcar refinado. Verduras, carnes magras y agua serán tu festín.",
    tasks: ["Día 1","Día 2","Día 3","Día 4","Día 5","Día 6","Día 7"],
    xp: 220, gold: 80, stat: "constitucion", icon: "🍎", tint: "#d4a878", rotate: 1 },
  { id: "q5", type: "epica",   title: "Maratón del Valle Olvidado",
    sub: "Hazaña legendaria",
    desc: "Correrás 10 leguas (10 km) sin detenerte. Sólo los más bravos cruzan el valle.",
    tasks: ["Calentamiento","5 km","10 km — gloria"],
    xp: 600, gold: 250, stat: "fuerza", icon: "🏹", tint: "#c89a6a", rotate: -4, sealed: true },
  { id: "q6", type: "gremio",  title: "Convoca al gremio",
    sub: "Cena con tres compañeros",
    desc: "Reúne a tres aliados en banquete real. Comer en compañía nutre el carisma del caballero.",
    tasks: ["Convocar","Banquete","Memorias"],
    xp: 180, gold: 60, stat: "carisma", icon: "🍷", tint: "#b09480", rotate: 3 },
  { id: "q7", type: "cadena",  title: "Senda del manuscrito — I",
    sub: "Lee 20 páginas del códice",
    desc: "Primer eslabón. Lee veinte páginas de un libro de tu elección, hoy mismo.",
    tasks: ["Abrir el códice","20 páginas"],
    xp: 60, gold: 15, stat: "sabiduria", icon: "📜", tint: "#e6d6b4", rotate: -1, chain: 1 },
  { id: "q8", type: "diaria",  title: "Diez minutos de meditación",
    sub: "Silencia las voces del bosque",
    desc: "Diez minutos en quietud absoluta. Respira y observa.",
    tasks: ["Sentarse","10 min de calma"],
    xp: 30, gold: 10, stat: "sabiduria", icon: "✦", tint: "#c8b88a", rotate: 2 },
  { id: "q9", type: "semanal", title: "Tres entrenamientos de fuerza",
    sub: "Forja del cuerpo",
    desc: "Realiza tres sesiones de entrenamiento muscular en la semana.",
    tasks: ["Sesión 1","Sesión 2","Sesión 3"],
    xp: 180, gold: 55, stat: "fuerza", icon: "⚔", tint: "#b8997a", rotate: -2 },
];

const HISTORY = [
  { date: "Ayer",        title: "Marcha de mil pasos",         xp: 35,  stat: "fuerza" },
  { date: "Ayer",        title: "Diez minutos de meditación",  xp: 30,  stat: "sabiduria" },
  { date: "Ayer",        title: "Beberás 3 litros del manantial", xp: 40, stat: "constitucion" },
  { date: "Hace 2 días", title: "Ordena tus aposentos",        xp: 25,  stat: "disciplina" },
  { date: "Hace 2 días", title: "Senda del manuscrito — I",    xp: 60,  stat: "sabiduria" },
  { date: "Hace 3 días", title: "Cazador del alba",            xp: 90,  stat: "disciplina", epic: true },
  { date: "Hace 4 días", title: "Vianda noble — Día 3",        xp: 30,  stat: "constitucion" },
  { date: "Hace 5 días", title: "Banquete del gremio",         xp: 180, stat: "carisma", epic: true },
];

const ACHIEVEMENTS = [
  { id:"a1", name:"Primer Paso",      desc:"Completa tu primera misión", got:true,  glyph:"✦" },
  { id:"a2", name:"Llama Eterna",     desc:"Racha de 7 días",            got:true,  glyph:"🔥" },
  { id:"a3", name:"Hidromante",       desc:"100 L de agua",              got:true,  glyph:"💧" },
  { id:"a4", name:"Senda de Hierro",  desc:"50 misiones de Fuerza",      got:true,  glyph:"⚔" },
  { id:"a5", name:"Dragón Domado",    desc:"Racha de 30 días",           got:false, glyph:"🐉" },
  { id:"a6", name:"Maestro Astuto",   desc:"Nivel 20",                   got:false, glyph:"♛" },
  { id:"a7", name:"Cofre del Reino",  desc:"5.000 monedas",              got:false, glyph:"⚜" },
  { id:"a8", name:"Heraldo",          desc:"10 misiones de gremio",      got:false, glyph:"⚘" },
];

const INVENTORY = [
  { id:"i1", name:"Espada de Hierro",      kind:"arma",     glyph:"⚔", rarity:"común",     equipped:true },
  { id:"i2", name:"Yelmo del Constante",   kind:"armadura", glyph:"⛨", rarity:"raro",     equipped:true },
  { id:"i3", name:"Capa del Caminante",    kind:"armadura", glyph:"❀", rarity:"común" },
  { id:"i4", name:"Anillo de Sabiduría",   kind:"reliquia", glyph:"◉", rarity:"épico" },
  { id:"i5", name:"Poción de Vigor",       kind:"consumo",  glyph:"⚱", rarity:"común", count:3 },
  { id:"i6", name:"Pluma del Cronista",    kind:"reliquia", glyph:"✒", rarity:"raro" },
  { id:"i7", name:"Mapa del Valle",        kind:"reliquia", glyph:"⌘", rarity:"raro" },
  { id:"i8", name:"Llave de Oro",          kind:"reliquia", glyph:"⚷", rarity:"épico" },
];

const RANK = [
  { name:"Lady Marina del Lago",   level:18, score:14820, you:false },
  { name:"Maese Ulrico",           level:15, score:11240, you:false },
  { name:"Sir Tomás de Valoria",   level:12, score: 9430, you:true  },
  { name:"Don Renato",             level:11, score: 8120, you:false },
  { name:"Hermana Inés",           level: 9, score: 6740, you:false },
];

const TYPE_META = {
  diaria:  { label:"Diaria",   color:"#8a6a2a", glyph:"☀" },
  semanal: { label:"Semanal",  color:"#2c476f", glyph:"☾" },
  epica:   { label:"Épica",    color:"#7d1e1e", glyph:"♛" },
  gremio:  { label:"Gremio",   color:"#2f5a3a", glyph:"⚜" },
  cadena:  { label:"Cadena",   color:"#5a3a1a", glyph:"⛓" },
};

Object.assign(window, { HERO, QUESTS, HISTORY, ACHIEVEMENTS, INVENTORY, RANK, TYPE_META });
