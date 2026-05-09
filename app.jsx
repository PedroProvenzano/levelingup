// Main app shell — routing, auth, Firebase, level-up animation

const { useState, useEffect, useRef } = React;

// ── Lógica de achievements ────────────────────────────────────
function checkAchievements(hero, completedQuestIds, history, currentAchievements) {
  const updated = { ...currentAchievements };
  const totalCompleted = (hero.totalCompleted || 0);

  if (!updated.a1 && totalCompleted >= 1)              updated.a1 = true; // Primer Paso
  if (!updated.a2 && hero.streak >= 7)                 updated.a2 = true; // Llama Eterna
  if (!updated.a5 && hero.streak >= 30)                updated.a5 = true; // Dragón Domado
  if (!updated.a6 && hero.level >= 20)                 updated.a6 = true; // Maestro Astuto
  if (!updated.a7 && hero.gold >= 5000)                updated.a7 = true; // Cofre del Reino
  const guildCount = history.filter(h => h.stat === 'carisma').length;
  if (!updated.a8 && guildCount >= 10)                 updated.a8 = true; // Heraldo

  return updated;
}

function App() {
  // Tweaks
  const [tweaks, setTweak] = useTweaks(window.__TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.classList.toggle('night', tweaks.mode === 'night');
  }, [tweaks.mode]);

  // App state
  const [screen, setScreen]                   = useState('loading');
  const [tab, setTab]                         = useState('board');
  const [openQuest, setOpenQuest]             = useState(null);
  const [hero, setHero]                       = useState(null);
  const [user, setUser]                       = useState(null);
  const [completedQuestIds, setCompletedIds]  = useState([]);
  const [history, setHistory]                 = useState([]);
  const [achievements, setAchievements]       = useState({});
  const [reward, setReward]                   = useState(null);

  // ── Auth state listener ─────────────────────────────────────
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        try {
          let userData = await fbLoadUserData(fbUser.uid);
          if (!userData) {
            userData = await fbCreateUserData(fbUser.uid, fbUser.displayName, fbUser.photoURL);
          }

          // Guardar foto actualizada de Google si cambió
          if (fbUser.photoURL && userData.hero.photoURL !== fbUser.photoURL) {
            userData.hero.photoURL = fbUser.photoURL;
          }

          // Revisar si completedToday es de hoy, si no resetear
          const today = new Date().toISOString().split('T')[0];
          const completedIds = userData.completedToday?.date === today
            ? (userData.completedToday.questIds || [])
            : [];

          // Calcular racha diaria
          let heroData = { ...userData.hero };
          const lastDate = userData.completedToday?.date;
          if (lastDate && lastDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yStr = yesterday.toISOString().split('T')[0];
            if (lastDate === yStr && (userData.completedToday?.questIds || []).length > 0) {
              // Completó algo ayer → mantener racha
            } else if (lastDate !== today) {
              // No completó nada ayer → resetear racha
              heroData.streak = 0;
            }
          }

          setUser(fbUser);
          setHero(heroData);
          setHistory([...(userData.history || [])].reverse().slice(0, 50));
          setCompletedIds(completedIds);
          setAchievements(userData.achievements || {});
          setScreen('main');
        } catch (err) {
          console.error('Error cargando datos:', err);
          setScreen('login');
        }
      } else {
        setUser(null);
        setHero(null);
        setCompletedIds([]);
        setHistory([]);
        setScreen('login');
      }
    });
    return () => unsubscribe();
  }, []);

  // ── Navegación ──────────────────────────────────────────────
  const onOpenQuest = (q) => {
    setOpenQuest(q);
    setScreen('detail');
  };

  const onCloseDetail = () => setScreen('main');

  // ── Completar misión ────────────────────────────────────────
  const onCompleteQuest = async (q) => {
    const newXp = hero.xp + q.xp;
    let leveledUp = false;
    let updatedHero = {
      ...hero,
      gold: hero.gold + q.gold,
      totalCompleted: (hero.totalCompleted || 0) + 1,
    };

    // Subir stat relacionada (+1 punto)
    if (updatedHero.stats?.[q.stat]) {
      updatedHero.stats = {
        ...updatedHero.stats,
        [q.stat]: {
          ...updatedHero.stats[q.stat],
          value: updatedHero.stats[q.stat].value + 1,
        },
      };
    }

    if (newXp >= hero.xpNext) {
      leveledUp = true;
      updatedHero = {
        ...updatedHero,
        level:  hero.level + 1,
        xp:     newXp - hero.xpNext,
        xpNext: Math.round(hero.xpNext * 1.5),
      };
    } else {
      updatedHero.xp = newXp;
    }

    // Actualizar racha (si es la primera misión del día)
    const today = new Date().toISOString().split('T')[0];
    if (completedQuestIds.length === 0) {
      updatedHero.streak = (hero.streak || 0) + 1;
      if (updatedHero.streak > (hero.bestStreak || 0)) {
        updatedHero.bestStreak = updatedHero.streak;
      }
    }

    const newCompletedIds = [...completedQuestIds, q.id];

    // Revisar achievements
    const newHistory = [
      {
        date: new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'short' }),
        title: q.title, xp: q.xp, gold: q.gold, stat: q.stat,
        epic: q.type === 'epica',
        completedAt: new Date().toISOString(),
      },
      ...history,
    ].slice(0, 50);

    const updatedAchievements = checkAchievements(updatedHero, newCompletedIds, newHistory, achievements);
    const achievementsChanged  = JSON.stringify(updatedAchievements) !== JSON.stringify(achievements);

    // Actualizar estado local inmediatamente
    setHero(updatedHero);
    setCompletedIds(newCompletedIds);
    setHistory(newHistory);
    if (achievementsChanged) setAchievements(updatedAchievements);
    setReward({ quest: q, leveledUp });
    setScreen('main');

    // Persistir en Firestore
    if (user) {
      try {
        await fbCompleteQuest(
          user.uid, q, updatedHero, newCompletedIds,
          achievementsChanged ? updatedAchievements : null
        );
      } catch (err) {
        console.error('Error guardando misión:', err);
      }
    }

    setTimeout(() => setReward(null), leveledUp ? 3600 : 2400);
  };

  // ── Logout ──────────────────────────────────────────────────
  const onLogout = () => firebaseAuth.signOut();

  // ── Pantalla de carga ───────────────────────────────────────
  if (screen === 'loading') {
    return (
      <div className="wood grain" style={{
        position:'absolute', inset:0,
        display:'grid', placeItems:'center',
      }}>
        <div style={{ textAlign:'center' }}>
          <div style={{
            fontSize:64, color:'var(--gold)',
            fontFamily:'Cinzel',
            animation:'glow-pulse 1.4s ease-in-out infinite',
          }}>♛</div>
          <div className="t-carved" style={{
            color:'var(--gold-bright)', fontSize:10,
            letterSpacing:'0.4em', marginTop:16,
          }}>CARGANDO EL REINO…</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {screen === 'login' && <LoginScreen />}

      {screen === 'main' && hero && (
        <>
          {tab === 'board'     && (
            <BoardScreen
              hero={hero}
              onOpen={onOpenQuest}
              onAvatar={() => setTab('profile')}
              layout={tweaks.boardLayout}
              density={tweaks.density}
              completedQuestIds={completedQuestIds}
            />
          )}
          {tab === 'profile'   && (
            <ProfileScreen
              hero={hero}
              user={user}
              achievements={achievements}
              onLogout={onLogout}
              onAvatar={() => setTab('profile')}
            />
          )}
          {tab === 'inventory' && <InventoryScreen />}
          {tab === 'history'   && <HistoryScreen history={history} hero={hero} />}
          {tab === 'rank'      && <RankScreen />}
          <TabBar tab={tab} onTab={setTab} />
        </>
      )}

      {screen === 'detail' && openQuest && (
        <DetailScreen
          q={openQuest}
          hero={hero}
          onClose={onCloseDetail}
          onComplete={onCompleteQuest}
          alreadyCompleted={completedQuestIds.includes(openQuest?.id)}
        />
      )}

      {reward && <RewardOverlay reward={reward} onDismiss={() => setReward(null)} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Ambiente">
          <TweakRadio
            label="Modo"
            value={tweaks.mode}
            options={[
              { value:'day',   label:'Día' },
              { value:'night', label:'Noche' },
            ]}
            onChange={v => setTweak('mode', v)} />
        </TweakSection>
        <TweakSection label="Tablón de misiones">
          <TweakRadio
            label="Disposición"
            value={tweaks.boardLayout}
            options={[
              { value:'rows',      label:'Clavadas' },
              { value:'scattered', label:'Dispersas' },
            ]}
            onChange={v => setTweak('boardLayout', v)} />
          <TweakRadio
            label="Densidad"
            value={tweaks.density}
            options={[
              { value:'sparse', label:'Pocas' },
              { value:'normal', label:'Normal' },
              { value:'dense',  label:'Muchas' },
            ]}
            onChange={v => setTweak('density', v)} />
        </TweakSection>
        <TweakSection label="Acceso rápido">
          <TweakButton onClick={() => { firebaseAuth.signOut(); }}>Cerrar sesión</TweakButton>
          <TweakButton onClick={() => { setScreen('main'); setTab('board'); }}>Tablón</TweakButton>
          <TweakButton onClick={() => { setScreen('main'); setTab('profile'); }}>Heraldo</TweakButton>
          <TweakButton onClick={() => { setScreen('main'); setTab('inventory'); }}>Cofre</TweakButton>
          <TweakButton onClick={() => { setScreen('main'); setTab('history'); }}>Crónica</TweakButton>
          <TweakButton onClick={() => { setScreen('main'); setTab('rank'); }}>Gremio</TweakButton>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// ── Reward overlay ────────────────────────────────────────────
function RewardOverlay({ reward }) {
  return (
    <div style={{
      position:'absolute', inset:0,
      display:'grid', placeItems:'center',
      background:'radial-gradient(ellipse at center, rgba(0,0,0,0.55), rgba(0,0,0,0.85))',
      zIndex:200,
      animation:'float-in 280ms ease-out',
    }}>
      <div style={{ textAlign:'center', padding:'30px 24px' }}>
        {reward.leveledUp ? (
          <>
            <div style={{
              width:140, height:140, margin:'0 auto',
              borderRadius:'50%',
              background:'radial-gradient(circle at 30% 25%, var(--gold-shine), var(--gold-bright) 35%, var(--gold) 60%, var(--gold-deep))',
              boxShadow:'0 0 60px rgba(232,201,113,0.7), inset 0 0 0 3px var(--wood-deep), inset 0 0 0 5px var(--gold-deep)',
              display:'grid', placeItems:'center',
              fontFamily:'Cinzel', fontWeight:700, fontSize:54, color:'var(--wood-deep)',
              animation:'glow-pulse 1.6s infinite',
            }}>♛</div>
            <div className="t-carved" style={{ fontSize:12, letterSpacing:'0.4em', color:'var(--gold-bright)', marginTop:18 }}>
              ¡Has ascendido!
            </div>
            <h1 className="t-display" style={{ fontSize:42, color:'var(--parch-light)', margin:'4px 0 6px', textShadow:'0 0 20px rgba(232,201,113,0.5)' }}>
              Nivel alcanzado
            </h1>
            <div className="t-script" style={{ fontStyle:'italic', color:'var(--parch-stain)', fontSize:14 }}>
              «¡Por la corona! Tu leyenda crece.»
            </div>
          </>
        ) : (
          <>
            <div style={{
              width:120, height:120, margin:'0 auto',
              borderRadius:'50%',
              background:'radial-gradient(circle at 35% 30%, #e8534a 0%, var(--wax-bright) 25%, var(--wax) 65%, var(--wax-deep))',
              boxShadow:'0 0 40px rgba(178,40,40,0.6), inset -6px -6px 12px rgba(0,0,0,0.5), inset 4px 4px 8px rgba(255,180,180,0.3)',
              display:'grid', placeItems:'center',
              fontFamily:'Cinzel', fontWeight:700, fontSize:32, color:'rgba(0,0,0,0.5)',
              animation:'stamp 700ms cubic-bezier(0.4, 1.5, 0.4, 1)',
              textAlign:'center', lineHeight:1,
            }}>♛</div>
            <div className="t-carved" style={{ fontSize:11, letterSpacing:'0.32em', color:'var(--gold-bright)', marginTop:18 }}>
              Hazaña sellada
            </div>
            <h1 className="t-display" style={{ fontSize:32, color:'var(--parch-light)', margin:'4px 12px 6px', lineHeight:1 }}>
              {reward.quest.title}
            </h1>
            <div className="row" style={{ justifyContent:'center', gap:14, marginTop:10, fontFamily:'Cinzel', color:'var(--gold-bright)' }}>
              <span>+{reward.quest.xp} XP</span>
              <span style={{ opacity:0.6 }}>·</span>
              <span className="row" style={{ gap:4 }}><Coin/>+{reward.quest.gold}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.App = App;

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
