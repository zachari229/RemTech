import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#0A1628', padding: '60px 5% 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 48,
            paddingBottom: 48,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 32,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #F97316, #FB923C)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Zap size={20} color="#fff" />
              </div>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                Rem<span style={{ color: '#F97316' }}>Tech</span>
              </span>
            </div>
            <p
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: 16,
                lineHeight: 1.7,
                maxWidth: 280,
              }}
            >
              La plateforme de référence pour les formations digitales en Afrique
              francophone. Pratique, accessible, transformatrice.
            </p>
          </div>

          {/* Colonnes de liens */}
          {[
            {
              title: 'Plateforme',
              links: [
                { label: 'Formations', to: '/formations' },
                { label: 'Catégories', to: '/' },
                { label: 'Contact', to: '/contact' },
              ],
            },
            {
              title: 'Support',
              links: [
                { label: 'Contact', to: '/contact' },
                { label: 'FAQ', to: '/' },
                { label: 'Mentions légales', to: '/' },
              ],
            },
            {
              title: 'Compte',
              links: [
                { label: 'Connexion', to: '/login' },
                { label: 'Inscription', to: '/register' },
                { label: 'Mon espace', to: '/admin' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  color: '#fff',
                  fontSize: 24,
                  fontWeight: 700,
                  marginBottom: 16,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      style={{
                        color: 'rgba(255,255,255,0.45)',
                        textDecoration: 'none',
                        fontSize: 16,
                        transition: 'color 0.2s',
                        fontFamily: 'Inter, sans-serif',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#F97316')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16, fontFamily: 'Inter, sans-serif' }}>
            © {new Date().getFullYear()} RemTech. Tous droits réservés.
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Confidentialité', 'CGU', 'Cookies'].map((item) => (
              <Link
                key={item}
                to="/"
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: 16,
                  fontFamily: 'Inter, sans-serif',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F97316')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}