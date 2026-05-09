// History / Crónica del caballero — datos reales desde Firestore
function HistoryScreen({ history = [], hero }) {
  const streak      = hero?.streak      || 0;
  const bestStreak  = hero?.bestStreak  || streak;

  return (
    <div className="wood grain" style={{ position:'absolute', inset:0 }}>
      <ScreenHeader title="Crónica" subtitle="· Diario del caballero ·" />

      <div className="scroll-area" style={{ position:'absolute', top:90, bottom:76, left:0, right:0, padding:'14px 16px 24px' }}>

        {/* Streak banner */}
        <div style={{
          padding:'14px 16px',
          background:'linear-gradient(180deg, #2c1d0e, #1a1208)',
          border:'1px solid var(--gold-deep)',
          borderRadius:3,
          display:'flex', alignItems:'center', gap:14,
        }}>
          <div style={{ position:'relative' }}>
            <div style={{ width:46, height:46, display:'grid', placeItems:'center', filter:'drop-shadow(0 0 12px rgba(249,162,58,0.5))' }}>
              <div style={{ transform:'scale(2)' }}><Flame/></div>
            </div>
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

        {/* Mini calendar — últimas 3 semanas */}
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
                position:'relative',
                padding:'12px 14px',
                background: 'linear-gradient(180deg, var(--parch-light), var(--parch-stain))',
                borderRadius:2,
                boxShadow:'0 3px 8px rgba(0,0,0,0.5)',
                border: '1px solid var(--parch-edge)',
                transform: 'rotate(' + (i % 2 ? 0.4 : -0.5) + 'deg)',
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
  // Construir set de fechas con completions
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
          aspectRatio:'1',
          borderRadius:2,
          background: filled
            ? 'radial-gradient(circle at 30% 25%, var(--gold-shine), var(--gold-bright) 40%, var(--gold-deep))'
            : 'rgba(0,0,0,0.4)',
          border: isToday ? '2px solid #fff5d8' : '1px solid rgba(232,201,113,0.25)',
          display:'grid', placeItems:'center',
          fontFamily:'Cinzel', fontSize:9,
          color: filled ? '#1a0e04' : 'rgba(232,201,113,0.4)',
          boxShadow: filled ? 'inset 0 0 4px rgba(0,0,0,0.4)' : 'inset 0 0 4px rgba(0,0,0,0.6)',
        }}>
          {filled ? '✓' : day}
        </div>
      ))}
    </div>
  );
}

// Rank / Gremio screen
function RankScreen() {
  return (
    <div className="wood grain" style={{ position:'absolute', inset:0 }}>
      <ScreenHeader title="Salón del Gremio" subtitle="· Ranking ·" />

      <div className="scroll-area" style={{ position:'absolute', top:90, bottom:76, left:0, right:0, padding:'14px 16px 24px' }}>
        <div className="parch torn-a" style={{ padding:'18px 18px 16px' }}>
          <div className="t-carved" style={{ fontSize:10, letterSpacing:'0.28em', color:'var(--ink-faded)', textAlign:'center' }}>
            · Tabla de honor — temporada 2 ·
          </div>
          <div className="col" style={{ gap:8, marginTop:14 }}>
            {RANK.map((r, i) => (
              <div key={i} style={{
                display:'grid', gridTemplateColumns:'28px 1fr auto', gap:10, alignItems:'center',
                padding:'10px 12px',
                background: r.you ? 'rgba(125,30,30,0.14)' : 'rgba(60,40,20,0.08)',
                border: '1px ' + (r.you ? 'solid var(--wax)' : 'dashed rgba(60,40,20,0.35)'),
                borderRadius:2,
              }}>
                <div className="t-display" style={{ fontSize:22, lineHeight:1, color: i < 3 ? 'var(--wax)' : 'var(--ink-soft)', textAlign:'center' }}>{i+1}</div>
                <div>
                  <div className="t-display" style={{ fontSize:16, color:'var(--ink)', lineHeight:1.05 }}>
                    {r.name}{r.you && <span style={{ color:'var(--wax)', fontSize:11, marginLeft:6 }}>· tú</span>}
                  </div>
                  <div style={{ fontFamily:'Cinzel', fontSize:10, color:'var(--ink-faded)', letterSpacing:'0.12em' }}>
                    Nivel {r.level}
                  </div>
                </div>
                <div style={{ fontFamily:'Cinzel', fontWeight:700, fontSize:14, color:'var(--ink)' }}>
                  {r.score.toLocaleString('es')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.HistoryScreen = HistoryScreen;
window.RankScreen    = RankScreen;
