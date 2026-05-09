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
    fuerza:       { value: 18, label: "Fuerza",       glyph: "⚔" },
    sabiduria:    { value: 22, label: "Sabiduría",    glyph: "✦" },
    constitucion: { value: 16, label: "Constitución", glyph: "♥" },
    disciplina:   { value: 24, label: "Disciplina",   glyph: "❖" },
    carisma:      { value: 14, label: "Carisma",      glyph: "✿" },
    agilidad:     { value: 11, label: "Agilidad",     glyph: "☽" },
  }
};

// ── Misiones ──────────────────────────────────────────────────
// stat: fuerza | sabiduria | constitucion | disciplina | carisma | agilidad

const QUESTS = [
  // ── DIARIAS ───────────────────────────────────────────────
  { id:"q1",  type:"diaria",
    title:"Beberás 3 litros del manantial",
    sub:"Hidrata el alma del guerrero",
    desc:"Cada gota fortalece la sangre. El cuerpo es el templo del valor — manténlo lleno como el cáliz del rey.",
    tasks:["Litro al alba","Litro al mediodía","Litro al ocaso"],
    xp:40, gold:12, stat:"constitucion", icon:"💧", tint:"#a4c4d4", rotate:-3 },

  { id:"q2",  type:"diaria",
    title:"Marcha de mil pasos",
    sub:"Un paseo bajo el sol",
    desc:"Camina al menos cuarenta minutos. Que las suelas conozcan los caminos del reino.",
    tasks:["Salir de la fortaleza","40 minutos de marcha","Volver con honor"],
    xp:35, gold:10, stat:"agilidad", icon:"👣", tint:"#d4c094", rotate:2 },

  { id:"q3",  type:"diaria",
    title:"Ordena tus aposentos",
    sub:"El caos invita al dragón",
    desc:"Un caballero sin cama tendida no tiene reino. Ordena tu cámara con disciplina.",
    tasks:["Tender el lecho","Recoger las vestiduras","Limpiar el polvo del escritorio"],
    xp:25, gold:8, stat:"disciplina", icon:"🛏", tint:"#e0d2a8", rotate:-2 },

  { id:"q8",  type:"diaria",
    title:"Diez minutos de meditación",
    sub:"Silencia las voces del bosque",
    desc:"Diez minutos en quietud absoluta. Respira y observa — la mente quieta es la espada más afilada.",
    tasks:["Sentarse","Cerrar los ojos","10 min de calma"],
    xp:30, gold:10, stat:"sabiduria", icon:"✦", tint:"#c8b88a", rotate:2 },

  { id:"q10", type:"diaria",
    title:"Forja del guerrero — 50 repeticiones",
    sub:"El hierro moldea al hombre",
    desc:"Cincuenta flexiones de pecho. No importa si las hacés en series — lo que importa es terminarlas.",
    tasks:["Primera tanda","Segunda tanda","50 completadas"],
    xp:45, gold:14, stat:"fuerza", icon:"💪", tint:"#b89880", rotate:-1 },

  { id:"q11", type:"diaria",
    title:"Sin redes antes del mediodía",
    sub:"El guerrero no se distrae",
    desc:"Las redes sociales consumen el tiempo de los débiles. Antes del mediodía, ni un vistazo.",
    tasks:["Despertar sin el teléfono","Mañana enfocada","Llegar al mediodía victorioso"],
    xp:30, gold:10, stat:"disciplina", icon:"⚔", tint:"#c4b090", rotate:3 },

  { id:"q12", type:"diaria",
    title:"El sueño del guerrero — 8 horas",
    sub:"La batalla se gana descansando",
    desc:"Dormir ocho horas es un acto de disciplina. El cuerpo se repara, la mente se afila.",
    tasks:["Apagar pantallas a las 22h","Acostarse a tiempo","8 horas de sueño cumplidas"],
    xp:40, gold:12, stat:"constitucion", icon:"🌙", tint:"#8890a4", rotate:-2 },

  { id:"q13", type:"diaria",
    title:"Escribe en el diario del reino",
    sub:"La pluma graba la historia",
    desc:"Escribe al menos cinco oraciones sobre tu día. Los grandes caballeros registran sus batallas.",
    tasks:["Abrir el diario","Reflexionar","Cinco oraciones escritas"],
    xp:25, gold:8, stat:"sabiduria", icon:"📜", tint:"#d4c8a0", rotate:1 },

  { id:"q14", type:"diaria",
    title:"Cocina tu propia vianda",
    sub:"El guerrero no depende del posadero",
    desc:"Prepara al menos una comida del día en casa. Sin delivery, sin excusas.",
    tasks:["Elegir la receta","Conseguir los ingredientes","Cocinar y comer"],
    xp:35, gold:12, stat:"constitucion", icon:"🍖", tint:"#d4a878", rotate:-3 },

  { id:"q15", type:"diaria",
    title:"Estiramientos del alba",
    sub:"El cuerpo flexible no se rompe",
    desc:"Quince minutos de estiramiento al despertar. El caballero que no estira, se lesiona en batalla.",
    tasks:["Al despertar","15 min de elongación","Cuerpo listo para el día"],
    xp:25, gold:8, stat:"agilidad", icon:"🌅", tint:"#e8c4a0", rotate:2 },

  { id:"q16", type:"diaria",
    title:"Convoca a un aliado",
    sub:"El aislamiento debilita al guerrero",
    desc:"Llama o escríbele a alguien que te importe. Un guerrero con aliados vale por diez.",
    tasks:["Pensar en quién llamar","La llamada o mensaje","Conexión real establecida"],
    xp:30, gold:10, stat:"carisma", icon:"🤝", tint:"#c8a090", rotate:-1 },

  { id:"q24", type:"diaria",
    title:"Sin azúcar hoy",
    sub:"El dulce es el enemigo silencioso",
    desc:"Un día sin azúcar refinada. Nada de golosinas, refrescos ni ultraprocesados.",
    tasks:["Revisar los alimentos del día","Sin azúcar en el desayuno","Sin azúcar en todo el día"],
    xp:45, gold:15, stat:"constitucion", icon:"🍎", tint:"#b4c4a4", rotate:1 },

  { id:"q25", type:"diaria",
    title:"Quince minutos de sol",
    sub:"El astro rey da vida al guerrero",
    desc:"Sal al exterior y exponte al sol durante al menos quince minutos. Vitamina D para el combate.",
    tasks:["Salir al exterior","15 min bajo el sol","Volver cargado de energía"],
    xp:20, gold:6, stat:"constitucion", icon:"☀", tint:"#e8d090", rotate:-2 },

  // ── SEMANALES ─────────────────────────────────────────────
  { id:"q4",  type:"semanal",
    title:"Vianda noble por siete soles",
    sub:"Sin azúcar, sin engaño",
    desc:"Durante esta semana evitarás el azúcar refinado. Verduras, carnes magras y agua serán tu festín.",
    tasks:["Día 1","Día 2","Día 3","Día 4","Día 5","Día 6","Día 7"],
    xp:220, gold:80, stat:"constitucion", icon:"🥗", tint:"#b4c4a4", rotate:1 },

  { id:"q9",  type:"semanal",
    title:"Tres entrenamientos de fuerza",
    sub:"Forja del cuerpo",
    desc:"Realiza tres sesiones de entrenamiento muscular en la semana. Pesas, calistenia, lo que sea.",
    tasks:["Sesión 1","Sesión 2","Sesión 3"],
    xp:180, gold:55, stat:"fuerza", icon:"⚔", tint:"#b8997a", rotate:-2 },

  { id:"q17", type:"semanal",
    title:"Gran limpieza del castillo",
    sub:"El orden es poder",
    desc:"Limpieza profunda del hogar: baño, cocina, pisos. Un castillo limpio es un castillo invencible.",
    tasks:["Limpiar baño","Limpiar cocina","Pisos y superficies","Sacar la basura"],
    xp:160, gold:50, stat:"disciplina", icon:"🏰", tint:"#c4b090", rotate:2 },

  { id:"q18", type:"semanal",
    title:"Semana sin alcohol",
    sub:"La mente clara es la mejor arma",
    desc:"Siete días sin ninguna bebida alcohólica. El guerrero que controla sus hábitos, controla su destino.",
    tasks:["Día 1","Día 2","Día 3","Día 4","Día 5","Día 6","Día 7"],
    xp:200, gold:70, stat:"disciplina", icon:"🚫", tint:"#9898b8", rotate:-1 },

  { id:"q19", type:"semanal",
    title:"Carrera de los cinco reinos",
    sub:"Corre 5km esta semana",
    desc:"Completa cinco kilómetros corriendo esta semana. Podés dividirlo en varias salidas.",
    tasks:["Primera salida","Segunda salida","5km completados"],
    xp:190, gold:65, stat:"agilidad", icon:"🏃", tint:"#a8c4b0", rotate:3 },

  { id:"q26", type:"semanal",
    title:"Siete días leyendo",
    sub:"El conocimiento es el escudo",
    desc:"Lee al menos 20 minutos cada día durante toda la semana. El guerrero sabio nunca pierde.",
    tasks:["Día 1","Día 2","Día 3","Día 4","Día 5","Día 6","Día 7"],
    xp:210, gold:70, stat:"sabiduria", icon:"📚", tint:"#e0d0a8", rotate:-2 },

  // ── ÉPICAS ────────────────────────────────────────────────
  { id:"q5",  type:"epica",
    title:"Maratón del Valle Olvidado",
    sub:"Hazaña legendaria",
    desc:"Correrás 10 leguas (10 km) sin detenerte. Sólo los más bravos cruzan el valle y regresan vivos.",
    tasks:["Calentamiento","5 km","10 km — gloria"],
    xp:600, gold:250, stat:"agilidad", icon:"🏹", tint:"#c89a6a", rotate:-4, sealed:true },

  { id:"q21", type:"epica",
    title:"El Guerrero de Hierro — 100 flexiones",
    sub:"La forja del cuerpo legendario",
    desc:"Cien flexiones en un solo día. Podés hacerlas en las series que necesites, pero hoy es el día.",
    tasks:["Primera ronda — 25","Segunda ronda — 25","Tercera ronda — 25","La ronda final — 25"],
    xp:500, gold:200, stat:"fuerza", icon:"🛡", tint:"#b09070", rotate:2, sealed:true },

  { id:"q27", type:"epica",
    title:"30 días sin ultraprocesados",
    sub:"La pureza del guerrero",
    desc:"Un mes entero sin comida ultraprocesada. Solo alimentos reales. Esta hazaña transforma el cuerpo.",
    tasks:["Semana 1","Semana 2","Semana 3","Semana 4 — ¡victoria!"],
    xp:800, gold:350, stat:"constitucion", icon:"⚗", tint:"#90b880", rotate:-2, sealed:true },

  // ── CADENA ────────────────────────────────────────────────
  { id:"q7",  type:"cadena",
    title:"Senda del Manuscrito — I",
    sub:"Lee 20 páginas del códice",
    desc:"Primer eslabón. Lee veinte páginas de un libro de tu elección, hoy mismo. El viaje de mil páginas empieza aquí.",
    tasks:["Abrir el códice","20 páginas"],
    xp:60, gold:15, stat:"sabiduria", icon:"📜", tint:"#e6d6b4", rotate:-1, chain:1 },

  { id:"q20", type:"cadena",
    title:"Senda del Manuscrito — II",
    sub:"Lee otras 20 páginas",
    desc:"Segundo eslabón. El conocimiento se acumula como las monedas del reino: de a poco, pero sin parar.",
    tasks:["Continuar el códice","20 páginas más","Marcar el avance"],
    xp:80, gold:20, stat:"sabiduria", icon:"📜", tint:"#dcd0a8", rotate:1, chain:2 },

  { id:"q28", type:"cadena",
    title:"Guerrero del Hierro — Semana I",
    sub:"Entrena 5 días seguidos",
    desc:"Primer anillo de la cadena del guerrero. Cinco días consecutivos de entrenamiento.",
    tasks:["Día 1","Día 2","Día 3","Día 4","Día 5"],
    xp:250, gold:90, stat:"fuerza", icon:"⚔", tint:"#c0a080", rotate:-2, chain:1 },

  // ── GREMIO ────────────────────────────────────────────────
  { id:"q6",  type:"gremio",
    title:"Convoca al gremio",
    sub:"Cena con tres compañeros",
    desc:"Reúne a tres aliados en banquete real. Comer en compañía nutre el carisma del caballero.",
    tasks:["Convocar a los aliados","Banquete real","Memorias compartidas"],
    xp:180, gold:60, stat:"carisma", icon:"🍷", tint:"#b09480", rotate:3 },

  { id:"q22", type:"gremio",
    title:"Desafío del Gremio",
    sub:"Compite con tus aliados esta semana",
    desc:"Esta semana, cada miembro del gremio registra sus misiones. El que más complete gana honor eterno.",
    tasks:["Anunciar el desafío","Completar más misiones que tus aliados","Celebrar al campeón"],
    xp:200, gold:70, stat:"carisma", icon:"⚜", tint:"#a08870", rotate:-1 },

  { id:"q29", type:"gremio",
    title:"Entrenamiento grupal",
    sub:"El gremio que entrena junto, vence junto",
    desc:"Organiza una sesión de entrenamiento con al menos un aliado del gremio. En persona o virtual.",
    tasks:["Coordinar con un aliado","Sesión de entrenamiento juntos","Registrar la hazaña"],
    xp:160, gold:55, stat:"fuerza", icon:"🤺", tint:"#b4907c", rotate:2 },
];

