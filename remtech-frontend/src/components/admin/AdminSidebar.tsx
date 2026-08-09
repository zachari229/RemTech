import { Link } from 'react-router-dom';
import { BookOpen, Users, ShoppingCart, MessageSquare, BarChart3, LogOut, Star, User } from 'lucide-react';

const navItems = [
  { id: 'overview', icon: BarChart3, label: 'Tableau de bord' },
  { id: 'courses', icon: BookOpen, label: 'Formations' },
  { id: 'users', icon: Users, label: 'Utilisateurs' },
  { id: 'orders', icon: ShoppingCart, label: 'Commandes' },
  { id: 'reviews', icon: Star, label: 'Avis' },
  { id: 'contacts', icon: MessageSquare, label: 'Messages' },
] as const;

export { navItems };

interface AdminSidebarProps {
  activeTab: string;
  showCreateForm: boolean;
  user: { firstName?: string; lastName?: string } | null;
  onTabChange: (tab: any) => void;
  onLogout: () => void;
}

export default function AdminSidebar({ activeTab, showCreateForm, user, onTabChange, onLogout }: AdminSidebarProps) {
  return (
    <aside style={{ width: 260, background: '#0A1628', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, padding: '28px 0' }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '0 24px 32px' }}>
        <div style={{ width: 34, height: 34, background: '#F97316', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={18} color="#fff" />
        </div>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#fff' }}>
          Rem<span style={{ color: '#F97316' }}>Tech</span>
        </span>
      </Link>

      <div style={{ margin: '0 16px 28px', background: 'rgba(249,115,22,0.12)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(249,115,22,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>
            {user?.firstName?.charAt(0)}
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: 13, margin: 0 }}>{user?.firstName} {user?.lastName}</p>
            <span style={{ background: '#F97316', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 0.5 }}>Admnistrateur</span>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item) => (
          <button key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10,
              border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
              background: activeTab === item.id && !showCreateForm ? 'rgba(249,115,22,0.15)' : 'transparent',
              color: activeTab === item.id && !showCreateForm ? '#F97316' : 'rgba(255,255,255,0.6)',
              fontSize: 14, fontWeight: activeTab === item.id && !showCreateForm ? 600 : 400, transition: 'all 0.2s',
            }}>
            <item.icon size={18} />{item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '16px 12px 0' }}>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 14, transition: 'all 0.2s' }}>
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}