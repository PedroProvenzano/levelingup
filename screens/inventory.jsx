// Inventario — cofre del reino (datos reales del usuario)
function InventoryScreen({ hero, inventory = [] }) {
  const [filter, setFilter] = React.useState('todos');
  const filters = [
    { id:'todos',    label:'Todo' },
    { id:'arma',     label:'Armas' },
    { id:'armadura', label:'Armaduras' },
    { id:'reliquia', label:'Reliquias' },
    { id:'consumo',  label:'Pociones' },
  ];
  const items = filter === 'todos' ? inventory : inventory.filter(i => i.kind === filter);

  return (
    <div className="wood grain" style={{ position:'absolute', inset:0 }}>
      <ScreenHeader title="Cofre del Reino" subtitle="· Inventario ·" />

      <div className="scroll-area" style={{ position:'absolute', top:90, bottom:76, left:0, right:0, padding:'14px 16px 24px' }}>

        {/* Erario real */}
        <div style={{
          padding:'14px 16px', borderRadius:3,
          background:'linear-gradient(180deg, #2c1d0e, #1a1208)',
          border:'1px solid var(--gold-deep)',
          boxShadow:'inset 0 0 18px rgba(0,0,0,0.7), 0 4px 10px rgba(0,0,0,0.6)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div>
            <div className="t-carved" style={{ fontSize:10, color:'var(--parch-stain)', letterSpacing:'0.22em' }}>· Erario Real ·</div>
            <div style={{ fontFamily:'Cinzel', fontWeight:700, fontSize:28, color:'var(--gold-bright)', marginTop:2 }}>
              {(hero?.gold || 0).toLocaleString('es')} <span style={{ fontSize:14 }}>monedas</span>
            </div>
          </div>
          <div style={{
            width:54, height:54, borderRadius:'50%',
            background:'radial-gradient(circle at 30% 25%, var(--gold-shine), var(--gold-bright) 35%, var(--gold-deep) 100%)',
            boxShadow:'inset 0 0 0 2px var(--wood-deep), inset 0 0 0 3px var(--gold-deep), 0 3px 6px rgba(0,0,0,0.7)',
            display:'grid', placeItems:'center',
            color:'var(--wood-deep)', fontFamily:'Cinzel', fontSize:24, fontWeight:700,
          }}>♛</div>
        </div>

        {/* Tienda — próximamente */}
        <div style={{
          marginTop:14, padding:'14px 16px', borderRadius:3,
          background:'linear-gradient(180deg, rgba(47,90,58,0.3), rgba(20,40,24,0.4))',
          border:'1px dashed rgba(47,90,58,0.6)',
          display:'flex', alignItems:'center', gap:12,
        }}>
          <div style={{ fontSize:26, color:'var(--emerald)', opacity:0.8 }}>⚜</div>
          <div style={{ flex:1 }}>
            <div className="t-carved" style={{ fontSize:10, color:'var(--emerald)', letterSpacing:'0.22em' }}>Tienda del reino</div>
            <div className="t-script" style={{ fontStyle:'italic', fontSize:12, color:'var(--parch-stain)', marginTop:2 }}>
              Próximamente — gasta tus monedas en objetos legendarios
            </div>
          </div>
          <div style={{
            padding:'4px 10px', borderRadius:2,
            background:'rgba(47,90,58,0.3)', border:'1px solid rgba(47,90,58,0.5)',
            fontFamily:'Cinzel', fontSize:9, letterSpacing:'0.18em', color:'var(--emerald)',
          }}>Pronto</div>
        </div>

        {/* Filtros (solo si hay items) */}
        {inventory.length > 0 && (
          <div className="row" style={{ gap:6, marginTop:14, overflowX:'auto', paddingBottom:6 }}>
            {filters.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                style={{
                  padding:'6px 12px', whiteSpace:'nowrap',
                  fontFamily:'Cinzel', fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase',
                  color: filter === f.id ? '#1a0e04' : 'var(--parch-stain)',
                  background: filter === f.id
                    ? 'linear-gradient(180deg, var(--gold-bright), var(--gold))'
                    : 'rgba(0,0,0,0.3)',
                  border:'1px solid ' + (filter === f.id ? 'var(--gold-deep)' : 'rgba(232,201,113,0.3)'),
                  borderRadius:2, cursor:'pointer',
                }}>{f.label}</button>
            ))}
          </div>
        )}

        {/* Estado según contenido */}
        {inventory.length === 0 ? (
          <div className="parch torn-a" style={{ marginTop:20, padding:'28px 20px', textAlign:'center', transform:'rotate(-0.5deg)' }}>
            <div style={{ fontSize:36, opacity:0.5, marginBottom:10 }}>⚷</div>
            <div className="t-display" style={{ fontSize:20, color:'var(--ink)', marginBottom:8 }}>El cofre aguarda</div>
            <div className="t-script" style={{ fontStyle:'italic', fontSize:13, color:'var(--ink-soft)', lineHeight:1.4 }}>
              «Completa misiones para ganar monedas y desbloquear objetos del reino.»
            </div>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign:'center', padding:'24px 0', color:'var(--parch-stain)', fontFamily:'Cinzel', fontSize:11 }}>
            Sin objetos de esta categoría
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:14 }}>
            {items.map(it => <InventoryCard key={it.id} item={it} />)}
          </div>
        )}
      </div>
    </div>
  );
}

