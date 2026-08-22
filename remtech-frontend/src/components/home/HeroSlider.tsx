import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';

interface HeroStats {
  students: number;
  coursesCount: number;
  avgRating: number | null;
}

// Le composant tourne automatiquement entre toutes les images du tableau.
const backgroundImages = ['/heroimage.png', '/hero-2.png', '/hero-3.png'];

const AUTOPLAY_MS = 6000;

export default function HeroSlider({ stats }: { stats: HeroStats }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restartAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % backgroundImages.length);
    }, AUTOPLAY_MS);
  }, []);

  useEffect(() => {
    restartAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [restartAutoplay]);

  

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* Images de fond en rotation */}
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${backgroundImages[index]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>

      {/* Voile de lisibilité (dégradé bas + teinte bleue de marque) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(0deg, rgba(2,10,30,0.92) 0%, rgba(2,10,30,0.65) 32%, rgba(2,10,30,0.15) 62%, rgba(3,118,247,0.25) 100%)',
        }}
      />

      {/* Contenu (fixe, ne change pas avec les slides) */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '160px 5% 72px',
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(8px)',
              borderRadius: 24,
              padding: '6px 16px',
              marginBottom: 24,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316' }} />
            <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>
              Formations 100% pratiques
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(34px, 5vw, 52px)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.12,
              marginBottom: 20,
              letterSpacing: -1,
            }}
          >
            Maîtrisez les compétences{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #F97316, #FB923C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              digitales
            </span>{' '}
            qui transforment de vie
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 520 }}>
            Des formations premium conçues pour vous aider à acquérir des compétences concrètes et monétisables.
          </p>

          {/* CTA */}
          <div className="cta-row" style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/formations"
                style={{
                  background: '#F97316',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '14px 28px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 8px 24px rgba(249,115,22,0.35)',
                }}
              >
                Explorer les cours <ArrowRight size={16} />
              </Link>
            </motion.div>
            <Link
              to="/contact"
              style={{
                color: '#FFFFFF',
                textDecoration: 'none',
                padding: '14px 24px',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.06)',
              }}
            >
              <Phone size={15} fill="currentColor" /> Contactez nous
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-row" style={{ display: 'flex', gap: 36, alignItems: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
            {[
              { val: stats.students > 0 ? `+${stats.students}` : '+10', label: 'Étudiants formés' },
              { val: stats.coursesCount > 0 ? `+${stats.coursesCount}` : '—', label: 'Formations disponibles' },
              { val: stats.avgRating !== null ? `${stats.avgRating.toFixed(1)}/5` : '4.9/5', label: 'Note moyenne' },
            ].map((stat, i) => (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 32, fontWeight: 800, color: '#fff' }}>
                    {stat.val}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.78)', fontWeight: 500, marginTop: 2 }}>
                    {stat.label}
                  </div>
                </div>
                {i < 2 && <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.22)' }} />}
              </div>
            ))}
          </div>

        
        </div>
      </div>
    </section>
  );
}

