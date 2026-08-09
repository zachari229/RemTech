import { ShoppingCart } from 'lucide-react';

interface AdminOrdersProps {
  orders: any[];
}

export default function AdminOrders({ orders }: AdminOrdersProps) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F8FAFC' }}>
            {['#', 'Client', 'Formation', 'Montant', 'Statut', 'Date'].map(h => (
              <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} style={{ borderTop: '1px solid #F1F5F9' }}>
              <td style={{ padding: '14px 16px', fontSize: 12, color: '#94A3B8' }}>#{o.id}</td>
              <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#0A1628' }}>{o.user?.firstName} {o.user?.lastName}</td>
              <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748B' }}>{o.course?.title || '—'}</td>
              <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#0A1628' }}>{Number(o.amount || 0).toLocaleString()} FCFA</td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: o.status === 'PAYE' ? '#D1FAE5' : o.status === 'EN_ATTENTE' ? '#FEF3C7' : '#FEE2E2', color: o.status === 'PAYE' ? '#10B981' : o.status === 'EN_ATTENTE' ? '#F59E0B' : '#EF4444' }}>{o.status}</span>
              </td>
              <td style={{ padding: '14px 16px', fontSize: 12, color: '#94A3B8' }}>{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}><ShoppingCart size={36} style={{ marginBottom: 12, opacity: 0.3 }} /><p>Aucune commande.</p></div>}
    </div>
  );
}