import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, KeyRound, Zap, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api/auth.api';

interface ResetPasswordFormData {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillEmail = (location.state as { email?: string } | null)?.email || '';

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    defaultValues: { email: prefillEmail },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await authApi.resetPassword({ token: data.code, newPassword: data.newPassword });
      toast.success('Mot de passe réinitialisé avec succès !');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Code invalide ou expiré';
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
        style={{ width: '100%', maxWidth: 440 }}
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
            Réinitialiser le mot de passe
          </h1>
          <p style={{ color: '#64748B', fontSize: 14.5, marginBottom: 28, textAlign: 'center' }}>
            Entrez le code reçu par email et votre nouveau mot de passe.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

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

            {/* Code */}
            <div>
              <label style={labelStyle}>Code de vérification</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={iconStyle} />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Code à 6 chiffres"
                  style={{ ...inputStyle, paddingLeft: 42, letterSpacing: 4 }}
                  {...register('code', {
                    required: 'Le code est requis',
                    pattern: { value: /^\d{6}$/, message: 'Le code doit contenir 6 chiffres' },
                  })}
                />
              </div>
              {errors.code && <p style={errorStyle}>{errors.code.message}</p>}
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label style={labelStyle}>Nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={iconStyle} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 caractères"
                  style={{ ...inputStyle, paddingLeft: 42, paddingRight: 44 }}
                  {...register('newPassword', {
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
              {errors.newPassword && <p style={errorStyle}>{errors.newPassword.message}</p>}
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label style={labelStyle}>Confirmer le mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={iconStyle} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Répétez le mot de passe"
                  style={{ ...inputStyle, paddingLeft: 42, paddingRight: 44 }}
                  {...register('confirmPassword', {
                    required: 'Veuillez confirmer le mot de passe',
                    validate: (value) => value === newPassword || 'Les mots de passe ne correspondent pas',
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
                  Réinitialisation...
                </>
              ) : (
                'Réinitialiser le mot de passe'
              )}
            </motion.button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748B', marginTop: 28 }}>
            <Link to="/forgot-password" style={{ color: '#F97316', fontWeight: 600, textDecoration: 'none' }}>
              Je n'ai pas reçu de code
            </Link>
            {' · '}
            <Link to="/login" style={{ color: '#F97316', fontWeight: 600, textDecoration: 'none' }}>
              Retour à la connexion
            </Link>
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