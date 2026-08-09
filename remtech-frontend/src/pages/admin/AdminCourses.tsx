import { Link } from 'react-router-dom';
import { Eye, Trash2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { coursesApi } from '../../api/courses.api';

interface AdminCoursesProps {
  courses: any[];
  onEdit: (course: any) => void;
  onCreateFirst: () => void;
  reload: () => void;
}

export default function AdminCourses({ courses, onEdit, onCreateFirst, reload }: AdminCoursesProps) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F8FAFC' }}>
            {['Titre', 'Catégorie', 'Prix', 'Niveau', 'Statut', 'Actions'].map(h => (
              <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id} style={{ borderTop: '1px solid #F1F5F9' }}>
              <td style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0A1628', margin: 0 }}>{c.title}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{c.duration}</p>
              </td>
              <td style={{ padding: '14px 16px', fontSize: 12, color: '#64748B' }}>{c.category?.name || '—'}</td>
              <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#0A1628' }}>{Number(c.price).toLocaleString()} FCFA</td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#F1F5F9', color: '#64748B' }}>{c.level}</span>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: c.status === 'PUBLIE' ? '#D1FAE5' : '#FEF3C7', color: c.status === 'PUBLIE' ? '#10B981' : '#F59E0B' }}>
                  {c.status === 'PUBLIE' ? 'Publié' : 'Brouillon'}
                </span>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/formations/${c.slug}`} style={{ color: '#1B4BAA', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                    <Eye size={14} /> Voir
                  </Link>

                  <button
                    onClick={() => onEdit(c)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', color: '#1B4BAA', padding: 0 }}>
                    Modifier
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        if (c.status === 'PUBLIE') await coursesApi.unpublish(c.id);
                        else await coursesApi.publish(c.id);
                        reload();
                        toast.success(c.status === 'PUBLIE' ? 'Formation dépubliée' : 'Formation publiée !');
                      } catch { toast.error('Erreur'); }
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', color: c.status === 'PUBLIE' ? '#F59E0B' : '#10B981', padding: 0 }}>
                    {c.status === 'PUBLIE' ? '⏸ Dépublier' : '▶ Publier'}
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('Supprimer cette formation ?')) return;
                      try { await coursesApi.remove(c.id); reload(); toast.success('Formation supprimée'); } catch { toast.error('Erreur'); }
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444', padding: 0 }}>
                    <Trash2 size={13} /> Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {courses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
          <BookOpen size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p style={{ marginBottom: 16 }}>Aucune formation créée.</p>
          <button onClick={onCreateFirst} style={{ background: '#F97316', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            + Créer la première formation
          </button>
        </div>
      )}
    </div>
  );
}