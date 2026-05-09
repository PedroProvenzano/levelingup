// History / Crónica del caballero — datos reales desde Firestore
function HistoryScreen({ history = [], hero }) {
  const streak     = hero?.streak     || 0;
  const bestStreak = hero?.bestStreak || streak;

  return (
    <div className="wood grain" style={{ position:'absolute', inset:0 }}>
      <ScreenHeader title="Crónica" subtitle="· Diario del caballero ·" />

      <div className="scroll-area" style={{ position:'absolute', top:90, bottom:76, left:0, right:0, padding:'14px 16px 24px' }}>

        {/* Streak banner */}
        <div style={{
          padding:'14px 16px',
          background:'linear-gradient(180deg, #2c1d0e, #1a1208)',
          border:'1px solid var(--gold-deep)', borderRadius:3,
          display:'flex', alignItems:'center', gap:14,
        }}>
          <div style={{ width:46, height:46, display:'grid', placeItems:'center', filter:'drop-shadow(0 0 12px rgba(249,162,58,0.5))' }}>
            <div style={{ transform:'scale(2)' }}><Flame/></div>
          </div>
          <div style={{ flex:1 }}>
            <div className="t-carved" style={{ fontSize:10, color:'var(--parch-stain)', letterSpacing:'0.22em' }}>Llama del cazador</div>
            <div style={{ fontFamily:'Cinzel', fontWeight:700, fontSize:22, color:'var(--gold-bright)' }}>
              {streak} {streak === 1 ? 'día seguido' : 'días seguidos'}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'Cinzel', fontSize:10, color:'var(--parch-stain)', letterSpacing:'0.18em' }}>Récord</div>
            <div style={{ fontFamily:'Cinzel', fontWeight:700, fontSize:18, color:'var(--parch-light)' }}>{bestStreak} d</div>
          </div>
        </div>

        {/* Mini calendar */}
        <div className="t-carved" style={{ color:'var(--gold)', fontSize:10, letterSpacing:'0.28em', marginTop:18, marginBottom:8 }}>
          · Últimos 21 soles ·
        </div>
        <MiniCalendar history={history} />

        {/* Timeline */}
        <div className="t-carved" style={{ color:'var(--gold)', fontSize:10, letterSpacing:'0.28em', marginTop:22, marginBottom:8 }}>
          · Hazañas recientes ·
        </div>

        {history.length === 0 ? (
          <div className="parch torn-a" style={{ padding:'24px 20px', textAlign:'center', transform:'rotate(-0.5deg)' }}>
            <div style={{ fontSize:24, color:'var(--ink-faded)', marginBottom:8 }}>📜</div>
            <div className="t-script" style={{ fontStyle:'italic', fontSize:14, color:'var(--ink-soft)' }}>
              «Las páginas de la crónica aguardan tus primeras hazañas.»
            </div>
          </div>
        ) : (
          <div className="col" style={{ gap:10 }}>
            {history.map((h, i) => (
              <div key={h.completedAt || i} style={{
                position:'relative', padding:'12px 14px',
                background:'linear-gradient(180deg, var(--parch-light), var(--parch-stain))',
                borderRadius:2, boxShadow:'0 3px 8px rgba(0,0,0,0.5)',
                border:'1px solid var(--parch-edge)',
                transform:'rotate(' + (i % 2 ? 0.4 : -0.5) + 'deg)',
              }}>
                <div className="row" style={{ justifyContent:'space-between', alignItems:'baseline' }}>
                  <div className="t-carved" style={{ fontSize:9, letterSpacing:'0.22em', color:'var(--ink-faded)', textTransform:'capitalize' }}>
                    {h.date}
                  </div>
                  {h.epic && <span style={{ fontFamily:'Cinzel', fontSize:9, letterSpacing:'0.2em', color:'var(--wax)' }}>♛ ÉPICA</span>}
                </div>
                <div className="t-display" style={{ fontSize:17, lineHeight:1.05, color:'var(--ink)', marginTop:3 }}>
                  {h.title}
                </div>
                <div className="row" style={{ marginTop:6, gap:10, fontFamily:'Cinzel', fontSize:11, color:'var(--ink-soft)' }}>
                  <span>+{h.xp} XP</span>
                  <span>·</span>
                  <span className="row" style={{ gap:3 }}><Coin/> +{h.gold || 0}</span>
                  <span>·</span>
                  <span style={{ textTransform:'capitalize' }}>{h.stat}</span>
                </div>
                <div style={{
                  position:'absolute', top:8, right:10,
                  color:'var(--wax)', opacity:0.5,
                  fontFamily:'Cinzel', fontSize:10, letterSpacing:'0.2em',
                  transform:'rotate(-12deg)', textAlign:'center', lineHeight:1,
                }}>
                  <div>SELLADA</div>
                  <div style={{ fontSize:8, opacity:0.7 }}>· {h.epic ? 'gloria' : 'cumplida'} ·</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Mini calendario basado en historial real
function MiniCalendar({ history }) {
  const datesWithActivity = new Set(
    history.map(h => h.completedAt ? h.completedAt.split('T')[0] : null).filter(Boolean)
  );
  const today = new Date();
  const cells = Array.from({ length: 21 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (20 - i));
    const iso = d.toISOString().split('T')[0];
    return { iso, day: d.getDate(), isToday: i === 20, filled: datesWithActivity.has(iso) };
  });
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:5 }}>
      {cells.map(({ iso, day, isToday, filled }) => (
        <div key={iso} title={iso} style={{
          aspectRatio:'1', borderRadius:2,
          background: filled
            ? 'radial-gradient(circle at 30% 25%, var(--gold-shine), var(--gold-bright) 40%, var(--gold-deep))'
            : 'rgba(0,0,0,0.4)',
          border: isToday ? '2px solid #fff5d8' : '1px solid rgba(232,201,113,0.25)',
          display:'grid', placeItems:'center',
          fontFamily:'Cinzel', fontSize:9,
          color: filled ? '#1a0e04' : 'rgba(232,201,113,0.4)',
        }}>
          {filled ? '✓' : day}
        </div>
      ))}
    </div>
  );
}

// ── GuildScreen — sistema de gremios ──────────────────────────
function GuildScreen({ user, hero, guild, guildId, onGuildUpdate }) {
  const [view, setView]           = React.useState('home'); // home | create | join
  const [guildName, setGuildName] = React.useState('');
  const [codeInput, setCodeInput] = React.useState('');
  const [loading, setLoading]     = React.useState(false);
  const [error, setError]         = React.useState(null);
  const [copied, setCopied]       = React.useState(false);

  // ── Handlers ──
  const handleCreate = async () => {
    if (!guildName.trim()) return;
    setLoading(true); setError(null);
    try {
      const newGuild = await fbCreateGuild(user.uid, guildName.trim(), hero);
      onGuildUpdate(newGuild, newGuild.id);
      setView('home');
    } catch (err) { setError('No se pudo crear el gremio. Intentá de nuevo.'); }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!codeInput.trim()) return;
    setLoading(true); setError(null);
    try {
      const joined = await fbJoinGuild(user.uid, codeInput.trim(), hero);
      onGuildUpdate(joined, joined.id);
      setView('home');
    } catch (err) { setError(err.message || 'Código inválido.'); }
    setLoading(false);
  };

  const handleLeave = async () => {
    if (!guild) return;
    setLoading(true);
    try {
      await fbLeaveGuild(user.uid, guildId);
      onGuildUpdate(null, null);
    } catch (err) { setError('No se pudo abandonar el gremio.'); }
    setLoading(false);
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(guild.inviteCode); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Si ya está en un gremio ──
  if (guild) {
    const members = Object.entries(guild.members || {})
      .map(([uid, m]) => ({ uid, ...m }))
      .sort((a, b) => (b.level || 1) - (a.level || 1));

    return (
      <div className="wood grain" style={{ position:'absolute', inset:0 }}>
        <ScreenHeader title={guild.name} subtitle="· Gremio ·" />

        <div className="scroll-area" style={{ position:'absolute', top:90, bottom:76, left:0, right:0, padding:'14px 16px 24px' }}>

          {/* Código de invitación */}
          <div style={{
            padding:'14px 16px', borderRadius:3,
            background:'linear-gradient(180deg, #2c1d0e, #1a1208)',
            border:'1px solid var(--gold-deep)',
          }}>
            <div className="t-carved" style={{ fontSize:9, color:'var(--parch-stain)', letterSpacing:'0.22em', marginBottom:8 }}>
              · Código de invitación ·
            </div>
            <div className="row" style={{ gap:10, alignItems:'center' }}>
              <div style={{
                flex:1, padding:'10px 14px', borderRadius:2,
                background:'rgba(0,0,0,0.4)', border:'1px solid rgba(232,201,113,0.3)',
                fontFamily:'Cinzel', fontWeight:700, fontSize:22,
                color:'var(--gold-bright)', letterSpacing:'0.3em', textAlign:'center',
              }}>{guild.inviteCode}</div>
              <button onClick={handleCopy} style={{
                padding:'10px 14px', borderRadius:2,
                background: copied ? 'rgba(47,90,58,0.6)' : 'rgba(232,201,113,0.15)',
                border:'1px solid ' + (copied ? 'rgba(47,90,58,0.8)' : 'rgba(232,201,113,0.4)'),
                cursor:'pointer',
                fontFamily:'Cinzel', fontSize:10, letterSpacing:'0.14em',
                color: copied ? 'var(--emerald)' : 'var(--gold-bright)',
                transition:'all 200ms',
              }}>
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
            <div style={{ fontFamily:'Cinzel', fontSize:9, color:'rgba(232,201,113,0.5)', marginTop:8, textAlign:'center' }}>
              Compartí este código para que otros se unan
            </div>
          </div>

          {/* Miembros */}
          <div className="t-carved" style={{ color:'var(--gold)', fontSize:10, letterSpacing:'0.28em', marginTop:20, marginBottom:10 }}>
            · Miembros del gremio · {members.length}
          </div>

          <div className="col" style={{ gap:8 }}>
            {members.map((m, i) => {
              const isMe = m.uid === user?.uid;
              const isLeader = guild.createdBy === m.uid;
              return (
                <div key={m.uid} style={{
                  display:'grid', gridTemplateColumns:'40px 1fr auto', gap:10, alignItems:'center',
                  padding:'10px 12px', borderRadius:3,
                  background: isMe ? 'rgba(125,30,30,0.18)' : 'rgba(0,0,0,0.25)',
                  border:'1px solid ' + (isMe ? 'rgba(178,40,40,0.4)' : 'rgba(232,201,113,0.2)'),
                }}>
                  {/* Avatar */}
                  <div style={{
                    width:36, height:36, borderRadius:'50%',
                    background: m.photoURL ? 'transparent' : 'radial-gradient(circle at 30% 25%, #e0c992, #5a3f15)',
                    overflow:'hidden', flexShrink:0,
                    border:'2px solid ' + (i === 0 ? 'var(--gold)' : 'rgba(232,201,113,0.3)'),
                    display:'grid', placeItems:'center',
                    fontFamily:'Cinzel', fontSize:14, color:'#1a0e04', fontWeight:700,
                  }}>
                    {m.photoURL
                      ? <img src={m.photoURL} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : (m.name || '?')[0].toUpperCase()
                    }
                  </div>
                  {/* Info */}
                  <div>
                    <div className="row" style={{ gap:6, alignItems:'center' }}>
                      <div className="t-display" style={{ fontSize:15, color:'var(--parch-light)', lineHeight:1 }}>
                        {m.name || 'Cazador'}
                      </div>
                      {isLeader && <span style={{ fontFamily:'Cinzel', fontSize:8, color:'var(--gold)', letterSpacing:'0.15em' }}>♛ LÍDER</span>}
                      {isMe    && <span style={{ fontFamily:'Cinzel', fontSize:8, color:'var(--wax-bright)', letterSpacing:'0.12em' }}>· tú</span>}
                    </div>
                    <div style={{ fontFamily:'Cinzel', fontSize:10, color:'var(--parch-stain)', marginTop:2 }}>
                      Nv. {m.level || 1} · {m.totalCompleted || 0} hazañas · {m.streak || 0}🔥
                    </div>
                  </div>
                  {/* Posición */}
                  <div className="t-display" style={{
                    fontSize:20, color: i < 3 ? 'var(--gold-bright)' : 'var(--ink-faded)',
                    textAlign:'right', lineHeight:1,
                  }}>#{i+1}</div>
                </div>
              );
            })}
          </div>

          {/* Abandonar */}
          {error && (
            <div style={{ marginTop:14, padding:'8px 12px', background:'rgba(125,30,30,0.5)', border:'1px solid var(--wax-deep)', borderRadius:3, fontFamily:'Cinzel', fontSize:10, color:'var(--parch-stain)', textAlign:'center' }}>
              {error}
            </div>
          )}
          <button onClick={handleLeave} disabled={loading} style={{
            marginTop:20, width:'100%', padding:'11px',
            background:'rgba(125,30,30,0.25)', border:'1px solid rgba(178,40,40,0.35)',
            borderRadius:3, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily:'Cinzel', fontSize:10, letterSpacing:'0.18em', color:'var(--parch-stain)',
            opacity: loading ? 0.6 : 1,
          }}>
            Abandonar el gremio
          </button>
        </div>
      </div>
    );
  }

  // ── Sin gremio: crear o unirse ──
  if (view === 'create') {
    return (
      <div className="wood grain" style={{ position:'absolute', inset:0 }}>
        <ScreenHeader title="Fundar Gremio" subtitle="· Nuevo gremio ·" onBack={() => { setView('home'); setError(null); }} />
        <div className="scroll-area" style={{ position:'absolute', top:90, bottom:76, left:0, right:0, padding:'24px 20px' }}>
          <div className="parch torn-a" style={{ padding:'22px 20px' }}>
            <div className="t-carved" style={{ fontSize:10, letterSpacing:'0.28em', color:'var(--ink-faded)', marginBottom:14 }}>
              · Nombre del gremio ·
            </div>
            <input
              value={guildName}
              onChange={e => setGuildName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              maxLength={30}
              placeholder="Los Cazadores del Alba…"
              style={{
                width:'100%', padding:'12px 14px',
                background:'rgba(255,250,230,0.6)', border:'1px solid var(--parch-edge)',
                borderRadius:2, boxSizing:'border-box',
                fontFamily:'IM Fell English, serif', fontSize:15, color:'var(--ink)',
                outline:'none',
              }}
            />
            <div style={{ fontFamily:'Cinzel', fontSize:9, color:'var(--ink-faded)', marginTop:6, textAlign:'right' }}>
              {guildName.length}/30
            </div>
          </div>

          {error && (
            <div style={{ marginTop:12, padding:'8px 12px', background:'rgba(125,30,30,0.5)', border:'1px solid var(--wax-deep)', borderRadius:3, fontFamily:'Cinzel', fontSize:10, color:'var(--parch-stain)', textAlign:'center' }}>
              {error}
            </div>
          )}

          <button onClick={handleCreate} disabled={loading || !guildName.trim()} className="btn-iron" style={{ width:'100%', marginTop:16, opacity: (loading || !guildName.trim()) ? 0.5 : 1 }}>
            <span>⚔</span>
            {loading ? 'Fundando…' : 'Fundar el gremio'}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'join') {
    return (
      <div className="wood grain" style={{ position:'absolute', inset:0 }}>
        <ScreenHeader title="Unirse al Gremio" subtitle="· Código de invitación ·" onBack={() => { setView('home'); setError(null); }} />
        <div className="scroll-area" style={{ position:'absolute', top:90, bottom:76, left:0, right:0, padding:'24px 20px' }}>
          <div className="parch torn-a" style={{ padding:'22px 20px', textAlign:'center' }}>
            <div className="t-carved" style={{ fontSize:10, letterSpacing:'0.28em', color:'var(--ink-faded)', marginBottom:14 }}>
              · Código del gremio ·
            </div>
            <input
              value={codeInput}
              onChange={e => setCodeInput(e.target.value.toUpperCase().slice(0, 6))}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              maxLength={6}
              placeholder="AB3X7K"
              style={{
                width:'100%', padding:'14px',
                background:'rgba(255,250,230,0.6)', border:'1px solid var(--parch-edge)',
                borderRadius:2, boxSizing:'border-box',
                fontFamily:'Cinzel', fontSize:24, fontWeight:700,
                color:'var(--ink)', letterSpacing:'0.3em', textAlign:'center',
                outline:'none',
              }}
            />
            <div className="t-script" style={{ fontStyle:'italic', fontSize:12, color:'var(--ink-faded)', marginTop:10 }}>
              Pedile el código a quien te invitó
            </div>
          </div>

          {error && (
            <div style={{ marginTop:12, padding:'8px 12px', background:'rgba(125,30,30,0.5)', border:'1px solid var(--wax-deep)', borderRadius:3, fontFamily:'Cinzel', fontSize:10, color:'var(--parch-stain)', textAlign:'center' }}>
              {error}
            </div>
          )}

          <button onClick={handleJoin} disabled={loading || codeInput.length < 6} className="btn-iron" style={{ width:'100%', marginTop:16, opacity: (loading || codeInput.length < 6) ? 0.5 : 1 }}>
            <span>⚜</span>
            {loading ? 'Uniéndome…' : 'Unirme al gremio'}
          </button>
        </div>
      </div>
    );
  }

  // ── Vista principal sin gremio ──
  return (
    <div className="wood grain" style={{ position:'absolute', inset:0 }}>
      <ScreenHeader title="Salón del Gremio" subtitle="· Gremios ·" />

      <div className="scroll-area" style={{ position:'absolute', top:90, bottom:76, left:0, right:0, padding:'20px 20px 24px' }}>
        {/* Decreto */}
        <div className="parch torn-a" style={{ padding:'22px 20px', textAlign:'center', transform:'rotate(-0.5deg)', marginBottom:24 }}>
          <div className="t-carved" style={{ fontSize:10, letterSpacing:'0.28em', color:'var(--ink-faded)' }}>~ Convocatoria ~</div>
          <p className="t-script" style={{ fontStyle:'italic', fontSize:14, lineHeight:1.4, color:'var(--ink)', margin:'10px 4px 0' }}>
            «Los grandes caballeros no cazan solos. Forma un gremio con tus aliados y forjen leyendas juntos.»
          </p>
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:10 }}>
            <WaxSeal glyph="⚔" small />
          </div>
        </div>

        {/* Opciones */}
        <div className="col" style={{ gap:12 }}>
          <button onClick={() => { setView('create'); setError(null); }} className="btn-iron" style={{ width:'100%', padding:'16px' }}>
            <span style={{ fontSize:18 }}>⚔</span>
            Fundar un nuevo gremio
          </button>

          <div className="row" style={{ gap:10, alignItems:'center' }}>
            <div style={{ flex:1, height:1, background:'rgba(232,201,113,0.2)' }}/>
            <span style={{ fontFamily:'Cinzel', fontSize:9, color:'rgba(232,201,113,0.5)', letterSpacing:'0.18em' }}>o</span>
            <div style={{ flex:1, height:1, background:'rgba(232,201,113,0.2)' }}/>
          </div>

          <button onClick={() => { setView('join'); setError(null); }} className="btn-parch" style={{ width:'100%', padding:'16px' }}>
            <span style={{ fontSize:18 }}>⚜</span>
            Unirme a un gremio existente
          </button>
        </div>
      </div>
    </div>
  );
}

window.HistoryScreen = HistoryScreen;
window.GuildScreen   = GuildScreen;