const HISTORY = [
  { date:"Ayer",        title:"Marcha de mil pasos",              xp:35,  stat:"agilidad" },
  { date:"Ayer",        title:"Diez minutos de meditación",       xp:30,  stat:"sabiduria" },
  { date:"Ayer",        title:"Beberás 3 litros del manantial",   xp:40,  stat:"constitucion" },
  { date:"Hace 2 días", title:"Ordena tus aposentos",             xp:25,  stat:"disciplina" },
  { date:"Hace 2 días", title:"Senda del Manuscrito — I",         xp:60,  stat:"sabiduria" },
  { date:"Hace 3 días", title:"El Guerrero de Hierro",            xp:90,  stat:"fuerza", epic:true },
  { date:"Hace 4 días", title:"Vianda noble — Día 3",             xp:30,  stat:"constitucion" },
  { date:"Hace 5 días", title:"Convoca al gremio",                xp:180, stat:"carisma", epic:true },
];

const ACHIEVEMENTS = [
  { id:"a1", name:"Primer Paso",      desc:"Completa tu primera misión",  got:true,  glyph:"✦" },
  { id:"a2", name:"Llama Eterna",     desc:"Racha de 7 días",             got:true,  glyph:"🔥" },
  { id:"a3", name:"Hidromante",       desc:"100 L de agua",               got:true,  glyph:"💧" },
  { id:"a4", name:"Senda de Hierro",  desc:"50 misiones de Fuerza",       got:true,  glyph:"⚔" },
  { id:"a5", name:"Dragón Domado",    desc:"Racha de 30 días",            got:false, glyph:"🐉" },
  { id:"a6", name:"Maestro Astuto",   desc:"Nivel 20",                    got:false, glyph:"♛" },
  { id:"a7", name:"Cofre del Reino",  desc:"5.000 monedas",               got:false, glyph:"⚜" },
  { id:"a8", name:"Heraldo",          desc:"10 misiones de gremio",       got:false, glyph:"⚘" },
];

const INVENTORY = [];

const RANK = [
  { name:"Lady Marina del Lago",  level:18, score:14820, you:false },
  { name:"Maese Ulrico",          level:15, score:11240, you:false },
  { name:"Sir Tomás de Valoria",  level:12, score: 9430, you:true  },
  { name:"Don Renato",            level:11, score: 8120, you:false },
  { name:"Hermana Inés",          level: 9, score: 6740, you:false },
];

const TYPE_META = {
  diaria:  { label:"Diaria",  color:"#8a6a2a", glyph:"☀" },
  semanal: { label:"Semanal", color:"#2c476f", glyph:"☾" },
  epica:   { label:"Épica",   color:"#7d1e1e", glyph:"♛" },
  gremio:  { label:"Gremio",  color:"#2f5a3a", glyph:"⚜" },
  cadena:  { label:"Cadena",  color:"#5a3a1a", glyph:"⛓" },
};

Object.assign(window, { HERO, QUESTS, HISTORY, ACHIEVEMENTS, INVENTORY, RANK, TYPE_META });
