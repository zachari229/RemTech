import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, BarChart3, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { coursesApi } from '../../api/courses.api';
import { categoriesApi } from '../../api/categories.api';
import type { Course } from '../../types';
import type { Category } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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

function formatPrice(price: number | string) {
  return Number(price).toLocaleString('fr-FR') + ' FCFA';
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    Promise.all([coursesApi.getAll(), categoriesApi.getAll()])
      .then(([c, cats]) => {
        setCourses(c);
        setCategories(cats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    const matchSearch =
      search === '' ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.shortDescription || '').toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === null || c.categoryId === selectedCategory;
    const matchLevel = selectedLevel === null || c.level === selectedLevel;
    return matchSearch && matchCategory && matchLevel;
  });

  return (
    <div style={{ backgroundColor: '#F6F8FC', minHeight: '100vh', paddingTop: 0 }}>
      {/* Header */}
      <div style={{ background: '#0A1628', padding: '150px 5% 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: '#fff',
              marginBottom: 12,
            }}
          >
            Toutes nos formations
          </motion.h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, marginBottom: 32 }}>
            {courses.length} formation{courses.length > 1 ? 's' : ''} disponible{courses.length > 1 ? 's' : ''}
          </p>

          {/* Barre de recherche */}
          <div style={{ position: 'relative', maxWidth: 520 }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
            />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 46px',
                borderRadius: 12,
                border: 'none',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 14,
                outline: 'none',
                backdropFilter: 'blur(8px)',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 5%' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>

          {/* Sidebar filtres — desktop */}
          <aside
            style={{
              width: 240,
              flexShrink: 0,
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              border: '1px solid #E2E8F0',
              position: 'sticky',
              top: 100,
            }}
            className="filters-sidebar"
          >
            <p style={{ fontWeight: 700, fontSize: 14, color: '#0A1628', marginBottom: 20 }}>
              Filtres
            </p>

            {/* Catégories */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                Catégorie
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: selectedCategory === null ? 600 : 400,
                    background: selectedCategory === null ? '#EEF2FF' : 'transparent',
                    color: selectedCategory === null ? '#0A1628' : '#64748B',
                  }}
                >
                  Toutes
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: selectedCategory === cat.id ? 600 : 400,
                      background: selectedCategory === cat.id ? '#EEF2FF' : 'transparent',
                      color: selectedCategory === cat.id ? '#0A1628' : '#64748B',
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Niveau */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                Niveau
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => setSelectedLevel(null)}
                  style={{
                    textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: selectedLevel === null ? 600 : 400,
                    background: selectedLevel === null ? '#EEF2FF' : 'transparent',
                    color: selectedLevel === null ? '#0A1628' : '#64748B',
                  }}
                >
                  Tous
                </button>
                {['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    style={{
                      textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: selectedLevel === lvl ? 600 : 400,
                      background: selectedLevel === lvl ? '#EEF2FF' : 'transparent',
                      color: selectedLevel === lvl ? '#0A1628' : '#64748B',
                    }}
                  >
                    {levelLabels[lvl]}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grille formations */}
          <div style={{ flex: 1 }}>
            {/* Bouton filtre mobile */}
            <button
              className="filters-toggle"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'none',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16,
                padding: '10px 16px',
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                background: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                color: '#0A1628',
              }}
            >
              <SlidersHorizontal size={16} /> Filtres
            </button>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                <LoadingSpinner size="lg" />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#94A3B8' }}>
                <Search size={40} style={{ marginBottom: 16, opacity: 0.4 }} />
                <p style={{ fontSize: 16 }}>Aucune formation trouvée.</p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 24,
                }}
              >
                {filtered.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      overflow: 'hidden',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 12px rgba(10,22,40,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Image */}
 
<div style={{ height: 180, background: '#E2E8F0', position: 'relative', overflow: 'hidden' }}>
  {(() => {
    const primaryImage =
      course.media?.find((m) => m.isPrimary && m.type === 'IMAGE') ||
      course.media?.find((m) => m.type === 'IMAGE');
    return primaryImage ? (
      <img
        src={primaryImage.url}
        alt={course.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    ) : (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
     <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, color: 'rgba(255,255,255,0.15)', fontWeight: 700 }}>
        {course.title.charAt(0)}
      </span>
    </div>
    );
  })()}
  <span
    style={{
      position: 'absolute', top: 12, left: 12,
      background: levelColors[course.level] || '#94A3B8',
      color: '#fff', fontSize: 11, fontWeight: 700,
      padding: '4px 10px', borderRadius: 20,
      textTransform: 'uppercase', letterSpacing: 0.5,
    }}
  >
    {levelLabels[course.level] || course.level}
  </span>
</div>

                    {/* Body */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, margin: 0 }}>
                        {course.category?.name || ''}
                      </p>
                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 20, fontWeight: 700,
                          color: '#0A1628', lineHeight: 1.3, margin: 0,
                        }}
                      >
                        {course.title}
                      </h3>
                      <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: 0, flex: 1 }}>
                        {course.shortDescription}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#94A3B8' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={13} /> {course.duration}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <BarChart3 size={13} /> {levelLabels[course.level] || course.level}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div
                      style={{
                        padding: '14px 20px',
                        borderTop: '1px solid #F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#0A1628' }}>
                        {formatPrice(course.price)}
                      </span>
                      <Link
                        to={`/formations/${course.slug}`}
                        style={{
                          background: '#F97316',
                          color: '#fff',
                          textDecoration: 'none',
                          fontSize: 13,
                          fontWeight: 600,
                          padding: '9px 18px',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        Voir <ChevronRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .filters-sidebar { display: none !important; }
          .filters-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
}