// ╔══════════════════════════════════════════════════════════════╗
// ║  CONFIGURACIÓN FIREBASE — EL REINO                          ║
// ║                                                              ║
// ║  Pasos para configurar:                                      ║
// ║  1. Ir a https://console.firebase.google.com                 ║
// ║  2. Crear proyecto → Agregar app web                         ║
// ║  3. Copiar el firebaseConfig y reemplazar los valores abajo  ║
// ║  4. Habilitar Authentication → Proveedores → Google          ║
// ║  5. Habilitar Firestore Database (modo producción)           ║
// ║  6. En Firestore Rules, usar estas reglas:                   ║
// ║                                                              ║
// ║  rules_version = '2';                                        ║
// ║  service cloud.firestore {                                   ║
// ║    match /databases/{database}/documents {                   ║
// ║      match /users/{userId} {                                 ║
// ║        allow read, write: if request.auth != null            ║
// ║          && request.auth.uid == userId;                      ║
// ║      }                                                       ║
// ║      match /guilds/{guildId} {                               ║
// ║        allow read, write: if request.auth != null;           ║
// ║      }                                                       ║
// ║    }                                                         ║
// ║  }                                                           ║
// ╚══════════════════════════════════════════════════════════════╝

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBlgqkGTPi4GLdFzYOU5HYoAxu0wALHqdA",
  authDomain:        "leveling-up-ca4c1.firebaseapp.com",
  projectId:         "leveling-up-ca4c1",
  storageBucket:     "leveling-up-ca4c1.firebasestorage.app",
  messagingSenderId: "486799264510",
  appId:             "1:486799264510:web:74dcf93d3e77cfd343f3af"
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

// ── Helpers usuarios ──────────────────────────────────────────

async function fbLoadUserData(uid) {
  const snap = await _db.collection('users').doc(uid).get();
  return snap.exists ? snap.data() : null;
}

async function fbCreateUserData(uid, displayName, photoURL) {
  const today = new Date().toISOString().split('T')[0];
  const data = {
    hero: makeInitialHero(displayName, photoURL),
    history: [],
    inventory: [],
    guildId: null,
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

// ── Helpers gremios ───────────────────────────────────────────

function _generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin chars confusos
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function _heroSummary(hero) {
  return {
    name:           hero.name     || 'Cazador',
    level:          hero.level    || 1,
    photoURL:       hero.photoURL || null,
    totalCompleted: hero.totalCompleted || 0,
    streak:         hero.streak   || 0,
  };
}

async function fbCreateGuild(uid, guildName, hero) {
  const inviteCode = _generateInviteCode();
  const guildRef   = _db.collection('guilds').doc();
  const guild = {
    name:        guildName,
    inviteCode,
    createdBy:   uid,
    createdAt:   new Date().toISOString(),
    memberIds:   [uid],
    members:     { [uid]: _heroSummary(hero) },
  };
  await guildRef.set(guild);
  await _db.collection('users').doc(uid).update({ guildId: guildRef.id });
  return { id: guildRef.id, ...guild };
}

async function fbJoinGuild(uid, inviteCode, hero) {
  const snap = await _db.collection('guilds')
    .where('inviteCode', '==', inviteCode.toUpperCase().trim())
    .limit(1)
    .get();
  if (snap.empty) throw new Error('Código inválido o gremio no encontrado.');
  const doc     = snap.docs[0];
  const guildId = doc.id;
  const existing = doc.data();
  if (existing.memberIds && existing.memberIds.includes(uid)) {
    // Ya es miembro, solo retornar
    return { id: guildId, ...existing };
  }
  await doc.ref.update({
    memberIds:          firebase.firestore.FieldValue.arrayUnion(uid),
    [`members.${uid}`]: _heroSummary(hero),
  });
  await _db.collection('users').doc(uid).update({ guildId });
  return { id: guildId, ...existing, memberIds: [...(existing.memberIds || []), uid] };
}

async function fbLoadGuild(guildId) {
  const snap = await _db.collection('guilds').doc(guildId).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

async function fbUpdateGuildMember(guildId, uid, hero) {
  await _db.collection('guilds').doc(guildId).update({
    [`members.${uid}`]: _heroSummary(hero),
  });
}

async function fbLeaveGuild(uid, guildId) {
  await _db.collection('guilds').doc(guildId).update({
    memberIds:          firebase.firestore.FieldValue.arrayRemove(uid),
    [`members.${uid}`]: firebase.firestore.FieldValue.delete(),
  });
  await _db.collection('users').doc(uid).update({ guildId: null });
}

// ── Exponer al scope global ───────────────────────────────────

window.firebaseAuth          = _auth;
window.googleProvider        = _gProvider;
window.fbLoadUserData        = fbLoadUserData;
window.fbCreateUserData      = fbCreateUserData;
window.fbCompleteQuest       = fbCompleteQuest;
window.fbUpdateStreak        = fbUpdateStreak;
window.fbCreateGuild         = fbCreateGuild;
window.fbJoinGuild           = fbJoinGuild;
window.fbLoadGuild           = fbLoadGuild;
window.fbUpdateGuildMember   = fbUpdateGuildMember;
window.fbLeaveGuild          = fbLeaveGuild;
