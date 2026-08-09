import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Phone,
  Users,
  UserCheck,
  BookOpen,
  ChevronRight,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import CourseCard, { StarRating } from '../../components/common/CourseCard';
import { TESTIMONIALS } from '../../data/homeData';
import { coursesApi } from '../../api/courses.api';
import type { Course } from '../../types';
import { reviewsApi } from '../../api/reviews.api';
import { categoriesApi } from '../../api/categories.api';
import type { Category } from '../../types';
import { getCategoryIcon, getCategoryColor } from '../../components/home/CategoryIcon';

export default function HomePage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
const [loadingCourses, setLoadingCourses] = useState(true);


const [stats, setStats] = useState({ students: 0, coursesCount: 0, avgRating: null as number | null });

const [categories, setCategories] = useState<Category[]>([]);

useEffect(() => {
  Promise.all([coursesApi.getAll(), reviewsApi.getPublicStats(), categoriesApi.getAll()])
    .then(([data, reviewStats, cats]) => {
      const published = data.filter((c) => c.status === 'PUBLIE');
      const sorted = [...published].sort(
        (a, b) => (b._count?.enrollments ?? 0) - (a._count?.enrollments ?? 0)
      );
      setFeaturedCourses(sorted.slice(0, 4));

      const totalStudents = published.reduce((sum, c) => sum + (c._count?.enrollments ?? 0), 0);
      setStats({
        students: totalStudents,
        coursesCount: published.length,
        avgRating: reviewStats.averageRating,
      });

      setCategories(cats.filter((cat) => cat.isActive));
    })
    .catch(() => setFeaturedCourses([]))
    .finally(() => setLoadingCourses(false));
}, []);
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#fff', overflowX: 'hidden' }}>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { display: none !important; }
          .courses-grid { grid-template-columns: 1fr !important; }
          .categories-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .why-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .stats-row { flex-wrap: wrap; gap: 24px !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
          .cta-row { flex-direction: column !important; align-items: stretch !important; }
          .cta-row a { width: 100%; justify-content: center; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      {/* ════════ HERO ════════ */}
      <section
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0376F7 0%, #0475F5 60%, #024EB2 100%)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 5%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Décorations fond */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '15%', right: '8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }} />
          <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.04 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <motion.div
          className="hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 60,
            alignItems: 'center',
            width: '100%',
            maxWidth: 1200,
            margin: '0 auto',
            paddingTop: 100,
            paddingBottom: 60,
            position: 'relative',
            zIndex: 1,
            y: heroY,
          }}
        >
          {/* Texte */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(15,23,42,0.35)',
                border: '1px solid rgba(249,115,22,0.4)',
                borderRadius: 24,
                padding: '6px 16px',
                marginBottom: 24,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316' }} />
              <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>
                Formations 100% pratiques
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(34px, 5vw, 52px)',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.1,
                marginBottom: 24,
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
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 520 }}
            >
              Des formations premium conçues pour vous aider à acquérir des compétences concrètes et monétisables.
            </motion.p>

            <motion.div
              className="cta-row"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 52 }}
            >
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
                to="#featured"
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
                  border: '1px solid rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                <Phone size={15} fill="currentColor" /> Contactez nous
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="stats-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ display: 'flex', gap: 36, alignItems: 'center' }}
            >
              {[
                { val: stats.students > 0 ? `+${stats.students}` : '+10', label: 'Étudiants formés' },
                 { val: stats.coursesCount > 0 ? `+${stats.coursesCount}` : '—', label: 'Formations disponibles' },
                 { val: stats.avgRating !== null ? `${stats.avgRating.toFixed(1)}/5` : '4.9/5', label: 'Note moyenne' },
                ].map((stat, i) => (
                <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 36, fontWeight: 700, color: '#fff' }}>
                      {stat.val}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500, marginTop: 2 }}>
                      {stat.label}
                    </div>
                  </div>
                  {i < 2 && (
                    <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.2)' }} />
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Visuel flottant */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ position: 'relative', height: 480 }}
          >
            {/* Carte principale */}
            <motion.div
              style={{
                position: 'absolute',
                top: 40,
                left: 20,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                borderRadius: 24,
                zIndex: 2,
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 30px 60px -15px rgba(2,20,60,0.45)',
              }}
            >
              <img
                src="/heroimage.jpg"
                alt="RemTech"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Overlay duotone signature pour unifier la photo avec la palette */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(160deg, rgba(3,118,247,0.28) 0%, rgba(2,20,60,0.1) 45%, rgba(249,115,22,0.18) 100%)',
                  mixBlendMode: 'multiply',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(2,20,60,0.55) 0%, transparent 50%)',
                }}
              />
            </motion.div>

            {/* Badge certificat */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              style={{
                position: 'absolute',
                bottom: 100,
                right: -10,
                background: 'rgba(15,23,42,0.55)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 14,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                zIndex: 3,
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={18} color="#fff" />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Certificat délivré</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>Reconnu professionnellement</div>
              </div>
            </motion.div>

            {/* Badge inscrits */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{
                position: 'absolute',
                bottom: 30,
                left: 20,
                background: 'rgba(15,23,42,0.55)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.16)',
                borderRadius: 14,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                zIndex: 3,
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={15} color="#fff" />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>+5 inscrits cette semaine</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10 }}>Rejoignez la communauté</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* ════════ CATÉGORIES ════════ */}
      <section style={{ padding: '80px 5%', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 52 }}
          >
            <span style={{ color: '#F97316', fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Domaines
            </span>
            <h2
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '40px',
                fontWeight: 700,
                color: '#0A1628',
                marginTop: 8,
                marginBottom: 12,
              }}
            >
              Explorez par catégorie
            </h2>
            <p style={{ color: '#64748B', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
              Des formations ciblées pour chaque domaine du digital.
            </p>
          </motion.div>

          <div
            className="categories-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(10,22,40,0.12)' }}
              >
                <Link
  to={`/formations?categoryId=${cat.id}`}
  style={{ /* ...inchangé... */ }}
>
  <div
    style={{
      width: 48,
      height: 48,
      borderRadius: 12,
      background: `${getCategoryColor(i)}18`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: getCategoryColor(i),
      flexShrink: 0,
    }}
  >
    {getCategoryIcon(cat.icon)}
  </div>
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 3 }}>{cat.name}</div>
    <div style={{ fontSize: 12, color: '#94A3B8' }}>
      {cat._count?.courses ?? 0} formation{(cat._count?.courses ?? 0) > 1 ? 's' : ''}
    </div>
  </div>
  <ChevronRight size={16} color="#CBD5E1" />
</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FORMATIONS EN VEDETTE ════════ */}
      <section id="featured" style={{ padding: '80px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}
          >
            <div>
              <span style={{ color: '#F97316', fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Sélection
              </span>
              <h2
                style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '40px',
                  fontWeight: 700,
                  color: '#0A1628',
                  marginTop: 8,
                }}
              >
                Formations en vedette
              </h2>
            </div>
            <Link
              to="/formations"
              style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#F97316', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
            >
              Voir toutes les formations <ArrowRight size={16} />
            </Link>
          </motion.div>

         <div
  className="courses-grid"
  style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}
>
  {loadingCourses ? (
    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94A3B8' }}>
      Chargement des formations...
    </p>
  ) : featuredCourses.length === 0 ? (
    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94A3B8' }}>
      Aucune formation disponible pour le moment.
    </p>
  ) : (
    featuredCourses.map((course, i) => (
      <CourseCard key={course.id} course={course} index={i} />
    ))
  )}
</div>
        </div>
      </section>

      {/* ════════ POURQUOI REMTECH ════════ */}
      <section
        style={{
          padding: '80px 5%',
          background: 'linear-gradient(135deg, #0A1628, #1E3A5F)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <span style={{ color: '#F97316', fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Notre différence
            </span>
            <h2
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '40px',
                fontWeight: 700,
                color: '#fff',
                marginTop: 8,
              }}
            >
              Pourquoi choisir RemTech ?
            </h2>
          </motion.div>

          <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {[
              { icon: <BookOpen size={28} />, title: 'Contenu 100% pratique', text: 'Chaque formation est construite autour de projets concrets. Vous apprenez en faisant, pas en regardant.', accent: '#F97316' },
              { icon: <UserCheck size={28} />, title: 'Suivi & Coaching', text: 'Bénéficiez gratuitement d’un accompagnement complet après votre formation, avec un suivi personnalisé jusqu’à l’obtention de votre tout premier client.', accent: '#3B82F6' },
              { icon: <Users size={28} />, title: 'Communauté active', text: 'Rejoignez plus de 1 200 apprenants francophones. Entraide, partage de projets et opportunités pro.', accent: '#10B981' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 18,
                  padding: 32,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: `${item.accent}22`,
                    color: item.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 25,
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: 12,
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: 14.5, lineHeight: 1.7 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TÉMOIGNAGES ════════ */}
      <section style={{ padding: '80px 5%', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 52 }}
          >
            <span style={{ color: '#F97316', fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Témoignages
            </span>
            <h2
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '40px',
                fontWeight: 700,
                color: '#0A1628',
                marginTop: 8,
              }}
            >
              Ce que disent nos apprenants
            </h2>
          </motion.div>

          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: 28,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(10,22,40,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <StarRating rating={t.rating} />
                <p style={{ color: '#374151', fontSize: 14.5, lineHeight: 1.7, flex: 1, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0A1628, #1E3A5F)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0A1628' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>
                      {t.role} · <span style={{ color: '#F97316' }}>{t.course}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA FINAL ════════ */}
      <section style={{ padding: '80px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              background: 'linear-gradient(135deg, #0A1628, #1E3A5F)',
              borderRadius: 24,
              padding: '56px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(249,115,22,0.2)',
                  color: '#FB923C',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '6px 16px',
                  borderRadius: 20,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginBottom: 20,
                }}
              >
                Commencez aujourd'hui
              </span>
              <h2
                style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#ffffff',
                marginTop: 8,
              }}
              >
                Investissez dans vos compétences,{' '}
                <span style={{ color: '#F97316' }}>récoltez les résultats.</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
                Rejoignez plus de 1 200 professionnels francophones qui ont fait confiance
                à RemTech pour booster leur carrière.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    to="/formations"
                    style={{
                      background: '#F97316',
                      color: '#fff',
                      textDecoration: 'none',
                      padding: '14px 32px',
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 15,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: '0 8px 24px rgba(249,115,22,0.4)',
                    }}
                  >
                    Parcourir les formations <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <Link
                  to="/contact"
                  style={{
                    border: '1px solid rgba(255,255,255,0.25)',
                    color: 'rgba(255,255,255,0.85)',
                    textDecoration: 'none',
                    padding: '14px 28px',
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}