import { Users } from 'lucide-react';

interface AdminUsersProps {
  users: any[];
}

export default function AdminUsers({ users }: AdminUsersProps) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F8FAFC' }}>
            {['Utilisateur', 'Email', 'Rôle', 'Inscrit le'].map(h => (
              <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderTop: '1px solid #F1F5F9' }}>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{u.firstName?.charAt(0)}</div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0A1628', margin: 0 }}>{u.firstName} {u.lastName}</p>
                </div>
              </td>
              <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748B' }}>{u.email}</td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: u.role === 'ADMIN' ? '#FFF3E8' : '#EEF2FF', color: u.role === 'ADMIN' ? '#F97316' : '#1B4BAA' }}>{u.role}</span>
              </td>
              <td style={{ padding: '14px 16px', fontSize: 12, color: '#94A3B8' }}>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}><Users size={36} style={{ marginBottom: 12, opacity: 0.3 }} /><p>Aucun utilisateur.</p></div>}
    </div>
  );
}