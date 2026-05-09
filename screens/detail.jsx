// Quest detail — open scroll, complete with photo
function DetailScreen({ q, hero, onClose, onComplete, alreadyCompleted = false }) {
  const [done, setDone] = React.useState(
    alreadyCompleted ? Array(q.tasks.length).fill(true) : Array(q.tasks.length).fill(false)
  );
  const [photo, setPhoto] = React.useState(null);
  const [stamping, setStamping] = React.useState(alreadyCompleted);
  const fileRef = React.useRef(null);
  const meta = TYPE_META[q.type];
  const allDone = done.every(Boolean);

  const toggle = i => setDone(d => d.map((v, idx) => idx === i ? !v : v));

  const onPickPhoto = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(f);
  };

  const onSeal = () => {
    setStamping(true);
    setTimeout(() => onComplete(q), 1400);
  };

  return (
    <div className="wood grain" style={{ position:'absolute', inset:0 }}>
      <ScreenHeader title="Pergamino" subtitle={meta.label} onBack={onClose} />

      <div className="scroll-area" style={{ position:'absolute', top:90, bottom:0, left:0, right:0, padding:'12px 16px 30px' }}>
        {/* Open scroll */}
        <div style={{ position:'relative', animation:'scroll-open 380ms cubic-bezier(0.22,1.2,0.32,1)', transformOrigin:'top center' }}>
          {/* Top scroll roll */}
          <div style={{ height:18, borderRadius:9,
            background:'linear-gradient(180deg, #c4a16a, #6e4a1c 50%, #3d2a10)',
            boxShadow:'inset 0 1px 0 rgba(255,230,180,0.4), 0 4px 8px rgba(0,0,0,0.6)',
            margin:'0 -2px',
          }}/>

          <div className="parch" style={{ padding:'22px 22px 26px', position:'relative', borderRadius:0 }}>
            <div className="row" style={{ gap:8, justifyContent:'space-between' }}>
              <TypeChip type={q.type} />
              <div className="row" style={{ gap:10, fontFamily:'Cinzel', fontSize:12, color:'var(--ink-soft)' }}>
                <span>+{q.xp} XP</span>
                <span className="row" style={{ gap:4 }}><Coin/>+{q.gold}</span>
              </div>
            </div>

            <h1 className="t-display" style={{
              margin:'14px 0 6px', fontSize:30, lineHeight:1.1, color:'var(--ink)',
            }}>{q.title}</h1>
            <p className="t-script" style={{ fontStyle:'italic', margin:0, color:'var(--ink-soft)', fontSize:14 }}>
              {q.sub}
            </p>

            <GoldDivider style={{ margin:'14px 0 10px' }} />

            <p className="t-script" style={{ margin:0, fontSize:15, lineHeight:1.45, color:'var(--ink)' }}>
              {q.desc}
            </p>

            <div style={{ marginTop:18 }}>
              <div className="t-carved" style={{ fontSize:10, letterSpacing:'0.28em', color:'var(--ink-faded)' }}>
                · Encomiendas ·
              </div>
              <div className="col" style={{ gap:8, marginTop:10 }}>
                {q.tasks.map((t, i) => (
                  <button key={i} onClick={() => toggle(i)} style={{
                    display:'flex', alignItems:'center', gap:12,
                    background:'rgba(60,40,20,0.06)',
                    border:'1px dashed rgba(60,40,20,0.35)',
                    padding:'10px 12px',
                    cursor:'pointer',
                    textAlign:'left',
                    fontFamily:'IM Fell English, serif',
                    fontSize:14, color:'var(--ink)',
                    borderRadius:2,
                  }}>
                    <Checkbox checked={done[i]} />
                    <span style={{
                      textDecoration: done[i] ? 'line-through' : 'none',
                      opacity: done[i] ? 0.55 : 1,
                      flex:1,
                    }}>{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo upload — gilded frame */}
            <div style={{ marginTop:20 }}>
              <div className="t-carved" style={{ fontSize:10, letterSpacing:'0.28em', color:'var(--ink-faded)' }}>
                · Estampa de la hazaña · <span style={{ opacity:0.6 }}>opcional</span>
              </div>

              {photo ? (
                <div className="gilded" style={{ marginTop:10 }}>
                  <div style={{ position:'relative' }}>
                    <img src={photo} alt="" style={{ display:'block', width:'100%', borderRadius:1 }}/>
                    <button onClick={() => setPhoto(null)}
                      style={{ position:'absolute', top:8, right:8, padding:'4px 10px',
                        background:'rgba(0,0,0,0.7)', color:'var(--gold-bright)',
                        border:'1px solid var(--gold-deep)', cursor:'pointer',
                        fontFamily:'Cinzel', fontSize:10, letterSpacing:'0.16em' }}>
                      Cambiar
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()}
                  className="gilded"
                  style={{ marginTop:10, width:'100%', display:'block', cursor:'pointer', border:'none' }}>
                  <div style={{
                    height:120,
                    background:
                      'repeating-linear-gradient(135deg, rgba(230,210,170,0.15) 0 8px, rgba(230,210,170,0.05) 8px 16px), linear-gradient(180deg, rgba(40,20,10,0.5), rgba(20,10,5,0.7))',
                    display:'grid', placeItems:'center', textAlign:'center',
                    borderRadius:1,
                  }}>
                    <div>
                      <div style={{ fontSize:28, color:'var(--gold-bright)' }}>✦</div>
                      <div className="t-carved" style={{ fontSize:11, letterSpacing:'0.22em', color:'var(--gold-bright)', marginTop:4 }}>
                        Sellar con Imagen
                      </div>
                      <div className="t-script" style={{ fontSize:11, color:'var(--parch-stain)', fontStyle:'italic', marginTop:3 }}>
                        toca para acompañar tu hazaña
                      </div>
                    </div>
                  </div>
                </button>
              )}
              <input ref={fileRef} onChange={onPickPhoto} type="file" accept="image/*" style={{ display:'none' }}/>
            </div>

            {/* Existing wax (sealed quest decoration) */}
            {q.sealed && (
              <WaxSeal glyph="♛" style={{ position:'absolute', top:-12, right:18 }}/>
            )}

            {stamping && (
              <div style={{
                position:'absolute', inset:0,
                display:'grid', placeItems:'center',
                pointerEvents:'none',
                background:'radial-gradient(circle, rgba(255,255,255,0.4), transparent 60%)',
              }}>
                <div style={{
                  width:160, height:160, borderRadius:'50%',
                  border:'4px double var(--wax-bright)',
                  background:'radial-gradient(circle at 35% 30%, var(--wax-bright) 0%, var(--wax) 60%, var(--wax-deep) 100%)',
                  display:'grid', placeItems:'center',
                  color:'rgba(0,0,0,0.5)', fontFamily:'Cinzel', fontWeight:700, fontSize:20, letterSpacing:'0.18em',
                  textAlign:'center',
                  animation:'stamp 700ms cubic-bezier(0.4, 1.5, 0.4, 1) forwards',
                  boxShadow:'inset -6px -6px 12px rgba(0,0,0,0.5), inset 4px 4px 8px rgba(255,180,180,0.3), 0 8px 20px rgba(0,0,0,0.6)',
                }}>
                  HAZAÑA<br/>COMPLETA
                </div>
              </div>
            )}
          </div>

          {/* Bottom scroll roll */}
          <div style={{ height:18, borderRadius:9,
            background:'linear-gradient(180deg, #c4a16a, #6e4a1c 50%, #3d2a10)',
            boxShadow:'inset 0 1px 0 rgba(255,230,180,0.4), 0 4px 8px rgba(0,0,0,0.6)',
            margin:'0 -2px',
          }}/>
        </div>

        {/* Action button */}
        <div style={{ marginTop:18 }}>
          {alreadyCompleted ? (
            <div className="btn-iron" style={{
              width:'100%', padding:'14px',
              opacity:0.6, cursor:'default',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}>
              <span style={{ fontSize:16 }}>✓</span>
              Ya sellada hoy — ¡bien hecho!
            </div>
          ) : (
            <button onClick={allDone ? onSeal : null}
              disabled={!allDone || stamping}
              className="btn-iron"
              style={{
                width:'100%', padding:'14px',
                opacity: allDone ? 1 : 0.45,
                cursor: allDone ? 'pointer' : 'not-allowed',
                animation: allDone ? 'glow-pulse 2s infinite' : 'none',
              }}>
              <span style={{ fontSize:16 }}>♛</span>
              {allDone ? 'Sellar la hazaña' : `Faltan ${done.filter(d=>!d).length} encomiendas`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked }) {
  return (
    <div style={{
      width:22, height:22, flexShrink:0,
      border:'1.5px solid var(--ink-soft)',
      background: checked ? 'var(--wax)' : 'rgba(255,255,255,0.3)',
      borderRadius:2,
      display:'grid', placeItems:'center',
      color:'#fff5d8', fontSize:14,
      fontFamily:'Cinzel',
      transition:'background 220ms',
      boxShadow: checked ? 'inset 0 0 4px rgba(0,0,0,0.4)' : 'none',
    }}>{checked ? '✓' : ''}</div>
  );
}

window.DetailScreen = DetailScreen;
