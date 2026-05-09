// Shared UI atoms

// ── Context para modo día/noche ───────────────────────────────
// Definido aquí para que Ribbon y ScreenHeader lo consuman sin prop drilling
const ModeContext = React.createContext({ mode: 'night', toggleMode: () => {} });
window.ModeContext = ModeContext;

// ── Atoms ─────────────────────────────────────────────────────

function Nail({ style }) {
  return <div className="nail" style={style} aria-hidden="true" />;
}

function WaxSeal({ glyph = "T", small, style }) {
  const size = small ? 28 : 44;
  return (
    <div className="seal" style={{ width: size, height: size, fontSize: small ? 12 : 18, ...style }}>
      <div className="seal-splash" />
      <span style={{ position: 'relative' }}>{glyph}</span>
    </div>
  );
}

function GoldDivider({ glyph = "✦", style }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, ...style }}>
      <div style={{ flex:1, height:1, background:'linear-gradient(90deg, transparent, var(--gold), var(--gold))' }}/>
      <span style={{ color:'var(--gold)', fontSize:11 }}>{glyph}</span>
      <div style={{ flex:1, height:1, background:'linear-gradient(90deg, var(--gold), var(--gold), transparent)' }}/>
    </div>
  );
}

function Coin() { return <span className="coin" aria-hidden="true" />; }

function Flame() { return <div className="flame" aria-hidden="true" />; }

