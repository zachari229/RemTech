import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { contactsApi } from '../../api/contacts.api';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      await contactsApi.send(data);
      toast.success('Message envoyé ! Nous vous répondrons sous 24h.');
      reset();
    } catch {
      toast.error('Une erreur est survenue. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 10,
    border: '1.5px solid #E2E8F0',
    fontSize: 14,
    color: '#0A1628',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
  };

  const errorStyle = {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  };

  return (
    <div style={{ backgroundColor: '#F6F8FC', minHeight: '100vh', paddingTop: 0 }}>
      {/* Header */}
      <div style={{ background: '#0A1628', padding: '200px 5% 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: '#fff',
              marginBottom: 14,
            }}
          >
            Contactez-nous
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}
          >
            Une question sur nos formations ? Notre équipe vous répond sous 24h.
          </motion.p>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 1100, margin: '-40px auto 0', padding: '0 5% 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 28, alignItems: 'start' }}>

          {/* Infos contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                icon: Mail,
                label: 'Email',
                value: 'contactremtech@gmail.com',
                sub: 'Réponse sous 24h',
              },
              {
                icon: Phone,
                label: 'Téléphone',
                value: '+229 01 59 53 55 45',
                sub: 'Lun–Dim, 24h/24',
              },
              {
                icon: MapPin,
                label: 'Localisation',
                value: 'Cotonou, Bénin',
                sub: 'Afrique de l\'Ouest',
              },
              {
                icon: Clock,
                label: 'Disponibilité',
                value: 'Lun – Dim',
                sub: '24h/24',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: '20px 22px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  boxShadow: '0 2px 8px rgba(10,22,40,0.05)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: '#0A1628',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <item.icon size={20} color="#F97316" />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0A1628', marginBottom: 2 }}>
                    {item.value}
                  </p>
                  <p style={{ fontSize: 12, color: '#94A3B8' }}>{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: '36px 32px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 24px rgba(10,22,40,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#F97316',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageSquare size={18} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#0A1628', margin: 0 }}>
                  Envoyer un message
                </h2>
                <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>Tous les champs sont requis</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 6 }}>
                    Nom complet
                  </label>
                  <input
                    type="text"
                    placeholder="votre nom et prénom"
                    style={inputStyle}
                    {...register('name', { required: 'Requis' })}
                  />
                  {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 6 }}>
                    Adresse email
                  </label>
                  <input
                    type="email"
                    placeholder="votre email"
                    style={inputStyle}
                    {...register('email', {
                      required: 'Requis',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' },
                    })}
                  />
                  {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 6 }}>
                  Sujet
                </label>
                <input
                  type="text"
                  placeholder="Question sur une formation..."
                  style={inputStyle}
                  {...register('subject', { required: 'Requis' })}
                />
                {errors.subject && <p style={errorStyle}>{errors.subject.message}</p>}
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: 6 }}>
                  Message
                </label>
                <textarea
                  placeholder="Décrivez votre demande en détail..."
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  {...register('message', { required: 'Requis', minLength: { value: 20, message: 'Minimum 20 caractères' } })}
                />
                {errors.message && <p style={errorStyle}>{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: isLoading ? '#94A3B8' : '#F97316',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '14px 28px',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'background 0.2s',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <Send size={16} />
                {isLoading ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}