import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Sur la HomePage, la navbar démarre transparente et devient sombre au scroll
  const isHome = location.pathname === '/';
  const isDark = !isHome || scrolled;

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 50));
    return unsub;
  }, [scrollY]);

  // Réinitialiser scrolled quand on change de page
  useEffect(() => {
    setScrolled(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = [
    { to: '/', label: 'Accueil' },
    { to: '/formations', label: 'Formations' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <motion.nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isDark ? '12px 5%' : '20px 5%',
          background: isDark
            ? 'linear-gradient(135deg, #0376F7 0%, #0257C4 100%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)',
          backdropFilter: isDark ? 'blur(16px)' : 'blur(2px)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : 'none',
          boxShadow: isDark ? '0 4px 24px rgba(3,118,247,0.25)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.35s ease',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/logo.png"
            alt="RemTech Logo"
            style={{ width: 40, height: 40, objectFit: 'contain' }}
          />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 28,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: 0.5,
              textShadow: !isDark ? '0 2px 8px rgba(0,0,0,0.35)' : 'none',
            }}
          >
            Rem<span style={{ color: '#F97316' }}>Tech</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  ...navLinkStyle,
                  color: active ? '#ffffff' : 'rgba(255,255,255,0.85)',
                  textShadow: !isDark ? '0 1px 6px rgba(255, 255, 255, 0.3)' : 'none',
                  position: 'relative',
                  paddingBottom: 6,
                }}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="navActiveDot"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: '#F97316',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth buttons */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#ffffff' }}>
          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
                style={{ ...navLinkStyle, textShadow: !isDark ? '0 1px 6px rgba(255, 255, 255, 0.3)' : 'none' }}
              >
                {user?.firstName}
              </Link>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.04, boxShadow: '0 6px 16px rgba(249,115,22,0.4)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: '#F97316',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 600,
                  padding: '7px 16px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <LogOut size={12} />
                Déconnexion
              </motion.button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: 16,
                  fontWeight: 500,
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.3)',
                  textShadow: !isDark ? '0 1px 6px rgba(0,0,0,0.3)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                Connexion
              </Link>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/register"
                  style={{
                    background: '#F97316',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: 16,
                    fontWeight: 600,
                    padding: '9px 20px',
                    borderRadius: 8,
                    display: 'inline-block',
                    boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
                  }}
                >
                  Commencer
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            display: 'none',
            alignItems: 'center',
          }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(160deg, #0376F7 0%, #022E66 100%)',
              zIndex: 99,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 32,
            }}
          >
            {links.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    ...mobileLinkStyle,
                    color: location.pathname === link.to ? '#F97316' : '#ffffff',
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ display: 'flex', gap: 12, marginTop: 16 }}
            >
              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  style={{
                    background: '#F97316', color: '#ffffff', border: 'none', fontSize: 16,
                    fontWeight: 600, padding: '10px 24px', borderRadius: 8, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <LogOut size={16} /> Déconnexion
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{ color: '#ffffff', textDecoration: 'none', fontSize: 16, padding: '10px 24px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8 }}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    style={{ background: '#F97316', color: '#ffffff', textDecoration: 'none', fontSize: 16, fontWeight: 600, padding: '10px 24px', borderRadius: 8 }}
                  >
                    Commencer
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const navLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  fontSize: 16,
  fontWeight: 500,
  letterSpacing: 0.3,
  fontFamily: 'Inter, sans-serif',
};

const mobileLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  fontSize: 20,
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
};