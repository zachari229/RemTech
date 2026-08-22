import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  BookOpen,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import HeroSlider from '../../components/home/HeroSlider';
import CourseCard, { StarRating } from '../../components/common/CourseCard';
import { TESTIMONIALS } from '../../data/homeData';
import { coursesApi } from '../../api/courses.api';
import type { Course } from '../../types';
import { reviewsApi } from '../../api/reviews.api';
import { categoriesApi } from '../../api/categories.api';
import type { Category } from '../../types';
import { getCategoryIcon, getCategoryColor } from '../../components/home/CategoryIcon';

export default function HomePage() {
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

      {/* ════════ HERO (slider) ════════ */}
      <HeroSlider stats={stats} />

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
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
                color: '#0376F7',
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    background: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: 14,
                    padding: '18px 20px',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
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
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0376F7', marginBottom: 3 }}>{cat.name}</div>
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
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontWeight: 700,
                  color: '#0376F7',
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
          background: 'linear-gradient(135deg, #0376F7, #0257C4)',
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
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
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
              { icon: <BookOpen size={28} />, title: 'Contenu 100% pratique', text: 'Chaque formation est construite autour de projets concrets. Vous apprenez en faisant, pas en regardant.', accent: '#FF6B00' },
              { icon: <UserCheck size={28} />, title: 'Suivi & Coaching', text: 'Bénéficiez gratuitement d’un accompagnement complet après votre formation, avec un suivi personnalisé jusqu’à l’obtention de votre tout premier client.', accent: '#FF8A1F' },
              { icon: <Users size={28} />, title: 'Communauté active', text: 'Rejoignez plus de 1 200 apprenants francophones. Entraide, partage de projets et opportunités pro.', accent: '#FFB347' },
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
                    fontFamily: 'Manrope, sans-serif',
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
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
                color: '#0376F7',
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
                      background: 'linear-gradient(135deg, #0376F7, #0257C4)',
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
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0376F7' }}>{t.name}</div>
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
              background: 'linear-gradient(135deg, #0376F7, #0257C4)',
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
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
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