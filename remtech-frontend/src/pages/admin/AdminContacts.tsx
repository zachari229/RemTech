import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Trash2, Send, X, Mail, Phone, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactsApi } from '../../api/contacts.api';

export default function AdminContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reload = () => {
    contactsApi.getAll().then(setContacts).catch(() => setContacts([]));
  };

  useEffect(() => {
    reload();
  }, []);

  const filtered = contacts.filter((ct) => (filter === 'unread' ? !ct.isRead : true));
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
      await contactsApi.reply(id, replyText.trim());
      toast.success('Réponse enregistrée');
      closeReply();
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce message définitivement ?')) return;
    try {
      await contactsApi.remove(id);
      toast.success('Message supprimé');
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erreur');
    }
  };

  const filterTabs = [
    { id: 'all', label: 'Tous', count: contacts.length },
    { id: 'unread', label: 'Non lus', count: contacts.filter((ct) => !ct.isRead).length },
  ] as const;

  return (
    <div>
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

      {filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 16, padding: '60px 40px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <MessageSquare size={40} style={{ color: '#E2E8F0', marginBottom: 12 }} />
          <p style={{ color: '#94A3B8', fontSize: 14 }}>Aucun message dans cette catégorie.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((ct, i) => (
            <motion.div
              key={ct.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: '20px 24px',
                border: `1px solid ${ct.isRead ? '#E2E8F0' : '#FED7AA'}`,
                position: 'relative',
              }}
            >
              {!ct.isRead && (
                <span style={{ position: 'absolute', top: 18, right: 20, width: 8, height: 8, borderRadius: '50%', background: '#F97316' }} />
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {ct.name?.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', margin: 0 }}>{ct.name}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{new Date(ct.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>

                  <p style={{ fontSize: 12, color: '#1B4BAA', fontWeight: 600, margin: '0 0 6px' }}>{ct.subject}</p>
                  <p style={{ fontSize: 13.5, color: '#334155', margin: '0 0 10px', lineHeight: 1.6 }}>{ct.message}</p>

                  <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#94A3B8' }}>
                      <Mail size={12} /> {ct.email}
                    </span>
                    {ct.phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#94A3B8' }}>
                        <Phone size={12} /> {ct.phone}
                      </span>
                    )}
                  </div>

                  {ct.reply && replyingId !== ct.id && (
                    <div style={{ background: '#F8FAFC', borderLeft: '3px solid #F97316', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#F97316', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Votre réponse
                      </p>
                      <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5 }}>{ct.reply}</p>
                    </div>
                  )}

                  {replyingId === ct.id ? (
                    <div style={{ marginBottom: 4 }}>
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
                          onClick={() => submitReply(ct.id)}
                          disabled={submitting}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '8px 16px', background: submitting ? '#94A3B8' : '#F97316',
                            color: '#fff', border: 'none', borderRadius: 8, cursor: submitting ? 'not-allowed' : 'pointer',
                            fontSize: 12, fontWeight: 700,
                          }}
                        >
                          <Send size={13} /> {submitting ? 'Envoi...' : 'Enregistrer'}
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
                      <button
                        onClick={() => openReply(ct.id, ct.reply)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', color: '#1B4BAA', padding: 0 }}
                      >
                        <MessageSquare size={13} /> {ct.reply ? 'Modifier la réponse' : 'Répondre'}
                      </button>
                      {ct.isRead && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#10B981' }}>
                          <CheckCircle2 size={13} /> Lu
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(ct.id)}
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