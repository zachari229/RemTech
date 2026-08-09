import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { coursesApi } from '../../api/courses.api';
import { usersApi } from '../../api/users.api';
import { ordersApi } from '../../api/orders.api';
import { contactsApi } from '../../api/contacts.api';
import { reviewsApi } from '../../api/reviews.api';
import AdminSidebar, { navItems } from '../../components/admin/AdminSidebar';
import CreateCourseForm from '../../components/admin/CreateCourseForm';
import AdminOverview from './AdminOverview';
import AdminCourses from './AdminCourses';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
import AdminContacts from './AdminContacts';
import type { Stats } from '../../components/admin/admin.types';
import AdminReviews from './AdminReviews';
import AdminProfile from './AdminProfile';


export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'users' | 'orders' | 'contacts' | 'reviews' | 'profile'>('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [stats, setStats] = useState<Stats>({ courses: 0, users: 0, orders: 0, contacts: 0, revenue: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);

  const loadData = () => {
  Promise.all([
    coursesApi.getAllAdmin().catch(() => []),
    usersApi.getAll().catch(() => []),
    ordersApi.getAll().catch(() => []),
    contactsApi.getAll().catch(() => []),
    reviewsApi.getAll().catch(() => []),
  ]).then(([c, u, o, ct, rv]) => {
    setCourses(c); setUsers(u); setOrders(o); setContacts(ct); setReviews(rv);
    const revenue = o.filter((order: any) => order.status === 'PAYE')
      .reduce((acc: number, order: any) => acc + Number(order.amount || 0), 0);
    setStats({ courses: c.length, users: u.length, orders: o.length, contacts: ct.length, revenue });
  }).finally(() => setLoading(false));
};

  useEffect(() => { loadData(); }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    setShowCreateForm(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F6F8FC', fontFamily: 'Inter, sans-serif' }}>

      <AdminSidebar
        activeTab={activeTab}
        showCreateForm={showCreateForm}
        user={user}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />

      <main style={{ marginLeft: 260, flex: 1, padding: '36px 40px' }}>

        {showCreateForm || editingCourse ? (
          <CreateCourseForm
            onBack={() => { setShowCreateForm(false); setEditingCourse(null); }}
            onSuccess={() => { setShowCreateForm(false); setEditingCourse(null); setActiveTab('courses'); loadData(); }}
            courseToEdit={editingCourse ?? undefined}
          />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: '#0A1628', margin: '0 0 6px' }}>
                  {navItems.find(n => n.id === activeTab)?.label || 'Tableau de bord'}
                </h1>
                <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>Gérez votre plateforme RemTech depuis cet espace.</p>
              </div>
              {activeTab === 'courses' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: '#F97316', color: '#fff', border: 'none',
                    borderRadius: 12, padding: '11px 20px', fontSize: 13,
                    fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
                  }}
                  onMouseEnter={e => (e.currentTarget as any).style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => (e.currentTarget as any).style.transform = 'translateY(0)'}
                >
                  <Plus size={16} /> Nouvelle formation
                </button>
              )}
            </div>

            {activeTab === 'overview' && (
              <AdminOverview
                stats={stats}
                courses={courses}
                contacts={contacts}
                onGoToCourses={() => setActiveTab('courses')}
                onGoToContacts={() => setActiveTab('contacts')}
                onCreateFirstCourse={() => { setActiveTab('courses'); setShowCreateForm(true); }}
              />
            )}

            {activeTab === 'courses' && (
              <AdminCourses
                courses={courses}
                onEdit={(c) => setEditingCourse(c)}
                onCreateFirst={() => setShowCreateForm(true)}
                reload={loadData}
              />
            )}

            {activeTab === 'users' && <AdminUsers users={users} />}

            {activeTab === 'orders' && <AdminOrders orders={orders} />}

            {activeTab === 'contacts' && <AdminContacts contacts={contacts} reload={loadData} />}
            
            {activeTab === 'reviews' && <AdminReviews reviews={reviews} reload={loadData} />}

            {activeTab === 'profile' && <AdminProfile />}
          </>
        )}
      </main>
    </div>
  );
}