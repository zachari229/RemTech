import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Star, Users, ChevronRight } from 'lucide-react';
import type { Course } from '../../types';

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

function isNew(createdAt: string) {
  const diffDays = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 14;
}

// Conservé : utilisé dans la section Témoignages de la HomePage
export function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill={i < rating ? '#F97316' : 'transparent'} color="#F97316" />
      ))}
    </div>
  );
}

export default function CourseCard({ course, index }: { course: Course; index: number }) {
  const primaryImage =
    course.media?.find((m) => m.isPrimary && m.type === 'IMAGE') ||
    course.media?.find((m) => m.type === 'IMAGE');

  const enrollments = course._count?.enrollments ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(10,22,40,0.08)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        border: '1px solid rgba(10,22,40,0.06)',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
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
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 48,
                color: 'rgba(255,255,255,0.15)',
                fontWeight: 700,
              }}
            >
              {course.title.charAt(0)}
            </span>
          </div>
        )}

        {isNew(course.createdAt) && (
          <span
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: '#F97316',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 20,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Nouveau
          </span>
        )}

        <span
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(10,22,40,0.75)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Clock size={11} /> {course.duration}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: levelColors[course.level],
              background: `${levelColors[course.level]}18`,
              padding: '3px 8px',
              borderRadius: 20,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {levelLabels[course.level] || course.level}
          </span>
          {course.category?.name && (
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{course.category.name}</span>
          )}
        </div>

        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20,
            fontWeight: 700,
            color: '#0A1628',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {course.title}
        </h3>

        <p style={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.6, margin: 0, flex: 1 }}>
          {course.shortDescription}
        </p>

        {enrollments > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94A3B8', paddingTop: 4 }}>
            <Users size={12} />
            <span style={{ fontSize: 12 }}>
              {enrollments.toLocaleString('fr-FR')} inscrit{enrollments > 1 ? 's' : ''}
            </span>
          </div>
        )}
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
        <Link to={`/formations/${course.slug}`} style={{ textDecoration: 'none' }}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: '#F97316',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Voir les détails <ChevronRight size={14} />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}