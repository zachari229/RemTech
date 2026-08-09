import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Zap, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../api/auth.api';

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setSentEmail(data.email);
      setSent(true);
    } catch (error: any) {
      toast.error('Une erreur est survenue');
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

        {/* Carte */}
        <div
          style={{
            background: '#fff',
            borderRadius: 18,
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 24px rgba(10,22,40,0.06)',
            padding: '40px 36px',
          }}
        >
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(16,185,129,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <CheckCircle2 size={28} color="#10B981" />
              </div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#0A1628',
                  marginBottom: 10,
                }}
              >
                Code envoyé !
              </h1>
              <p style={{ color: '#64748B', fontSize: 14.5, lineHeight: 1.7, marginBottom: 28 }}>
                Si cet email existe dans notre système, un code de réinitialisation
                à 6 chiffres vient de vous être envoyé. Vérifiez votre boîte de réception.
              </p>

              <motion.button
                type="button"
                onClick={() => navigate('/reset-password', { state: { email: sentEmail } })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#F97316',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(249,115,22,0.3)',
                  marginBottom: 12,
                  boxSizing: 'border-box',
                }}
              >
                J'ai reçu mon code
              </motion.button>

              <Link
                to="/login"
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  padding: '13px',
                  borderRadius: 10,
                  border: '1.5px solid #E2E8F0',
                  color: '#0A1628',
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none',
                  boxSizing: 'border-box',
                }}
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
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
                Mot de passe oublié
              </h1>
              <p style={{ color: '#64748B', fontSize: 14.5, marginBottom: 28, textAlign: 'center' }}>
                Entrez votre email pour recevoir un code de réinitialisation.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le code'
                  )}
                </motion.button>

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </form>

              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#F97316',
                  textDecoration: 'none',
                  marginTop: 28,
                }}
              >
                <ArrowLeft size={16} />
                Retour à la connexion
              </Link>
            </>
          )}
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