const RARITY_COLOR = {
  'común':  { c:'#8a8278', label:'Común' },
  'raro':   { c:'#4a78b8', label:'Raro' },
  'épico':  { c:'#9a4ac8', label:'Épico' },
};

function InventoryCard({ item }) {
  const r = RARITY_COLOR[item.rarity] || RARITY_COLOR['común'];
  return (
    <div style={{
      position:'relative', padding:'14px 10px 12px', borderRadius:3,
      background:'linear-gradient(180deg, #2a1d10, #1a1208)',
      border:'1px solid ' + (item.equipped ? 'var(--gold)' : 'rgba(232,201,113,0.25)'),
      boxShadow: item.equipped
        ? 'inset 0 0 14px rgba(232,201,113,0.18), 0 3px 8px rgba(0,0,0,0.55)'
        : 'inset 0 0 10px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.4)',
      textAlign:'center',
    }}>
      {item.equipped && (
        <span style={{
          position:'absolute', top:-1, left:-1, padding:'2px 6px',
          fontFamily:'Cinzel', fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase',
          color:'#1a0e04', background:'linear-gradient(180deg, var(--gold-bright), var(--gold))',
          borderRadius:'2px 0 6px 0',
        }}>Equipado</span>
      )}
      <div style={{
        margin:'0 auto', width:54, height:54, borderRadius:3,
        background:'radial-gradient(circle at 35% 30%, ' + r.c + '55 0%, #1a1208 75%)',
        border:'1px solid ' + r.c, display:'grid', placeItems:'center',
        color:'var(--gold-bright)', fontSize:28,
        boxShadow:'inset 0 0 8px rgba(0,0,0,0.7), 0 0 12px ' + r.c + '44',
      }}>{item.glyph}</div>
      <div className="t-display" style={{ fontSize:14, color:'var(--parch-light)', marginTop:8, lineHeight:1.05 }}>
        {item.name}
      </div>
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:6, marginTop:6 }}>
        <span style={{ fontFamily:'Cinzel', fontSize:9, letterSpacing:'0.18em', color:r.c, textTransform:'uppercase' }}>
          {r.label}
        </span>
        {item.count && <span style={{ fontFamily:'Cinzel', fontSize:10, color:'var(--gold-bright)' }}>×{item.count}</span>}
      </div>
    </div>
  );
}

window.InventoryScreen = InventoryScreen;
