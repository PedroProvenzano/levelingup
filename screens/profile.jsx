// Profile / Heraldo screen — con foto de Google y logout
function ProfileScreen({ hero, user, achievements: achProp, onLogout, onAvatar }) {
  // Usar achievements del prop si existen, si no los globales como fallback
  const achievementsData = achProp || {};
  const achievementsList = ACHIEVEMENTS.map(a => ({
    ...a,
    got: achievementsData[a.id] !== undefined ? achievementsData[a.id] : a.got,
  }));

  return (
    <div className="wood grain" style={{ position:'absolute', inset:0 }}>
      <ScreenHeader title="Heraldo" subtitle="· Cédula del Caballero ·" />

      <div className="scroll-area" style={{ position:'absolute', top:90, bottom:76, left:0, right:0, padding:'12px 16px 24px' }}>
        {/* Portrait — foto de Google o avatar SVG */}
        <div style={{ display:'flex', justifyContent:'center', marginTop:8 }}>
          <div className="gilded" style={{ width:140, animation:'float-in 420ms ease-out' }}>
            {hero.photoURL ? (
              <div style={{
                aspectRatio:'1/1',
                borderRadius:1,
                overflow:'hidden',
                position:'relative',
              }}>
                <img
                  src={hero.photoURL}
                  alt={hero.name}
                  style={{ display:'block', width:'100%', height:'100%', objectFit:'cover' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            ) : (
              <div style={{
                aspectRatio: '4 / 5',
                background:'radial-gradient(ellipse at 50% 35%, #5a4838 0%, #2a1c12 70%, #14080a 100%)',
                position:'relative', overflow:'hidden', borderRadius:1,
              }}>
                <svg viewBox="0 0 100 125" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
                  <defs>
                    <radialGradient id="port" cx="50%" cy="35%" r="60%">
                      <stop offset="0%" stopColor="#8a6a48"/>
                      <stop offset="100%" stopColor="#1a0e08"/>
                    </radialGradient>
                  </defs>
                  <rect width="100" height="125" fill="url(#port)"/>
                  <ellipse cx="50" cy="55" rx="20" ry="24" fill="#1a0e08"/>
                  <ellipse cx="50" cy="50" rx="16" ry="18" fill="#3a2418"/>
                  <rect x="40" y="48" width="20" height="3" fill="#0a0503"/>
                  <path d="M 18 100 Q 50 78 82 100 L 82 125 L 18 125 Z" fill="#1f130a"/>
                  <path d="M 30 100 Q 50 92 70 100 L 70 110 L 30 110 Z" fill="#3a2418"/>
                  <path d="M 50 27 L 46 36 L 50 33 L 54 36 Z" fill="#c9a961"/>
                  <circle cx="50" cy="98" r="4" fill="#7d1e1e"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:14 }}>
          <h2 className="t-display" style={{ color:'var(--parch-light)', fontSize:26, margin:0, lineHeight:1 }}>
            {hero.name}
          </h2>
          <div className="t-carved" style={{ color:'var(--gold)', fontSize:10, letterSpacing:'0.3em', marginTop:4 }}>{hero.title}</div>
          {user?.email && (
            <div style={{ fontFamily:'Cinzel', fontSize:10, color:'rgba(232,201,113,0.5)', marginTop:4, letterSpacing:'0.08em' }}>
              {user.email}
            </div>
          )}

          <div className="row" style={{ justifyContent:'center', gap:14, marginTop:10 }}>
            <span style={{ color:'var(--parch-stain)', fontFamily:'Cinzel', fontSize:13 }}>
              <span style={{ color:'var(--gold-bright)' }}>Nivel</span> {hero.level}
            </span>
            <span style={{ color:'var(--parch-stain)', fontFamily:'Cinzel', fontSize:13 }}>
              · #{hero.rank} en el reino
            </span>
          </div>
        </div>

        {/* XP bar */}
        <div style={{ marginTop:16 }}>
          <div className="xp-track" style={{ height:14 }}>
            <div className="xp-fill" style={{ '--w': (hero.xp / hero.xpNext * 100) + '%' }}/>
          </div>
          <div className="row" style={{ justifyContent:'space-between', marginTop:4, fontFamily:'Cinzel', fontSize:10, color:'var(--parch-stain)', letterSpacing:'0.15em' }}>
            <span>{hero.xp} XP</span>
            <span>{hero.xpNext} XP</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="t-carved" style={{ color:'var(--gold)', fontSize:10, letterSpacing:'0.28em', marginTop:22, textAlign:'center' }}>
          · Atributos ·
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:10 }}>
          {Object.entries(hero.stats).map(([k, s]) => (
            <StatBadge key={k} stat={s.label} value={s.value} glyph={s.glyph} />
          ))}
        </div>

        {/* Coffer summary */}
        <div className="t-carved" style={{ color:'var(--gold)', fontSize:10, letterSpacing:'0.28em', marginTop:22, textAlign:'center' }}>
          · Erario ·
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:10 }}>
          <SmallStat icon={<Coin/>} label="Oro" value={hero.gold} />
          <SmallStat icon={<Flame/>} label="Racha" value={(hero.streak || 0) + ' d'} />
          <SmallStat icon="✦" label="Hazañas" value={hero.totalCompleted || 0} />
        </div>

        {/* Achievements */}
        <div className="row" style={{ justifyContent:'space-between', alignItems:'center', marginTop:22 }}>
          <div className="t-carved" style={{ color:'var(--gold)', fontSize:10, letterSpacing:'0.28em' }}>· Galardones ·</div>
          <span style={{ fontFamily:'Cinzel', fontSize:10, color:'var(--parch-stain)' }}>
            {achievementsList.filter(a=>a.got).length}/{achievementsList.length}
          </span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8, marginTop:8 }}>
          {achievementsList.map(a => (
            <div key={a.id} title={a.desc + (a.got ? '' : ' (bloqueado)')} style={{
              aspectRatio:'1',
              borderRadius:'50%',
              background: a.got
                ? 'radial-gradient(circle at 30% 25%, var(--gold-shine), var(--gold-bright) 35%, var(--gold-deep) 100%)'
                : 'radial-gradient(circle at 30% 25%, #4a4238 0%, #1a1612 100%)',
              display:'grid', placeItems:'center',
              color: a.got ? '#1a0e04' : 'rgba(232,201,113,0.3)',
              fontSize:18,
              boxShadow: a.got
                ? 'inset 0 0 0 2px var(--wood-deep), inset 0 0 0 3px var(--gold-deep), 0 3px 6px rgba(0,0,0,0.6)'
                : 'inset 0 0 0 2px var(--wood-deep), inset 0 0 0 3px #2a2520, 0 2px 4px rgba(0,0,0,0.5)',
              opacity: a.got ? 1 : 0.6,
            }}>{a.glyph}</div>
          ))}
        </div>

        {/* Logout */}
        <div style={{ marginTop:28 }}>
          <button
            onClick={onLogout}
            style={{
              width:'100%', padding:'12px',
              background:'rgba(125,30,30,0.35)',
              border:'1px solid rgba(178,40,40,0.4)',
              borderRadius:3, cursor:'pointer',
              fontFamily:'Cinzel', fontSize:11,
              color:'var(--parch-stain)', letterSpacing:'0.2em',
              boxShadow:'0 3px 8px rgba(0,0,0,0.4)',
              transition:'background 200ms',
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(125,30,30,0.55)'}
            onMouseLeave={e => e.target.style.background = 'rgba(125,30,30,0.35)'}
          >
            Abandonar el reino
          </button>
        </div>
      </div>
    </div>
  );
}

function SmallStat({ icon, label, value }) {
  return (
    <div className="col" style={{
      alignItems:'center', gap:4, padding:'10px 4px',
      background:'rgba(0,0,0,0.25)',
      border:'1px solid rgba(232,201,113,0.25)',
      borderRadius:3,
    }}>
      <span style={{ color:'var(--gold-bright)', fontSize:16 }}>{icon}</span>
      <span style={{ fontFamily:'Cinzel', fontWeight:700, fontSize:15, color:'var(--parch-light)' }}>{value}</span>
      <span style={{ fontFamily:'Cinzel', fontSize:8, letterSpacing:'0.18em', color:'var(--parch-stain)', textTransform:'uppercase' }}>{label}</span>
    </div>
  );
}

window.ProfileScreen = ProfileScreen;
