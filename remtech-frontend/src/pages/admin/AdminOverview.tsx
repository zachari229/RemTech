import { motion } from 'framer-motion';
import { BookOpen, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import type { Stats } from '../../components/admin/admin.types';

interface AdminOverviewProps {
  stats: Stats;
  courses: any[];
  contacts: any[];
  onGoToCourses: () => void;
  onGoToContacts: () => void;
  onCreateFirstCourse: () => void;
}

export default function AdminOverview({ stats, courses, contacts, onGoToCourses, onGoToContacts, onCreateFirstCourse }: AdminOverviewProps) {
  const statCards = [
    { icon: BookOpen, label: 'Formations', value: stats.courses, color: '#1B4BAA', bg: '#EEF2FF' },
    { icon: Users, label: 'Utilisateurs', value: stats.users, color: '#10B981', bg: '#D1FAE5' },
    { icon: ShoppingCart, label: 'Commandes', value: stats.orders, color: '#F97316', bg: '#FFF3E8' },
    { icon: TrendingUp, label: 'Revenus', value: stats.revenue.toLocaleString('fr-FR') + ' FCFA', color: '#8B5CF6', bg: '#EDE9FE' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            style={{ background: '#fff', borderRadius: 14, padding: '22px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(10,22,40,0.05)' }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: '#0A1628', margin: '0 0 4px' }}>{s.value}</p>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: '#0A1628', margin: 0 }}>Formations récentes</h3>
            <button onClick={onGoToCourses} style={{ fontSize: 12, color: '#F97316', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Voir tout</button>
          </div>
          {courses.slice(0, 4).map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid #F1F5F9' : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={16} color="#F97316" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0A1628', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{Number(c.price).toLocaleString()} FCFA</p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: c.status === 'PUBLIE' ? '#D1FAE5' : '#FEF3C7', color: c.status === 'PUBLIE' ? '#10B981' : '#F59E0B', textTransform: 'uppercase' }}>
                {c.status === 'PUBLIE' ? 'Publié' : 'Brouillon'}
              </span>
            </div>
          ))}
          {courses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <p style={{ color: '#94A3B8', fontSize: 13, margin: '0 0 12px' }}>Aucune formation créée.</p>
              <button onClick={onCreateFirstCourse}
                style={{ background: '#F97316', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                + Créer la première
              </button>
            </div>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: '#0A1628', margin: 0 }}>Messages récents</h3>
            <button onClick={onGoToContacts} style={{ fontSize: 12, color: '#F97316', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Voir tout</button>
          </div>
          {contacts.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>Aucun message</p>
          ) : contacts.slice(0, 4).map((ct, i) => (
            <div key={ct.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid #F1F5F9' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 700, color: '#1B4BAA' }}>
                {ct.name?.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0A1628', margin: 0 }}>{ct.name}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ct.subject}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}