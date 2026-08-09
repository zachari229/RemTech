import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Trash2, MessageSquare, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewsApi } from '../../api/reviews.api';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reload = () => {
    reviewsApi.getAll().then(setReviews).catch(() => setReviews([]));
  };

  useEffect(() => {
    reload();
  }, []);

  const filtered = reviews.filter((r) => {
    if (filter === 'pending') return !r.isVisible;
    if (filter === 'approved') return r.isVisible;
    return true;
  });

  const handleApprove = async (id: number) => {
    try {
      await reviewsApi.approve(id);
      toast.success('Avis approuvé');
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet avis définitivement ?')) return;
    try {
      await reviewsApi.remove(id);
      toast.success('Avis supprimé');
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erreur');
    }
  };

  const openReply = (id: number, existing?: string) => {
    setReplyingId(id);
    setReplyText(existing || '');
  };

  const closeReply = () => {
    setReplyingId(null);
    setReplyText('');
  };

  const submitReply = async (id: number) => {
    if (!replyText.trim()) {
      toast.error('Écrivez une réponse avant d\'envoyer');
      return;
    }
    setSubmitting(true);
    try {
      await reviewsApi.reply(id, replyText.trim());
      toast.success('Réponse envoyée');
      closeReply();
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  const filterTabs = [
    { id: 'all', label: 'Tous', count: reviews.length },
    { id: 'pending', label: 'En attente', count: reviews.filter((r) => !r.isVisible).length },
    { id: 'approved', label: 'Approuvés', count: reviews.filter((r) => r.isVisible).length },
  ] as const;

  return (
    <div>
      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: `1.5px solid ${filter === tab.id ? '#F97316' : '#E2E8F0'}`,
              background: filter === tab.id ? '#FFF3E8' : '#fff',
              color: filter === tab.id ? '#F97316' : '#64748B',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 16, padding: '60px 40px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <Star size={40} style={{ color: '#E2E8F0', marginBottom: 12 }} />
          <p style={{ color: '#94A3B8', fontSize: 14 }}>Aucun avis dans cette catégorie.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #E2E8F0' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {r.user?.firstName?.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', margin: 0 }}>
                        {r.user?.firstName} {r.user?.lastName}
                      </p>
                      <p style={{ fontSize: 11.5, color: '#94A3B8', margin: '1px 0 0' }}>{r.user?.email}</p>
                    </div>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: 20,
                        background: r.isVisible ? '#D1FAE5' : '#FEF3C7',
                        color: r.isVisible ? '#10B981' : '#F59E0B',
                        whiteSpace: 'nowrap',
                        marginLeft: 12,
                      }}
                    >
                      {r.isVisible ? 'Approuvé' : 'En attente'}
                    </span>
                  </div>

                  <p style={{ fontSize: 12, color: '#1B4BAA', fontWeight: 600, margin: '6px 0 4px' }}>
                    {r.course?.title}
                  </p>

                  <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={14}
                        fill={idx < r.rating ? '#F97316' : 'none'}
                        color={idx < r.rating ? '#F97316' : '#E2E8F0'}
                      />
                    ))}
                  </div>

                  <p style={{ fontSize: 13.5, color: '#334155', margin: '0 0 12px', lineHeight: 1.6 }}>
                    {r.comment}
                  </p>

                  {r.reply && replyingId !== r.id && (
                    <div style={{ background: '#F8FAFC', borderLeft: '3px solid #F97316', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#F97316', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Réponse de l'équipe
                      </p>
                      <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5 }}>{r.reply}</p>
                    </div>
                  )}

                  {replyingId === r.id ? (
                    <div style={{ marginBottom: 12 }}>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Écrivez votre réponse..."
                        rows={3}
                        style={{
                          width: '100%',
                          border: '1.5px solid #E2E8F0',
                          borderRadius: 10,
                          padding: '10px 14px',
                          fontSize: 13,
                          color: '#0F172A',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          marginBottom: 8,
                        }}
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => submitReply(r.id)}
                          disabled={submitting}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '8px 16px', background: submitting ? '#94A3B8' : '#F97316',
                            color: '#fff', border: 'none', borderRadius: 8, cursor: submitting ? 'not-allowed' : 'pointer',
                            fontSize: 12, fontWeight: 700,
                          }}
                        >
                          <Send size={13} /> {submitting ? 'Envoi...' : 'Envoyer'}
                        </button>
                        <button
                          onClick={closeReply}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '8px 16px', background: 'transparent',
                            border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer',
                            fontSize: 12, fontWeight: 600, color: '#64748B',
                          }}
                        >
                          <X size={13} /> Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 14 }}>
                      {!r.isVisible && (
                        <button
                          onClick={() => handleApprove(r.id)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', color: '#10B981', padding: 0 }}
                        >
                          <CheckCircle2 size={13} /> Approuver
                        </button>
                      )}
                      <button
                        onClick={() => openReply(r.id, r.reply)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', color: '#1B4BAA', padding: 0 }}
                      >
                        <MessageSquare size={13} /> {r.reply ? 'Modifier la réponse' : 'Répondre'}
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444', padding: 0 }}
                      >
                        <Trash2 size={13} /> Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}