// ── ModeToggle button ─────────────────────────────────────────
function ModeToggleBtn() {
  const { mode, toggleMode } = React.useContext(ModeContext);
  return (
    <button
      onClick={toggleMode}
      title={mode === 'night' ? 'Cambiar a día' : 'Cambiar a noche'}
      style={{
        background: 'none',
        border: '1px solid rgba(232,201,113,0.35)',
        borderRadius: '50%',
        width: 28, height: 28,
        display: 'grid', placeItems: 'center',
        cursor: 'pointer',
        color: 'var(--gold)',
        fontSize: 14, lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {mode === 'night' ? '☀' : '☾'}
    </button>
  );
}

// ── Ribbon (tablón de misiones) ───────────────────────────────
function Ribbon({ hero, onAvatar }) {
  const pct = (hero.xp / hero.xpNext) * 100;

  // Avatar: foto de Google o inicial del nombre
  const avatarContent = hero.photoURL ? (
    <img
      src={hero.photoURL}
      alt={hero.name}
      style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover' }}
      onError={e => { e.target.style.display='none'; }}
    />
  ) : (
    <span style={{ fontFamily:'Cinzel', fontSize:22, fontWeight:700, color:'#1a0e04' }}>
      {hero.name ? hero.name[0].toUpperCase() : '?'}
    </span>
  );

  return (
    <div className="ribbon">
      <div className="row" style={{ gap:12, alignItems:'flex-start' }}>
        <button onClick={onAvatar}
          style={{ background:'none', border:'none', padding:0, cursor:'pointer', flexShrink:0 }}>
          <div className="avatar" style={{ overflow: hero.photoURL ? 'hidden' : 'visible', padding:0 }}>
            {avatarContent}
          </div>
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'space-between' }}>
            <div className="t-carved" style={{ color:'var(--gold-bright)', fontSize:11, letterSpacing:'0.2em' }}>
              Nivel {hero.level}
            </div>
            <div className="row" style={{ gap:8, fontSize:12, color:'var(--gold)', fontFamily:'Cinzel' }}>
              <span className="row" style={{ gap:4 }}><Coin/>{hero.gold}</span>
              <span className="row" style={{ gap:4 }}><Flame/>{hero.streak || 0}</span>
              <ModeToggleBtn />
            </div>
          </div>
          <div className="t-display" style={{
            color:'var(--parch-light)', fontSize:18, lineHeight:1.05,
            textShadow:'0 1px 0 rgba(0,0,0,0.6)', marginTop:2,
          }}>{hero.name}</div>
          <div style={{ marginTop:8 }}>
            <div className="xp-track">
              <div className="xp-fill" style={{ '--w': pct + '%' }} />
            </div>
            <div className="row" style={{ justifyContent:'space-between', marginTop:3 }}>
              <span style={{ fontSize:9, color:'rgba(232,201,113,0.7)', fontFamily:'Cinzel', letterSpacing:'0.15em' }}>
                {hero.xp} / {hero.xpNext} XP
              </span>
              <span style={{ fontSize:9, color:'rgba(232,201,113,0.55)', fontFamily:'Cinzel', letterSpacing:'0.15em' }}>
                {hero.xpNext - hero.xp} a nv. {hero.level + 1}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab bar ───────────────────────────────────────────────────
function TabBar({ tab, onTab }) {
  const tabs = [
    { id:'board',     label:'Tablón',  glyph:'⚐' },
    { id:'history',   label:'Crónica', glyph:'❧' },
    { id:'profile',   label:'Heraldo', glyph:'♛' },
    { id:'inventory', label:'Cofre',   glyph:'⚷' },
    { id:'rank',      label:'Gremio',  glyph:'⚔' },
  ];
  return (
    <div className="tabbar">
      {tabs.map(t => (
        <button key={t.id}
          className={'tab' + (tab === t.id ? ' is-active' : '')}
          onClick={() => onTab(t.id)}>
          <span style={{ fontSize:18, lineHeight:1, fontFamily:'Cinzel, serif' }}>{t.glyph}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Type chip ─────────────────────────────────────────────────
function TypeChip({ type }) {
  const m = TYPE_META[type] || TYPE_META.diaria;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:4,
      padding:'2px 7px',
      fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase',
      color:'#fff5d8',
      background: m.color,
      borderRadius:2,
      boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.15) inset',
    }}>
      <span aria-hidden="true">{m.glyph}</span>{m.label}
    </span>
  );
}

// ── Stat badge ────────────────────────────────────────────────
function StatBadge({ stat, value, glyph }) {
  return (
    <div className="col" style={{
      alignItems:'center', gap:6, padding:'10px 6px',
      background:'rgba(0,0,0,0.25)',
      border:'1px solid rgba(232,201,113,0.3)',
      borderRadius:3, flex:1,
    }}>
      <span style={{ color:'var(--gold-bright)', fontSize:18 }}>{glyph}</span>
      <span style={{ fontFamily:'Cinzel', fontSize:9, letterSpacing:'0.15em', color:'var(--parch-stain)', textTransform:'uppercase' }}>
        {stat}
      </span>
      <span style={{ fontFamily:'Cinzel', fontWeight:700, fontSize:18, color:'var(--parch-light)' }}>{value}</span>
    </div>
  );
}

// ── Screen header ─────────────────────────────────────────────
function ScreenHeader({ title, subtitle, onBack }) {
  return (
    <div style={{ position:'relative', padding:'14px 14px 10px',
      background:'linear-gradient(180deg, var(--wood-deep), var(--wood-dark))' }}>
      <div className="row" style={{ gap:12 }}>
        {onBack && (
          <button onClick={onBack}
            style={{
              width:36, height:36, borderRadius:'50%',
              border:'1px solid var(--gold-deep)',
              background:'rgba(0,0,0,0.4)',
              color:'var(--gold-bright)',
              fontFamily:'Cinzel', fontSize:18,
              cursor:'pointer',
              boxShadow:'inset 0 0 6px rgba(0,0,0,0.6)',
              flexShrink: 0,
            }}>‹</button>
        )}
        <div style={{ flex:1 }}>
          <div className="t-carved" style={{ color:'var(--gold)', fontSize:10, letterSpacing:'0.25em' }}>{subtitle}</div>
          <div className="t-display" style={{ color:'var(--parch-light)', fontSize:22, lineHeight:1.05, marginTop:2 }}>{title}</div>
        </div>
        {/* Toggle modo día/noche */}
        <ModeToggleBtn />
      </div>
      <div style={{ height:1, marginTop:10, background:'linear-gradient(90deg, transparent, var(--gold-deep), transparent)' }}/>
    </div>
  );
}

// ── Diálogo de confirmación medieval ─────────────────────────
function ConfirmDialog({ title, message, confirmLabel = "Confirmar", onConfirm, onCancel }) {
  return (
    <div style={{
      position:'absolute', inset:0, zIndex:150,
      display:'grid', placeItems:'center',
      background:'rgba(0,0,0,0.72)',
      animation:'float-in 180ms ease-out',
    }}>
      <div className="parch torn-a" style={{
        margin:'0 24px', padding:'26px 22px',
        textAlign:'center',
        transform:'rotate(-0.5deg)',
      }}>
        <div style={{ fontSize:28, marginBottom:10 }}>⚔</div>
        <div className="t-display" style={{ fontSize:22, color:'var(--ink)', lineHeight:1, marginBottom:8 }}>
          {title}
        </div>
        <div className="t-script" style={{ fontStyle:'italic', fontSize:13, color:'var(--ink-soft)', lineHeight:1.4 }}>
          {message}
        </div>
        <div className="row" style={{ gap:10, marginTop:20 }}>
          <button onClick={onCancel} className="btn-parch" style={{ flex:1, padding:'11px' }}>
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-iron" style={{ flex:1, padding:'11px' }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Nail, WaxSeal, GoldDivider, Coin, Flame, Ribbon, TabBar, TypeChip, StatBadge, ScreenHeader, ModeToggleBtn, ConfirmDialog });
