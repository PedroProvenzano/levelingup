// Tablón de misiones — home

const ROTATIONS_A = [-3, 2, -2, 1, -4, 3, -1, 2, -3];
const ROTATIONS_B = [-6, 4, -3, 7, -5, 2, -8, 5, -2];

function QuestNote({ q, layout, density, onOpen, idx, completed = false }) {
  const meta = TYPE_META[q.type];
  const tornClass = idx % 2 ? 'torn-b' : 'torn-a';
  const tilt = layout === 'scattered' ? ROTATIONS_B[idx % ROTATIONS_B.length] : ROTATIONS_A[idx % ROTATIONS_A.length];

  const sizes = layout === 'scattered'
    ? [{w:'60%'},{w:'62%'},{w:'58%'},{w:'64%'}]
    : [{w:'100%'}];
  const size = sizes[idx % sizes.length];

  return (
    <button
      onClick={() => onOpen(q)}
      className={'note ' + tornClass}
      style={{
        position: layout === 'scattered' ? 'absolute' : 'relative',
        ...size,
        padding: density === 'dense' ? '11px 14px 14px' : '14px 16px 16px',
        cursor: completed ? 'default' : 'pointer',
        textAlign:'left',
        transform: `rotate(${tilt}deg)`,
        animation: 'pin-down 350ms cubic-bezier(0.22,1.2,0.32,1) backwards',
        animationDelay: (idx * 35) + 'ms',
        backgroundColor: completed ? '#a09070' : q.tint,
        border:'none',
        opacity: completed ? 0.65 : 1,
        filter: completed ? 'grayscale(30%)' : 'none',
      }}
    >
      {/* Sello de completado */}
      {completed && (
        <div style={{
          position:'absolute', top:6, right:8,
          fontFamily:'Cinzel', fontSize:9, letterSpacing:'0.18em',
          color:'var(--wax)', opacity:0.85,
          transform:'rotate(-8deg)',
          pointerEvents:'none',
          lineHeight:1.2,
          textAlign:'center',
        }}>
          <div>✓ SELLADA</div>
        </div>
      )}
      {/* Iron nail OR wax seal pinning */}
      {layout === 'scattered'
        ? <WaxSeal small glyph={meta.glyph} style={{ position:'absolute', top:-10, right:14 }}/>
        : <Nail style={{ top:-4, left:'50%', transform:'translateX(-50%)' }}/>
      }

      <div className="row" style={{ gap:8, alignItems:'center', justifyContent:'space-between' }}>
        <TypeChip type={q.type} />
        <span style={{ fontSize:13, color:'var(--ink-faded)', fontFamily:'Cinzel', letterSpacing:'0.12em' }}>
          +{q.xp} XP
        </span>
      </div>

      <div className="t-display" style={{
        marginTop: density === 'dense' ? 4 : 6,
        fontSize: density === 'dense' ? 17 : 19,
        lineHeight:1.05,
        color:'var(--ink)',
      }}>{q.title}</div>

      {density !== 'dense' && (
        <div className="t-script" style={{
          fontStyle:'italic', fontSize:12, color:'var(--ink-soft)',
          marginTop:4,
        }}>{q.sub}</div>
      )}

      <div className="row" style={{ marginTop: density === 'dense' ? 6 : 10, gap:10, alignItems:'center', justifyContent:'space-between' }}>
        <div className="row" style={{ gap:6, fontFamily:'Cinzel', fontSize:11, color:'var(--ink-soft)' }}>
          <Coin/> +{q.gold}
        </div>
        <div style={{ fontFamily:'Cinzel', fontSize:11, color:'var(--ink-soft)', letterSpacing:'0.1em' }}>
          {q.tasks.length} pasos
        </div>
      </div>

      {q.sealed && layout !== 'scattered' && (
        <WaxSeal style={{ position:'absolute', bottom:-12, right:-10 }} glyph="♛"/>
      )}
    </button>
  );
}

function BoardScreen({ hero, onOpen, onAvatar, layout, density, completedQuestIds = [] }) {
  const visibleQuests = density === 'sparse' ? QUESTS.slice(0,5)
                      : density === 'dense'  ? QUESTS
                      : QUESTS.slice(0,7);

  return (
    <div className="wood grain" style={{ position:'absolute', inset:0 }}>
      <Ribbon hero={hero} onAvatar={onAvatar} />

      {/* Banner: "Tablón de Misiones" */}
      <div style={{ position:'relative', padding:'12px 14px 4px' }}>
        <div className="row" style={{ alignItems:'baseline', justifyContent:'space-between' }}>
          <div>
            <div className="t-carved" style={{ color:'var(--gold)', fontSize:10, letterSpacing:'0.3em' }}>Pergaminos del día</div>
            <h2 className="t-display" style={{ margin:0, color:'var(--parch-light)', fontSize:26, lineHeight:1 }}>Tablón de Misiones</h2>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'Cinzel', fontSize:10, color:'var(--gold)', letterSpacing:'0.18em' }}>HOY</div>
            <div className="t-script" style={{ fontStyle:'italic', fontSize:13, color:'var(--parch-stain)' }}>9 may, día 23</div>
          </div>
        </div>
      </div>

      {/* The board itself */}
      <div className="scroll-area" style={{
        position:'absolute',
        top: 168, bottom: 76, left: 0, right: 0,
        padding: '14px 16px 28px',
      }}>
        {/* corner nails on the wood */}
        <Nail style={{ top:6, left:10 }}/>
        <Nail style={{ top:6, right:10 }}/>

        {layout === 'rows' ? (
          <div className="col" style={{ gap: density === 'dense' ? 12 : 18 }}>
            {visibleQuests.map((q, i) => (
              <QuestNote key={q.id} q={q} layout="rows" density={density} idx={i} onOpen={onOpen} completed={completedQuestIds.includes(q.id)} />
            ))}
          </div>
        ) : (
          <ScatteredBoard quests={visibleQuests} onOpen={onOpen} density={density} completedQuestIds={completedQuestIds} />
        )}
      </div>
    </div>
  );
}

function ScatteredBoard({ quests, onOpen, density, completedQuestIds = [] }) {
  // Hand-tuned positions — masonry style with overlap
  const positions = [
    { top: 0,   left: '2%',  z: 3 },
    { top: 50,  right:'4%',  z: 4 },
    { top: 130, left: '6%',  z: 2 },
    { top: 200, right:'2%',  z: 5 },
    { top: 290, left:'10%',  z: 3 },
    { top: 360, right:'6%',  z: 4 },
    { top: 450, left: '0%',  z: 2 },
    { top: 510, right:'8%',  z: 5 },
    { top: 600, left: '4%',  z: 3 },
  ];
  return (
    <div style={{ position:'relative', minHeight: 720 }}>
      {quests.map((q, i) => (
        <div key={q.id} style={{ position:'absolute', width: '60%', zIndex: positions[i % positions.length].z, ...positions[i % positions.length] }}>
          <QuestNote q={q} layout="scattered" density={density} idx={i} onOpen={onOpen} completed={completedQuestIds.includes(q.id)} />
        </div>
      ))}
      {/* decorative rope between two notes */}
      <svg viewBox="0 0 400 800" style={{ position:'absolute', inset:0, pointerEvents:'none' }} preserveAspectRatio="none">
        <path d="M 60 30 Q 200 60 340 90" stroke="#3a2410" strokeWidth="2" fill="none" strokeDasharray="3 4" opacity="0.7"/>
      </svg>
    </div>
  );
}

window.BoardScreen = BoardScreen;
