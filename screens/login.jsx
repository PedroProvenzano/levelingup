// Login screen — Google Sign-In real via Firebase
function LoginScreen() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError]     = React.useState(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseAuth.signInWithPopup(googleProvider);
      // El auth state listener en app.jsx detecta el login y cambia la pantalla
    } catch (err) {
      console.error('Error de login:', err);
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError('No se pudo iniciar sesión. Intenta nuevamente.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="wood grain" style={{
      position:'absolute', inset:0,
      display:'flex', flexDirection:'column',
      padding:'42px 28px 36px',
    }}>
      {/* Crown crest */}
      <div style={{ marginTop:48, textAlign:'center' }}>
        <div style={{
          display:'inline-grid',
          width:104, height:104,
          borderRadius:'50%',
          background:'radial-gradient(circle at 30% 25%, var(--gold-shine), var(--gold-bright) 30%, var(--gold) 60%, var(--gold-deep))',
          boxShadow:
            'inset 0 0 0 2px var(--wood-deep), inset 0 0 0 4px var(--gold-deep), 0 0 24px rgba(232,201,113,0.4), 0 6px 12px rgba(0,0,0,0.7)',
          placeItems:'center',
          color:'var(--wood-deep)',
          fontFamily:'Cinzel', fontSize:54, fontWeight:700,
        }}>♛</div>
      </div>

      <div style={{ textAlign:'center', marginTop:18 }}>
        <div className="t-carved" style={{ color:'var(--gold)', fontSize:11, letterSpacing:'0.4em' }}>ANNO MMXXVI</div>
        <h1 className="t-display" style={{
          color:'var(--parch-light)',
          fontSize:56, lineHeight:0.95,
          margin:'8px 0 4px',
          textShadow:'0 2px 0 rgba(0,0,0,0.7), 0 0 18px rgba(232,201,113,0.25)',
        }}>El Reino</h1>
        <div className="t-carved" style={{ color:'var(--gold-bright)', fontSize:12, letterSpacing:'0.32em' }}>· Cazador de hazañas ·</div>
      </div>

      {/* Decree parchment */}
      <div className="parch torn-a" style={{
        marginTop:34,
        padding:'22px 22px 24px',
        textAlign:'center',
        position:'relative',
        transform:'rotate(-1deg)',
      }}>
        <div className="t-carved" style={{ fontSize:10, letterSpacing:'0.32em', color:'var(--ink-soft)' }}>~ Real Decreto ~</div>
        <p className="t-script" style={{
          fontStyle:'italic', fontSize:15, lineHeight:1.4,
          margin:'10px 4px 0', color:'var(--ink)',
        }}>
          «Aquel que aspire a la grandeza, jure ante la corona y forje su leyenda con cada amanecer.»
        </p>
        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:12 }}>
          <WaxSeal glyph="♛" />
        </div>
      </div>

      <div style={{ flex:1 }} />

      {/* Error message */}
      {error && (
        <div style={{
          marginBottom:12, padding:'10px 14px',
          background:'rgba(125,30,30,0.7)',
          border:'1px solid var(--wax-deep)',
          borderRadius:3,
          fontFamily:'Cinzel', fontSize:11, color:'var(--parch-stain)',
          textAlign:'center', letterSpacing:'0.1em',
        }}>
          {error}
        </div>
      )}

      {/* Sign in with Google */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          marginTop:24, padding:'14px 18px', width:'100%',
          background: loading
            ? 'linear-gradient(180deg, var(--parch-stain), var(--parch-edge))'
            : 'linear-gradient(180deg, var(--parch-light), var(--parch) 45%, var(--parch-stain))',
          border:'1px solid var(--parch-edge)',
          borderRadius:3,
          cursor: loading ? 'not-allowed' : 'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:12,
          boxShadow:'0 6px 16px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,250,220,0.5)',
          opacity: loading ? 0.7 : 1,
          transition:'opacity 200ms',
        }}>
        {loading ? (
          <>
            <span style={{ fontSize:18, animation:'glow-pulse 1s infinite', color:'var(--gold)' }}>♛</span>
            <span className="t-carved" style={{ fontSize:13, color:'var(--ink)', letterSpacing:'0.18em' }}>
              Cruzando el umbral…
            </span>
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span className="t-carved" style={{ fontSize:13, color:'var(--ink)', letterSpacing:'0.18em' }}>
              Entrar con Google
            </span>
          </>
        )}
      </button>

      <p style={{
        textAlign:'center', marginTop:14,
        fontSize:11, color:'rgba(232,201,113,0.6)',
        fontFamily:'IM Fell English, serif', fontStyle:'italic',
      }}>
        Al cruzar el umbral aceptas los <span style={{ color:'var(--gold)' }}>códigos del reino</span>.
      </p>
    </div>
  );
}

window.LoginScreen = LoginScreen;
