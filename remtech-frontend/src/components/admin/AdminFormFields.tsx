import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

export const COLORS = {
  navy: '#0A1628', orange: '#F97316', blue: '#1B4BAA',
  bg: '#F6F8FC', white: '#fff', border: '#E2E8F0',
  muted: '#94A3B8', text: '#64748B', dark: '#0F172A',
};

export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.navy, textTransform: 'uppercase', letterSpacing: 0.6, display: 'block', marginBottom: 6 }}>
      {children}{required && <span style={{ color: COLORS.orange, marginLeft: 3 }}>*</span>}
    </label>
  );
}

export function Input({ value, onChange, placeholder, type = 'text', style = {} }: any) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        width: '100%', padding: '10px 14px', border: `1.5px solid ${COLORS.border}`,
        borderRadius: 10, fontSize: 13, color: COLORS.dark, outline: 'none',
        background: '#FAFBFC', transition: 'border 0.2s', boxSizing: 'border-box',
        ...style,
      }}
      onFocus={e => (e.target.style.borderColor = COLORS.orange)}
      onBlur={e => (e.target.style.borderColor = COLORS.border)}
    />
  );
}

export function Textarea({ value, onChange, placeholder, rows = 4 }: any) {
  return (
    <textarea
      value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{
        width: '100%', padding: '10px 14px', border: `1.5px solid ${COLORS.border}`,
        borderRadius: 10, fontSize: 13, color: COLORS.dark, outline: 'none',
        background: '#FAFBFC', resize: 'vertical', fontFamily: 'Inter, sans-serif',
        transition: 'border 0.2s', boxSizing: 'border-box',
      }}
      onFocus={e => (e.target.style.borderColor = COLORS.orange)}
      onBlur={e => (e.target.style.borderColor = COLORS.border)}
    />
  );
}

export function Select({ value, onChange, children, style = {} }: any) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value} onChange={onChange}
        style={{
          width: '100%', padding: '10px 36px 10px 14px', border: `1.5px solid ${COLORS.border}`,
          borderRadius: 10, fontSize: 13, color: COLORS.dark, outline: 'none',
          background: '#FAFBFC', appearance: 'none', cursor: 'pointer',
          transition: 'border 0.2s', boxSizing: 'border-box', ...style,
        }}
        onFocus={e => (e.target.style.borderColor = COLORS.orange)}
        onBlur={e => (e.target.style.borderColor = COLORS.border)}
      >
        {children}
      </select>
      <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: COLORS.muted, pointerEvents: 'none' }} />
    </div>
  );
}

export function TagInput({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput('');
  };
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: values.length ? 8 : 0 }}>
        {values.map((v, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#EEF2FF', color: COLORS.blue, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
            {v}
            <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.blue, padding: 0, lineHeight: 1, display: 'flex' }}>
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          style={{
            flex: 1, padding: '9px 13px', border: `1.5px solid ${COLORS.border}`,
            borderRadius: 10, fontSize: 13, color: COLORS.dark, outline: 'none',
            background: '#FAFBFC', transition: 'border 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = COLORS.orange)}
          onBlur={e => (e.target.style.borderColor = COLORS.border)}
        />
        <button type="button" onClick={add}
          style={{ padding: '9px 14px', background: COLORS.navy, color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
          + Ajouter
        </button>
      </div>
    </div>
  );
}

export function FormSection({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: 'hidden', marginBottom: 20 }}>
      <div style={{ padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: 10, background: '#FAFBFC' }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} style={{ color: COLORS.blue }} />
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: COLORS.navy, margin: 0 }}>{title}</h3>
      </div>
      <div style={{ padding: '20px 24px' }}>
        {children}
      </div>
    </div>
  );
}