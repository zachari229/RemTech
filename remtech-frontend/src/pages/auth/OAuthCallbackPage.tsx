import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/auth.store';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      toast.error('Connexion Google échouée');
      navigate('/login');
      return;
    }

    // On stocke le token tout de suite pour que l'intercepteur axios
    // l'ajoute automatiquement à la requête getMe()
    localStorage.setItem('remtech_token', token);

    authApi
      .getMe()
      .then((user) => {
        setAuth(user, token);
        toast.success('Connexion réussie !');
        navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
      })
      .catch(() => {
        localStorage.removeItem('remtech_token');
        toast.error('Connexion Google échouée');
        navigate('/login');
      });
  }, [searchParams, navigate, setAuth]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8FAFC',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid #E2E8F0',
            borderTopColor: '#F97316',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ color: '#64748B', fontSize: 14 }}>Connexion en cours...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}