import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Zap, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/auth.store';
import api from '../../api/axios';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      const response = await authApi.register(payload);
      setAuth(response.user, response.token);
      toast.success('Inscription réussie ! Bienvenue sur RemTech');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Une erreur est survenue';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        background: '#F8FAFC',
        padding: '40px 5%',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 480 }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #F97316, #FB923C)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap size={20} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              fontWeight: 700,
              color: '#0A1628',
              letterSpacing: 0.5,
            }}
          >
            Rem<span style={{ color: '#F97316' }}>Tech</span>
          </span>
        </Link>

        {/* ── Carte ── */}
        <div
          style={{
            background: '#fff',
            borderRadius: 18,
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 24px rgba(10,22,40,0.06)',
            padding: '40px 36px',
          }}
        >
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 700,
              color: '#0A1628',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Créer un compte
          </h1>
          <p style={{ color: '#64748B', fontSize: 14.5, marginBottom: 28, textAlign: 'center' }}>
            Déjà inscrit ?{' '}
            <Link to="/login" style={{ color: '#F97316', fontWeight: 600, textDecoration: 'none' }}>
              Se connecter
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Prénom + Nom */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Prénom</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={iconStyle} />
                  <input
                    type="text"
                    placeholder="votre prénom"
                    style={{ ...inputStyle, paddingLeft: 42 }}
                    {...register('firstName', { required: 'Requis' })}
                  />
                </div>
                {errors.firstName && <p style={errorStyle}>{errors.firstName.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Nom</label>
                <input
                  type="text"
                  placeholder="votre nom"
                  style={inputStyle}
                  {...register('lastName', { required: 'Requis' })}
                />
                {errors.lastName && <p style={errorStyle}>{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Adresse email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={iconStyle} />
                <input
                  type="email"
                  placeholder="votre@email.com"
                  style={{ ...inputStyle, paddingLeft: 42 }}
                  {...register('email', {
                    required: "L'email est requis",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' },
                  })}
                />
              </div>
              {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
            </div>

            {/* Téléphone */}
            <div>
              <label style={labelStyle}>Téléphone <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optionnel)</span></label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={iconStyle} />
                <input
                  type="tel"
                  placeholder="+229 00 00 00 00"
                  style={{ ...inputStyle, paddingLeft: 42 }}
                  {...register('phone')}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label style={labelStyle}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={iconStyle} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 caractères"
                  style={{ ...inputStyle, paddingLeft: 42, paddingRight: 44 }}
                  {...register('password', {
                    required: 'Le mot de passe est requis',
                    minLength: { value: 6, message: 'Minimum 6 caractères' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label style={labelStyle}>Confirmer le mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={iconStyle} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Répétez votre mot de passe"
                  style={{ ...inputStyle, paddingLeft: 42, paddingRight: 44 }}
                  {...register('confirmPassword', {
                    required: 'Veuillez confirmer le mot de passe',
                    validate: (value) => value === password || 'Les mots de passe ne correspondent pas',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword.message}</p>}
            </div>

            {/* Bouton */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 10,
                border: 'none',
                background: isLoading ? '#94A3B8' : '#F97316',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: isLoading ? 'none' : '0 8px 24px rgba(249,115,22,0.3)',
                transition: 'background 0.2s',
              }}
            >
              {isLoading ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Création en cours...
                </>
              ) : (
                "S'inscrire gratuitement"
              )}
            </motion.button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>




          {/* Séparateur */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>OU</span>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          </div>

          {/* Bouton Google */}
          <a
           href={`${api.defaults.baseURL}/auth/google`}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: 10,
              border: '1.5px solid #E2E8F0',
              background: '#fff',
              color: '#0A1628',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              textDecoration: 'none',
              boxSizing: 'border-box',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.85 2.09-1.81 2.73v2.26h2.92c1.71-1.58 2.69-3.9 2.69-6.63z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.81.54-1.84.87-3.04.87-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"/>
              <path fill="#FBBC05" d="M3.97 10.72c-.18-.54-.28-1.12-.28-1.72s.1-1.18.28-1.72V4.95H.96C.35 6.18 0 7.55 0 9s.35 2.82.96 4.05l3.01-2.33z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
            </svg>
            Continuer avec Google
          </a>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 24, lineHeight: 1.6 }}>
            En vous inscrivant, vous acceptez nos{' '}
            <Link to="/" style={{ color: '#0A1628', textDecoration: 'underline' }}>Conditions d'utilisation</Link>
            {' '}et notre{' '}
            <Link to="/" style={{ color: '#0A1628', textDecoration: 'underline' }}>Politique de confidentialité</Link>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#0A1628',
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: 10,
  border: '1.5px solid #E2E8F0',
  fontSize: 14,
  color: '#0A1628',
  background: '#fff',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: 14,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#94A3B8',
};

const errorStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#EF4444',
  marginTop: 6,
};