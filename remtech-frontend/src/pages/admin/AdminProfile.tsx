import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Save, Loader2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '../../api/users.api';
import { useAuthStore } from '../../store/auth.store';

const COLORS = {
  navy: '#0A1628', orange: '#F97316', border: '#E2E8F0',
  muted: '#94A3B8', text: '#64748B', dark: '#0F172A',
};

function Field({ label, value, onChange, type = 'text', icon: Icon }: any) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.navy, textTransform: 'uppercase', letterSpacing: 0.6, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: COLORS.muted }} />
        <input
          type={type}
          value={value}
          onChange={onChange}
          style={{
            width: '100%', padding: '11px 14px 11px 38px', border: `1.5px solid ${COLORS.border}`,
            borderRadius: 10, fontSize: 13.5, color: COLORS.dark, outline: 'none',
            background: '#FAFBFC', transition: 'border 0.2s', boxSizing: 'border-box',
          }}
          onFocus={e => (e.target.style.borderColor = COLORS.orange)}
          onBlur={e => (e.target.style.borderColor = COLORS.border)}
        />
      </div>
    </div>
  );
}

export default function AdminProfile() {
  const { user, token, setAuth } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [submitting, setSubmitting] = useState(false);

  const hasChanges =
    firstName !== (user?.firstName || '') ||
    lastName !== (user?.lastName || '') ||
    email !== (user?.email || '') ||
    phone !== (user?.phone || '');

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error('Le prénom, le nom et l\'email sont obligatoires');
      return;
    }

    setSubmitting(true);
    try {
      const updated = await usersApi.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });

      // Le backend renvoie probablement { message, user } ou directement le user
      const updatedUser = updated.user || updated;

      if (token) {
        setAuth({ ...user, ...updatedUser }, token);
      }

      toast.success('Profil mis à jour avec succès');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: '#fff', borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}
      >
        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: 16, background: '#FAFBFC' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: COLORS.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {firstName?.charAt(0) || user?.firstName?.charAt(0)}
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
              {user?.firstName} {user?.lastName}
            </p>
            <span style={{ background: COLORS.orange, color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Administrateur
            </span>
          </div>
        </div>

        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Prénom" value={firstName} onChange={(e: any) => setFirstName(e.target.value)} icon={User} />
            <Field label="Nom" value={lastName} onChange={(e: any) => setLastName(e.target.value)} icon={User} />
          </div>
          <Field label="Email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} icon={Mail} />
          <Field label="Téléphone" value={phone} onChange={(e: any) => setPhone(e.target.value)} icon={Phone} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFF8F0', border: '1px solid #FED7AA', borderRadius: 10, padding: '10px 14px', marginTop: 4 }}>
            <ShieldAlert size={15} color="#F59E0B" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: '#92400E', margin: 0 }}>
              Le changement de mot de passe n'est pas encore disponible depuis cette interface.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !hasChanges}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: !hasChanges ? COLORS.border : submitting ? COLORS.muted : COLORS.orange,
              color: !hasChanges ? COLORS.muted : '#fff',
              border: 'none', borderRadius: 12, padding: '13px',
              fontSize: 14, fontWeight: 700,
              cursor: !hasChanges || submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', marginTop: 8,
            }}
          >
            {submitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Enregistrement...</> : <><Save size={16} /> Enregistrer les modifications</>}
          </button>
        </div>
      </motion.div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}