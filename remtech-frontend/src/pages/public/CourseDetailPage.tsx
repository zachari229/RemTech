import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Clock,
  BarChart3,
  Users,
  Star,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  PlayCircle,
  ShieldCheck,
  Award,
  ArrowLeft,
  X,
  Phone,
} from 'lucide-react';
import { coursesApi } from '../../api/courses.api';
import { ordersApi } from '../../api/orders.api';
import { useAuthStore } from '../../store/auth.store';
import type { Course } from '../../types';

const LEVEL_LABELS: Record<string, string> = {
  DEBUTANT: 'Débutant',
  INTERMEDIAIRE: 'Intermédiaire',
  AVANCE: 'Avancé',
};

const levelColors: Record<string, string> = {
  DEBUTANT: '#10B981',
  INTERMEDIAIRE: '#F97316',
  AVANCE: '#EF4444',
};

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [course, setCourse] = useState<Course | null>(null);
const [loading, setLoading] = useState(true);
const [notFound, setNotFound] = useState(false);
const [openModule, setOpenModule] = useState<number | null>(0);
const [isBuying, setIsBuying] = useState(false);
const [showPurchaseModal, setShowPurchaseModal] = useState(false);
const [countryCode, setCountryCode] = useState('BJ');
const [phoneNumber, setPhoneNumber] = useState('');
const [phoneError, setPhoneError] = useState('');
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    coursesApi
      .getBySlug(slug)
      .then((data) => setCourse(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

const COUNTRY_OPTIONS = [
  { code: 'BJ', label: '🇧🇯 Bénin (+229)' },
  { code: 'CI', label: "🇨🇮 Côte d'Ivoire (+225)" },
  { code: 'SN', label: '🇸🇳 Sénégal (+221)' },
  { code: 'TG', label: '🇹🇬 Togo (+228)' },
  { code: 'BF', label: '🇧🇫 Burkina Faso (+226)' },
  { code: 'ML', label: '🇲🇱 Mali (+223)' },
  { code: 'NE', label: '🇳🇪 Niger (+227)' },
];

const handleBuy = () => {
  if (!isAuthenticated) {
    toast.error('Connectez-vous pour acheter cette formation');
    navigate('/login');
    return;
  }
  setShowPurchaseModal(true);
};

const handleConfirmPurchase = async () => {
  if (!course) return;

  const cleanedPhone = phoneNumber.trim().replace(/\s+/g, '');
  if (!/^[0-9]{6,12}$/.test(cleanedPhone)) {
    setPhoneError('Numéro de téléphone invalide');
    return;
  }
  setPhoneError('');
  setIsBuying(true);

  try {
    const result = await ordersApi.create({
      courseId: course.id,
      phoneNumber: cleanedPhone,
      countryCode,
    });

    if (result.paymentUrl) {
      window.location.href = result.paymentUrl;
    } else {
      toast.success('Commande créée avec succès');
      setShowPurchaseModal(false);
    }
  } catch (err: any) {
    const message =
      err?.response?.data?.message || 'Erreur lors de la création de la commande';
    toast.error(message);
  } finally {
    setIsBuying(false);
  }
};

  // ── États de chargement / erreur ──
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #E2E8F0', borderTopColor: '#F97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '0 5%' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>
            Formation introuvable
          </h1>
          <p style={{ color: '#64748B', fontSize: 15, marginBottom: 28 }}>
            Cette formation n'existe pas ou a été retirée du catalogue.
          </p>
          <Link
            to="/formations"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F97316', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14 }}
          >
            <ArrowLeft size={16} /> Retour aux formations
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = course.media?.find((m) => m.isPrimary)?.url || course.media?.[0]?.url;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#fff' }}>

      <style>{`
        @media (max-width: 968px) {
          .detail-grid { grid-template-columns: 1fr !important; }
          .sidebar-card { position: static !important; margin-top: 32px; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)', padding: '110px 5% 50px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Fil d'ariane */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Accueil</Link>
            <ChevronRight size={13} />
            <Link to="/formations" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Formations</Link>
            <ChevronRight size={13} />
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{course.title}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: 760 }}
          >
            {course.category && (
              <span style={{ color: '#F97316', fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                {course.category.name}
              </span>
            )}
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
                color: '#fff',
                marginTop: 8,
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              {course.title}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15.5, lineHeight: 1.7, marginBottom: 24 }}>
              {course.shortDescription}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.75)', fontSize: 13.5 }}>
                <Clock size={15} /> {course.duration}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.75)', fontSize: 13.5 }}>
                <BarChart3 size={15} /> {LEVEL_LABELS[course.level] || course.level}
              </span>
              {course._count?.enrollments !== undefined && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.75)', fontSize: 13.5 }}>
                  <Users size={15} /> {course._count.enrollments} étudiants
                </span>
              )}
              {course._count?.reviews !== undefined && course._count.reviews > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.75)', fontSize: 13.5 }}>
                  <Star size={15} fill="#F97316" color="#F97316" /> {course._count.reviews} avis
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Contenu principal ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 5%' }}>
        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start' }}>

          {/* Colonne gauche */}
          <div>
            {/* Image principale */}
            {mainImage && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 40, boxShadow: '0 8px 32px rgba(10,22,40,0.1)' }}
              >
                <img src={mainImage} alt={course.title} style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }} />
              </motion.div>
            )}

            {/* Description complète */}
            <section style={{ marginBottom: 44 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>
                Description
              </h2>
              <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {course.fullDescription}
              </p>
            </section>

            {/* Objectifs */}
            {course.objectives?.length > 0 && (
              <section style={{ marginBottom: 44 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#0A1628', marginBottom: 20 }}>
                  Ce que vous allez apprendre
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {course.objectives.map((obj, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ color: '#334155', fontSize: 14.5, lineHeight: 1.6 }}>{obj}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Programme */}
            {course.program?.length > 0 && (
              <section style={{ marginBottom: 44 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#0A1628', marginBottom: 20 }}>
                  Programme de la formation
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {course.program.map((mod, i) => (
                    <div
                      key={i}
                      style={{ border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}
                    >
                      <button
                        onClick={() => setOpenModule(openModule === i ? null : i)}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: openModule === i ? '#F8FAFC' : '#fff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14.5, fontWeight: 600, color: '#0A1628' }}>
                          <PlayCircle size={18} color="#F97316" />
                          Module {i + 1} — {mod.title}
                        </span>
                        <ChevronDown
                          size={18}
                          color="#94A3B8"
                          style={{ transform: openModule === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                        />
                      </button>
                      {openModule === i && (
                        <div style={{ padding: '4px 20px 18px 52px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {mod.lessons.map((lesson, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#64748B' }}>
                              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#CBD5E1' }} />
                              {lesson}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prérequis */}
            {course.prerequisites?.length > 0 && (
              <section>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>
                  Prérequis
                </h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 0, listStyle: 'none' }}>
                  {course.prerequisites.map((req, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#475569', fontSize: 14.5, lineHeight: 1.6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316', marginTop: 7, flexShrink: 0 }} />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Colonne droite — carte achat */}
          <div className="sidebar-card" style={{ position: 'sticky', top: 100 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                background: '#fff',
                borderRadius: 18,
                border: '1px solid #E2E8F0',
                boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
                padding: 28,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, color: '#0A1628' }}>
                  {course.price.toLocaleString()}
                </span>
                <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 500 }}>FCFA</span>
              </div>
              <p style={{ fontSize: 12.5, color: '#94A3B8', marginBottom: 24 }}>Accès à vie • Certificat inclus</p>

              <motion.button
                onClick={handleBuy}
                disabled={isBuying}
                whileHover={{ scale: isBuying ? 1 : 1.02 }}
                whileTap={{ scale: isBuying ? 1 : 0.98 }}
                style={{
                  width: '100%',
                  padding: '15px',
                  borderRadius: 10,
                  border: 'none',
                  background: isBuying ? '#94A3B8' : '#F97316',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: isBuying ? 'not-allowed' : 'pointer',
                  marginBottom: 12,
                  boxShadow: isBuying ? 'none' : '0 8px 24px rgba(249,115,22,0.3)',
                }}
              >
                Acheter cette formation
              </motion.button>

              <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginBottom: 24 }}>
                Paiement sécurisé • Satisfait ou remboursé 7 jours
              </p>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Clock size={16} color="#94A3B8" />
                  <span style={{ fontSize: 13.5, color: '#475569' }}>{course.duration} de contenu</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <BarChart3 size={16} color="#94A3B8" />
                  <span style={{ fontSize: 13.5, color: '#475569' }}>Niveau {LEVEL_LABELS[course.level] || course.level}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Award size={16} color="#94A3B8" />
                  <span style={{ fontSize: 13.5, color: '#475569' }}>Certificat de réussite</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ShieldCheck size={16} color="#94A3B8" />
                  <span style={{ fontSize: 13.5, color: '#475569' }}>Accès illimité à vie</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* ── Modal d'achat ── */}
      {showPurchaseModal && course && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isBuying && setShowPurchaseModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,22,40,0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '0 5%',
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            style={{
              background: '#fff',
              borderRadius: 18,
              width: '100%',
              maxWidth: 420,
              padding: 32,
              boxShadow: '0 20px 60px rgba(10,22,40,0.25)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => !isBuying && setShowPurchaseModal(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                padding: 4,
              }}
            >
              <X size={20} />
            </button>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24,
                fontWeight: 700,
                color: '#0A1628',
                marginBottom: 6,
              }}
            >
              Finaliser l'achat
            </h2>
            <p style={{ fontSize: 13.5, color: '#64748B', marginBottom: 24, lineHeight: 1.6 }}>
              {course.title} — <strong style={{ color: '#0A1628' }}>{course.price.toLocaleString()} FCFA</strong>
            </p>

            <label style={{ fontSize: 12.5, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
              Numéro de téléphone
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: phoneError ? 6 : 20 }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  padding: '0 10px',
                  fontSize: 13.5,
                  color: '#0A1628',
                  background: '#fff',
                  outline: 'none',
                  flexShrink: 0,
                  width: 140,
                }}
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>

              <div style={{ position: 'relative', flex: 1 }}>
                <Phone size={15} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="97 00 00 00"
                  style={{
                    width: '100%',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    padding: '11px 12px 11px 36px',
                    fontSize: 14,
                    color: '#0A1628',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {phoneError && (
              <p style={{ color: '#EF4444', fontSize: 12.5, marginBottom: 14 }}>{phoneError}</p>
            )}

            <motion.button
              onClick={handleConfirmPurchase}
              disabled={isBuying}
              whileHover={{ scale: isBuying ? 1 : 1.02 }}
              whileTap={{ scale: isBuying ? 1 : 0.98 }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 10,
                border: 'none',
                background: isBuying ? '#94A3B8' : '#F97316',
                color: '#fff',
                fontSize: 14.5,
                fontWeight: 700,
                cursor: isBuying ? 'not-allowed' : 'pointer',
                boxShadow: isBuying ? 'none' : '0 8px 24px rgba(249,115,22,0.3)',
              }}
            >
              {isBuying ? 'Création de la commande...' : 'Procéder au paiement'}
            </motion.button>

            <p style={{ textAlign: 'center', fontSize: 11.5, color: '#94A3B8', marginTop: 14 }}>
              Vous serez redirigé vers une page de paiement sécurisée
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}