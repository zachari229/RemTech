import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Award, TrendingUp, Play,
  ChevronRight, Bell, User, LogOut, BarChart3,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../../api/users.api';
import { notificationsApi } from '../../api/notifications.api';

interface EnrolledCourse {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  duration: string;
  level: string;
  media?: { url: string; isPrimary: boolean }[];
  category?: { name: string };
}

interface Enrollment {
  id: number;
  enrolledAt: string;
  course: EnrolledCourse;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const levelLabels: Record<string, string> = {
  DEBUTANT: 'Débutant',
  INTERMEDIAIRE: 'Intermédiaire',
  AVANCE: 'Avancé',
};

const levelColors: Record<string, string> = {
  DEBUTANT: '#10B981',
  INTERMEDIAIRE: '#F97316',
  AVANCE: '#EF4444',
};

export default function StudentDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'formations' | 'notifications' | 'profil'>('formations');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      usersApi.getMyEnrollments().catch(() => []),
      notificationsApi.getAll().catch(() => []),
    ]).then(([enr, notifs]) => {
      setEnrollments(enr);
      setNotifications(notifs);
    }).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Calcul des heures totales à partir des durées
  const totalHours = enrollments.reduce((acc, enr) => {
    const match = enr.course.duration?.match(/(\d+)/);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0);

  const stats = [
    { icon: BookOpen, label: 'Formations', value: enrollments.length, color: '#1B4BAA' },
    { icon: Clock, label: 'Heures de contenu', value: `${totalHours}h`, color: '#F97316' },
    { icon: Award, label: 'Certifications', value: enrollments.length, color: '#10B981' },
    { icon: TrendingUp, label: 'Formations actives', value: enrollments.length, color: '#8B5CF6' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F6F8FC', fontFamily: 'Inter, sans-serif' }}>

      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: '#0A1628',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        padding: '28px 0',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '0 24px 32px' }}>
          <div style={{ width: 34, height: 34, background: '#F97316', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#fff' }}>
            Rem<span style={{ color: '#F97316' }}>Tech</span>
          </span>
        </Link>

        <div style={{ margin: '0 16px 28px', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: '#F97316',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: '#fff',
            }}>
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, margin: 0 }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>Étudiant</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { id: 'formations', icon: BookOpen, label: 'Mes formations' },
            { id: 'notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
            { id: 'profil', icon: User, label: 'Mon profil' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 10,
                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                background: activeTab === item.id ? 'rgba(249,115,22,0.15)' : 'transparent',
                color: activeTab === item.id ? '#F97316' : 'rgba(255,255,255,0.65)',
                fontSize: 14, fontWeight: activeTab === item.id ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              <item.icon size={18} />
              {item.label}
              {item.badge ? (
                <span style={{
                  marginLeft: 'auto', background: '#F97316', color: '#fff',
                  fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
                }}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 12px 0' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 10,
              border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
              background: 'transparent',
              color: 'rgba(255,255,255,0.45)',
              fontSize: 14,
              transition: 'all 0.2s',
            }}
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 260, flex: 1, padding: '36px 40px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 32, fontWeight: 700, color: '#0A1628', margin: '0 0 6px',
          }}>
            Bonjour, {user?.firstName} 
          </h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>
            Bienvenue dans votre espace d'apprentissage personnel.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 36 }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: '#fff', borderRadius: 14, padding: '20px 22px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(10,22,40,0.05)',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${stat.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
              }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <p style={{ fontSize: 26, fontWeight: 700, color: '#0A1628', margin: '0 0 4px', fontFamily: "'Cormorant Garamond', serif" }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ===== MES FORMATIONS ===== */}
        {activeTab === 'formations' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#0A1628', margin: 0 }}>
                Mes formations
              </h2>
              <Link to="/formations" style={{ fontSize: 13, fontWeight: 600, color: '#F97316', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Découvrir plus <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#94A3B8' }}>Chargement...</div>
            ) : enrollments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: '#fff', borderRadius: 16, padding: '60px 40px',
                  textAlign: 'center', border: '1px solid #E2E8F0',
                }}
              >
                <BookOpen size={48} style={{ color: '#E2E8F0', marginBottom: 16 }} />
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#0A1628', marginBottom: 8 }}>
                  Aucune formation pour le moment
                </h3>
                <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 24 }}>
                  Découvrez notre catalogue et commencez votre apprentissage.
                </p>
                <Link
                  to="/formations"
                  style={{
                    background: '#F97316', color: '#fff', textDecoration: 'none',
                    padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                    display: 'inline-block',
                  }}
                >
                  Voir les formations
                </Link>
              </motion.div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {enrollments.map((enr, i) => {
                  const course = enr.course;
                  const image = course.media?.[0]?.url;
                  return (
                    <motion.div
                      key={enr.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      style={{
                        background: '#fff', borderRadius: 14, overflow: 'hidden',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 2px 8px rgba(10,22,40,0.05)',
                      }}
                    >
                      {/* Image ou fallback */}
                      <div style={{
                        height: 160, overflow: 'hidden',
                        background: image ? undefined : 'linear-gradient(135deg, #0A1628, #1E3A5F)',
                        position: 'relative',
                      }}>
                        {image ? (
                          <img
                            src={image}
                            alt={course.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={36} color="rgba(255,255,255,0.2)" />
                          </div>
                        )}
                        {/* Badge niveau */}
                        <span style={{
                          position: 'absolute', top: 10, left: 10,
                          background: levelColors[course.level] || '#94A3B8',
                          color: '#fff', fontSize: 10, fontWeight: 700,
                          padding: '3px 9px', borderRadius: 20,
                          textTransform: 'uppercase', letterSpacing: 0.5,
                        }}>
                          {levelLabels[course.level] || course.level}
                        </span>
                        {/* Badge "Inscrit" */}
                        <span style={{
                          position: 'absolute', top: 10, right: 10,
                          background: 'rgba(16,185,129,0.9)',
                          color: '#fff', fontSize: 10, fontWeight: 700,
                          padding: '3px 9px', borderRadius: 20,
                        }}>
                          ✓ Inscrit
                        </span>
                      </div>

                      {/* Body */}
                      <div style={{ padding: '18px 20px' }}>
                        <h3 style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 18, fontWeight: 700, color: '#0A1628',
                          margin: '0 0 8px', lineHeight: 1.3,
                        }}>
                          {course.title}
                        </h3>

                        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 14px', lineHeight: 1.5 }}>
                          {course.shortDescription}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={13} /> {course.duration}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <BarChart3 size={13} /> {levelLabels[course.level] || course.level}
                          </span>
                        </div>

                        <p style={{ fontSize: 11, color: '#94A3B8', margin: '0 0 14px' }}>
                          Inscrit le {new Date(enr.enrolledAt).toLocaleDateString('fr-FR')}
                        </p>

                        <Link
                          to={`/formations/${course.slug}`}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: '#0A1628', color: '#fff',
                            textDecoration: 'none', padding: '10px', borderRadius: 9,
                            fontSize: 13, fontWeight: 600, width: '100%',
                            boxSizing: 'border-box',
                          }}
                        >
                          <Play size={14} /> Accéder à la formation
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===== NOTIFICATIONS ===== */}
        {activeTab === 'notifications' && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 20 }}>
              Notifications
            </h2>
            {notifications.length === 0 ? (
              <div style={{
                background: '#fff', borderRadius: 16, padding: '60px 40px',
                textAlign: 'center', border: '1px solid #E2E8F0',
              }}>
                <Bell size={40} style={{ color: '#E2E8F0', marginBottom: 12 }} />
                <p style={{ color: '#94A3B8', fontSize: 14 }}>Aucune notification pour le moment.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {notifications.map((notif, i) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      background: '#fff', borderRadius: 12, padding: '16px 20px',
                      border: `1px solid ${notif.isRead ? '#E2E8F0' : '#BFDBFE'}`,
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                      borderLeft: notif.isRead ? '1px solid #E2E8F0' : '3px solid #1B4BAA',
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                      background: notif.isRead ? '#F1F5F9' : '#EEF2FF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Bell size={16} style={{ color: notif.isRead ? '#94A3B8' : '#1B4BAA' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0A1628', margin: '0 0 4px' }}>
                        {notif.title}
                      </p>
                      <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 6px' }}>
                        {notif.message}
                      </p>
                      <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>
                        {new Date(notif.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1B4BAA', marginTop: 4, flexShrink: 0 }} />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== PROFIL ===== */}
        {activeTab === 'profil' && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 20 }}>
              Mon profil
            </h2>
            <div style={{
              background: '#fff', borderRadius: 16, padding: '32px',
              border: '1px solid #E2E8F0', maxWidth: 560,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid #F1F5F9' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: '#0A1628',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 700, color: '#fff',
                  fontFamily: "'Cormorant Garamond', serif",
                }}>
                  {user?.firstName?.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#0A1628', margin: '0 0 4px' }}>
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>Étudiant RemTech</p>
                </div>
              </div>

              {[
                { label: 'Prénom', value: user?.firstName },
                { label: 'Nom', value: user?.lastName },
                { label: 'Email', value: user?.email },
                { label: 'Téléphone', value: user?.phone || 'Non renseigné' },
                { label: 'Formations achetées', value: enrollments.length },
              ].map((field, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                    {field.label}
                  </p>
                  <p style={{ fontSize: 15, color: '#0A1628', fontWeight: 500, margin: 0, padding: '10px 14px', background: '#F8FAFC', borderRadius: 8 }}>
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}