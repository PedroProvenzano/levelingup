// ╔══════════════════════════════════════════════════════════════╗
// ║  CONFIGURACIÓN FIREBASE — EL REINO                          ║
// ║                                                              ║
// ║  Pasos para configurar:                                      ║
// ║  1. Ir a https://console.firebase.google.com                 ║
// ║  2. Crear proyecto → Agregar app web                         ║
// ║  3. Copiar el firebaseConfig y reemplazar los valores abajo  ║
// ║  4. Habilitar Authentication → Proveedores → Google          ║
// ║  5. Habilitar Firestore Database (modo test para empezar)    ║
// ║  6. En Firestore Rules, usar modo test (permite todo):       ║
// ║     allow read, write: if request.time < timestamp.date(...) ║
// ╚══════════════════════════════════════════════════════════════╝

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBlgqkGTPi4GLdFzYOU5HYoAxu0wALHqdA",
  authDomain: "leveling-up-ca4c1.firebaseapp.com",
  projectId: "leveling-up-ca4c1",
  storageBucket: "leveling-up-ca4c1.firebasestorage.app",
  messagingSenderId: "486799264510",
  appId: "1:486799264510:web:74dcf93d3e77cfd343f3af"
};

// Inicializar Firebase
firebase.initializeApp(FIREBASE_CONFIG);

const _auth      = firebase.auth();
const _db        = firebase.firestore();
const _gProvider = new firebase.auth.GoogleAuthProvider();

// ── Datos iniciales para usuario nuevo ───────────────────────

function makeInitialHero(displayName, photoURL) {
  return {
    name:     displayName || "Valiente Cazador",
    title:    "Aprendiz del Hábito",
    photoURL: photoURL || null,
    level:    1,
    xp:       0,
    xpNext:   200,
    gold:     0,
    streak:   0,
    bestStreak: 0,
    rank:     999,
    totalCompleted: 0,
    stats: {
      fuerza:       { value: 5, label: "Fuerza",       glyph: "⚔" },
      sabiduria:    { value: 5, label: "Sabiduría",    glyph: "✦" },
      constitucion: { value: 5, label: "Constitución", glyph: "♥" },
      disciplina:   { value: 5, label: "Disciplina",   glyph: "❖" },
      carisma:      { value: 5, label: "Carisma",      glyph: "✿" },
      fortuna:      { value: 5, label: "Fortuna",      glyph: "✪" },
    }
  };
}

// ── Helpers Firestore ─────────────────────────────────────────

async function fbLoadUserData(uid) {
  const snap = await _db.collection('users').doc(uid).get();
  return snap.exists ? snap.data() : null;
}

async function fbCreateUserData(uid, displayName, photoURL) {
  const today = new Date().toISOString().split('T')[0];
  const data = {
    hero: makeInitialHero(displayName, photoURL),
    history: [],
    completedToday: { date: today, questIds: [] },
    achievements: {
      a1: false, a2: false, a3: false, a4: false,
      a5: false, a6: false, a7: false, a8: false
    },
    createdAt: new Date().toISOString(),
  };
  await _db.collection('users').doc(uid).set(data);
  return data;
}

async function fbCompleteQuest(uid, quest, updatedHero, completedTodayIds, updatedAchievements) {
  const today = new Date().toISOString().split('T')[0];
  const historyEntry = {
    date: new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'short' }),
    title: quest.title,
    xp: quest.xp,
    gold: quest.gold,
    stat: quest.stat,
    epic: quest.type === 'epica',
    completedAt: new Date().toISOString(),
  };
  const updateData = {
    hero: updatedHero,
    history: firebase.firestore.FieldValue.arrayUnion(historyEntry),
    completedToday: { date: today, questIds: completedTodayIds },
  };
  if (updatedAchievements) {
    updateData.achievements = updatedAchievements;
  }
  await _db.collection('users').doc(uid).update(updateData);
}

async function fbUpdateStreak(uid, hero) {
  await _db.collection('users').doc(uid).update({ hero });
}

// ── Exponer al scope global ───────────────────────────────────

window.firebaseAuth     = _auth;
window.googleProvider   = _gProvider;
window.fbLoadUserData   = fbLoadUserData;
window.fbCreateUserData = fbCreateUserData;
window.fbCompleteQuest  = fbCompleteQuest;
window.fbUpdateStreak   = fbUpdateStreak;
