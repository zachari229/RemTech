import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Trash2, Upload, X, GripVertical, FileText, Video,
  Image as ImageIcon, CheckCircle2, Loader2, ArrowLeft,
  DollarSign, Layers, Target, Globe, Eye, BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { coursesApi } from '../../api/courses.api';
import { COLORS, FieldLabel, Input, Textarea, Select, TagInput, FormSection } from './AdminFormFields';
import type { Category, Module } from './admin.types';

const LEVELS = [
  { value: 'DEBUTANT', label: 'Débutant' },
  { value: 'INTERMEDIAIRE', label: 'Intermédiaire' },
  { value: 'AVANCE', label: 'Avancé' },
];

export default function CreateCourseForm({ onBack, onSuccess, courseToEdit }: {
  onBack: () => void;
  onSuccess: () => void;
  courseToEdit?: any;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [chariowProductId, setChariowProductId] = useState(courseToEdit?.chariowProductId || '');

  const isEdit = !!courseToEdit;

  const [title, setTitle] = useState(courseToEdit?.title || '');
  const [shortDescription, setShortDescription] = useState(courseToEdit?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(courseToEdit?.fullDescription || '');
  const [price, setPrice] = useState(String(courseToEdit?.price || ''));
  const [level, setLevel] = useState(courseToEdit?.level || 'DEBUTANT');
  const [duration, setDuration] = useState(courseToEdit?.duration || '');
  const [categoryId, setCategoryId] = useState(String(courseToEdit?.category?.id || ''));
  const [objectives, setObjectives] = useState<string[]>(courseToEdit?.objectives || []);
  const [prerequisites, setPrerequisites] = useState<string[]>(courseToEdit?.prerequisites || []);
  const [metaTitle, setMetaTitle] = useState(courseToEdit?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(courseToEdit?.metaDescription || '');
  const [categoryMode, setCategoryMode] = useState<'select' | 'create'>('select');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState<number | null>(courseToEdit?.id || null);

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (mediaFiles.length + files.length > 3) { toast.error('Maximum 3 médias'); return; }
    const newFiles = [...mediaFiles, ...files].slice(0, 3);
    setMediaFiles(newFiles);
    setMediaPreviews(newFiles.map(f => URL.createObjectURL(f)));
  };
  const removeMedia = (i: number) => {
    setMediaFiles(prev => prev.filter((_, idx) => idx !== i));
    setMediaPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) { toast.error('Donnez un nom à la catégorie'); return; }
    setCreatingCategory(true);
    try {
      const res = await api.post('/categories', { name });
      const newCat = res.data;
      setCategories(prev => [...prev, newCat]);
      setCategoryId(String(newCat.id));
      setNewCategoryName('');
      setCategoryMode('select');
      toast.success(`Catégorie "${newCat.name}" créée !`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erreur création catégorie');
    } finally {
      setCreatingCategory(false);
    }
  };

  const addModule = () => setModules(prev => [...prev, { title: '', order: prev.length, lessons: [] }]);
  const updateModule = (i: number, title: string) => setModules(prev => prev.map((m, idx) => idx === i ? { ...m, title } : m));
  const removeModule = (i: number) => setModules(prev => prev.filter((_, idx) => idx !== i).map((m, idx) => ({ ...m, order: idx })));

  const addLesson = (moduleIdx: number) => {
    setModules(prev => prev.map((m, i) => i === moduleIdx
      ? { ...m, lessons: [...m.lessons, { title: '', type: 'VIDEO', order: m.lessons.length }] }
      : m
    ));
  };
  const updateLesson = (moduleIdx: number, lessonIdx: number, field: string, value: any) => {
    setModules(prev => prev.map((m, i) => i === moduleIdx
      ? { ...m, lessons: m.lessons.map((l, j) => j === lessonIdx ? { ...l, [field]: value } : l) }
      : m
    ));
  };
  const removeLesson = (moduleIdx: number, lessonIdx: number) => {
    setModules(prev => prev.map((m, i) => i === moduleIdx
      ? { ...m, lessons: m.lessons.filter((_, j) => j !== lessonIdx).map((l, j) => ({ ...l, order: j })) }
      : m
    ));
  };

  const handleStep1 = async () => {
    if (!title || !shortDescription || !fullDescription || !price || !categoryId || !duration) {
      toast.error('Remplissez tous les champs obligatoires'); return;
    }
    if (objectives.length === 0) { toast.error('Ajoutez au moins un objectif'); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('shortDescription', shortDescription);
      formData.append('fullDescription', fullDescription);
      formData.append('price', price);
      formData.append('level', level);
      formData.append('duration', duration);
      formData.append('categoryId', categoryId);
      objectives.forEach(o => formData.append('objectives[]', o));
      prerequisites.forEach(p => formData.append('prerequisites[]', p));
      if (metaTitle) formData.append('metaTitle', metaTitle);
      if (metaDescription) formData.append('metaDescription', metaDescription);
      mediaFiles.forEach(f => formData.append('media', f));
      if (chariowProductId) formData.append('chariowProductId', chariowProductId);

      if (isEdit) {
        await coursesApi.update(courseToEdit.id, formData);
        setCreatedCourseId(courseToEdit.id);
        toast.success('Formation mise à jour ! Modifiez maintenant les modules.');
      } else {
        const res = await coursesApi.create(formData);
        setCreatedCourseId(res.course.id);
        toast.success('Formation créée ! Ajoutez maintenant les modules.');
      }
      setStep(2);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep2 = async () => {
    if (modules.length === 0) { setStep(3); return; }
    if (modules.some(m => !m.title.trim())) { toast.error('Donnez un titre à chaque module'); return; }
    setSubmitting(true);
    try {
      const created: Module[] = [];
      for (const mod of modules) {
        const res = await api.post(`/courses/${createdCourseId}/modules`, { title: mod.title, order: mod.order });
        created.push({ ...mod, id: res.data.id });
      }
      setModules(created);
      toast.success('Modules créés ! Ajoutez maintenant les leçons.');
      setStep(3);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erreur modules');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep3 = async () => {
    setSubmitting(true);
    try {
      for (const mod of modules) {
        if (!mod.id) continue;
        for (const lesson of mod.lessons) {
          if (!lesson.title) continue;
          const fd = new FormData();
          fd.append('title', lesson.title);
          fd.append('type', lesson.type);
          fd.append('order', String(lesson.order));
          if (lesson.duration) fd.append('duration', lesson.duration);
          if (lesson.file) fd.append('file', lesson.file);
          await api.post(`/modules-content/${mod.id}/lessons`, fd);
        }
      }
      toast.success('Formation complète créée avec succès !');
      onSuccess();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erreur leçons');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { n: 1, label: 'Informations' },
    { n: 2, label: 'Modules' },
    { n: 3, label: 'Leçons' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 13, color: COLORS.text, fontWeight: 600 }}>
          <ArrowLeft size={15} /> Retour
        </button>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
            {isEdit ? 'Modifier la formation' : 'Nouvelle formation'}
          </h1>
          <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
            {isEdit ? `#${courseToEdit.id} — ${courseToEdit.title}` : 'Créez une formation sans toucher au code'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28, background: COLORS.white, borderRadius: 14, padding: '16px 24px', border: `1px solid ${COLORS.border}` }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step > s.n ? '#10B981' : step === s.n ? COLORS.orange : COLORS.border,
                color: step >= s.n ? '#fff' : COLORS.muted, fontSize: 13, fontWeight: 700, transition: 'all 0.3s',
              }}>
                {step > s.n ? <CheckCircle2 size={16} /> : s.n}
              </div>
              <span style={{ fontSize: 13, fontWeight: step === s.n ? 700 : 400, color: step === s.n ? COLORS.orange : step > s.n ? '#10B981' : COLORS.muted }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: step > s.n ? '#10B981' : COLORS.border, margin: '0 16px', transition: 'background 0.3s' }} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
            <div>
              <FormSection icon={FileText} title="Informations générales">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <FieldLabel required>Titre de la formation</FieldLabel>
                    <Input value={title} onChange={(e: any) => setTitle(e.target.value)} placeholder="ex: Développement Web avec React" />
                  </div>
                  <div>
                    <FieldLabel required>Description courte</FieldLabel>
                    <Textarea value={shortDescription} onChange={(e: any) => setShortDescription(e.target.value)} placeholder="Résumé accrocheur en 1-2 phrases..." rows={2} />
                  </div>
                  <div>
                    <FieldLabel required>Description complète</FieldLabel>
                    <Textarea value={fullDescription} onChange={(e: any) => setFullDescription(e.target.value)} placeholder="Description détaillée de la formation..." rows={5} />
                  </div>
                </div>
              </FormSection>

              <FormSection icon={Target} title="Objectifs & Prérequis">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <FieldLabel required>Objectifs pédagogiques</FieldLabel>
                    <TagInput values={objectives} onChange={setObjectives} placeholder="ex: Maîtriser React... (Entrée pour valider)" />
                  </div>
                  <div>
                    <FieldLabel>Prérequis</FieldLabel>
                    <TagInput values={prerequisites} onChange={setPrerequisites} placeholder="ex: Connaître JavaScript... (Entrée pour valider)" />
                  </div>
                </div>
              </FormSection>

              <FormSection icon={Globe} title="SEO (optionnel)">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <FieldLabel>Titre SEO</FieldLabel>
                    <Input value={metaTitle} onChange={(e: any) => setMetaTitle(e.target.value)} placeholder="Titre pour les moteurs de recherche" />
                  </div>
                  <div>
                    <FieldLabel>Description SEO</FieldLabel>
                    <Textarea value={metaDescription} onChange={(e: any) => setMetaDescription(e.target.value)} placeholder="Description pour Google (150-160 caractères)" rows={2} />
                    <p style={{ fontSize: 11, color: metaDescription.length > 160 ? '#EF4444' : COLORS.muted, margin: '4px 0 0', textAlign: 'right' }}>
                      {metaDescription.length}/160
                    </p>
                  </div>
                </div>
              </FormSection>
            </div>

            <div>
              <FormSection icon={Layers} title="Paramètres">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <FieldLabel required>Catégorie</FieldLabel>
                      <button
                        type="button"
                        onClick={() => setCategoryMode(m => m === 'select' ? 'create' : 'select')}
                        style={{ fontSize: 11, fontWeight: 700, color: COLORS.blue, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        {categoryMode === 'select' ? '+ Nouvelle catégorie' : '← Choisir existante'}
                      </button>
                    </div>

                    {categoryMode === 'select' ? (
                      categories.length > 0 ? (
                        <Select value={categoryId} onChange={(e: any) => setCategoryId(e.target.value)}>
                          <option value="">Sélectionner...</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Select>
                      ) : (
                        <div style={{ padding: '10px 14px', background: '#FFF3E8', border: `1.5px dashed ${COLORS.orange}`, borderRadius: 10, fontSize: 12, color: COLORS.text }}>
                          Aucune catégorie. Clique sur "+ Nouvelle catégorie" pour en créer une.
                        </div>
                      )
                    ) : (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Input
                          value={newCategoryName}
                          onChange={(e: any) => setNewCategoryName(e.target.value)}
                          placeholder="ex: Développement Web"
                        />
                        <button
                          type="button"
                          onClick={handleCreateCategory}
                          disabled={creatingCategory}
                          style={{
                            padding: '0 16px', background: creatingCategory ? COLORS.muted : COLORS.navy,
                            color: '#fff', border: 'none', borderRadius: 10, cursor: creatingCategory ? 'not-allowed' : 'pointer',
                            fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                          }}
                        >
                          {creatingCategory ? '...' : 'Créer'}
                        </button>
                      </div>
                    )}

                    {categoryId && categoryMode === 'select' && categories.length > 0 && (
                      <p style={{ fontSize: 11, color: '#10B981', margin: '6px 0 0', fontWeight: 600 }}>
                        ✓ {categories.find(c => String(c.id) === categoryId)?.name} sélectionnée
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel required>Niveau</FieldLabel>
                    <Select value={level} onChange={(e: any) => setLevel(e.target.value)}>
                      {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </Select>
                  </div>
                  <div>
                    <FieldLabel required>Durée</FieldLabel>
                    <Input value={duration} onChange={(e: any) => setDuration(e.target.value)} placeholder="ex: 10 heures, 3 semaines..." />
                  </div>
                  <div>
                    <FieldLabel required>Prix (FCFA)</FieldLabel>
                    <div style={{ position: 'relative' }}>
                      <DollarSign size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: COLORS.muted }} />
                      <Input value={price} onChange={(e: any) => setPrice(e.target.value)} placeholder="ex: 25000" type="number" style={{ paddingLeft: 34 }} />
                    </div>
                  </div>

                  <div>
                    <FieldLabel>ID Produit Chariow</FieldLabel>
                    <Input
                      value={chariowProductId}
                      onChange={(e: any) => setChariowProductId(e.target.value)}
                      placeholder="ex: prod_xxxxxxxx"
                    />
                    <p style={{ fontSize: 11, color: COLORS.muted, margin: '4px 0 0' }}>
                      Requis pour activer le paiement de cette formation
                    </p>
                  </div>

                </div>
              </FormSection>

              <FormSection icon={ImageIcon} title="Médias (max 3)">
                <div
                  onClick={() => mediaInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${COLORS.border}`, borderRadius: 12,
                    padding: '24px 16px', textAlign: 'center', cursor: 'pointer',
                    background: '#FAFBFC', transition: 'all 0.2s',
                    marginBottom: mediaFiles.length ? 12 : 0,
                  }}
                  onMouseEnter={e => { (e.currentTarget as any).style.borderColor = COLORS.orange; (e.currentTarget as any).style.background = '#FFF8F4'; }}
                  onMouseLeave={e => { (e.currentTarget as any).style.borderColor = COLORS.border; (e.currentTarget as any).style.background = '#FAFBFC'; }}
                >
                  <Upload size={24} style={{ color: COLORS.muted, marginBottom: 8 }} />
                  <p style={{ fontSize: 13, color: COLORS.text, margin: '0 0 4px', fontWeight: 600 }}>Cliquez pour uploader</p>
                  <p style={{ fontSize: 11, color: COLORS.muted, margin: 0 }}>Images ou vidéos — {mediaFiles.length}/3</p>
                  <input ref={mediaInputRef} type="file" multiple accept="image/*,video/*" onChange={handleMediaChange} style={{ display: 'none' }} />
                </div>
                {mediaPreviews.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {mediaPreviews.map((url, i) => (
                      <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9', background: '#000' }}>
                        {mediaFiles[i]?.type.startsWith('image') ? (
                          <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b' }}>
                            <Video size={20} color="#fff" />
                          </div>
                        )}
                        <button onClick={() => removeMedia(i)} style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <X size={11} color="#fff" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </FormSection>

              {title && (
                <FormSection icon={Eye} title="Aperçu de la carte">
                  <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ height: 100, background: mediaPreviews[0] ? `url(${mediaPreviews[0]}) center/cover` : 'linear-gradient(135deg, #0A1628 0%, #1B4BAA 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {!mediaPreviews[0] && <BookOpen size={28} color="rgba(255,255,255,0.3)" />}
                    </div>
                    <div style={{ padding: 12 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.navy, margin: '0 0 4px' }}>{title || 'Titre de la formation'}</p>
                      <p style={{ fontSize: 11, color: COLORS.muted, margin: '0 0 8px' }}>{shortDescription || 'Description courte...'}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.orange }}>
                          {price ? Number(price).toLocaleString('fr-FR') + ' FCFA' : '— FCFA'}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.muted, background: '#F1F5F9', padding: '2px 8px', borderRadius: 20 }}>
                          {LEVELS.find(l => l.value === level)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </FormSection>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button
              onClick={handleStep1}
              disabled={submitting}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: submitting ? COLORS.muted : COLORS.orange,
                color: '#fff', border: 'none', borderRadius: 12,
                padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {submitting
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Création...</>
                : isEdit ? 'Mettre à jour →' : 'Créer la formation →'
              }
            </button>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div style={{ background: '#EEF2FF', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={18} color="#10B981" />
            <p style={{ fontSize: 13, color: COLORS.navy, fontWeight: 600, margin: 0 }}>
              Formation créée (ID #{createdCourseId}). Organisez maintenant votre programme en modules.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {modules.map((mod, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <GripVertical size={16} color={COLORS.muted} style={{ flexShrink: 0 }} />
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: COLORS.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <input
                    value={mod.title}
                    onChange={e => updateModule(i, e.target.value)}
                    placeholder={`Module ${i + 1} : ex. Introduction au cours`}
                    style={{ flex: 1, padding: '9px 13px', border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontSize: 13, color: COLORS.dark, outline: 'none', background: '#FAFBFC' }}
                    onFocus={e => (e.target.style.borderColor = COLORS.orange)}
                    onBlur={e => (e.target.style.borderColor = COLORS.border)}
                  />
                  <button onClick={() => removeModule(i)} style={{ padding: 8, background: '#FEE2E2', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', color: '#EF4444' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <button onClick={addModule} style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '13px 20px', border: `2px dashed ${COLORS.border}`,
            borderRadius: 14, background: 'transparent', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, color: COLORS.text, justifyContent: 'center',
            transition: 'all 0.2s', marginBottom: 24,
          }}
            onMouseEnter={e => { (e.currentTarget as any).style.borderColor = COLORS.orange; (e.currentTarget as any).style.color = COLORS.orange; }}
            onMouseLeave={e => { (e.currentTarget as any).style.borderColor = COLORS.border; (e.currentTarget as any).style.color = COLORS.text; }}
          >
            <Plus size={16} /> Ajouter un module
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(3)} style={{ padding: '11px 22px', background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: 12, cursor: 'pointer', fontSize: 13, color: COLORS.text, fontWeight: 600 }}>
              Passer cette étape →
            </button>
            <button onClick={handleStep2} disabled={submitting} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: submitting ? COLORS.muted : COLORS.orange,
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
            }}>
              {submitting ? <><Loader2 size={16} /> Enregistrement...</> : `Enregistrer ${modules.length} module(s) →`}
            </button>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          {modules.length === 0 ? (
            <div style={{ background: COLORS.white, borderRadius: 16, padding: '48px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>
              <Layers size={40} style={{ color: COLORS.border, marginBottom: 12 }} />
              <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 20 }}>Aucun module créé. Vous pourrez ajouter des leçons depuis la page de modification.</p>
              <button onClick={onSuccess} style={{ background: COLORS.orange, color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Terminer
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {modules.map((mod, mi) => (
                  <div key={mi} style={{ background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 20px', background: '#F8FAFC', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: COLORS.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                        {mi + 1}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy }}>{mod.title}</span>
                      <span style={{ fontSize: 11, color: COLORS.muted, marginLeft: 'auto' }}>{mod.lessons.length} leçon(s)</span>
                    </div>
                    <div style={{ padding: '16px 20px' }}>
                      {mod.lessons.map((lesson, li) => (
                        <div key={li} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: 10, alignItems: 'center', marginBottom: 10, padding: '10px 14px', background: '#FAFBFC', borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
                          <input
                            value={lesson.title}
                            onChange={e => updateLesson(mi, li, 'title', e.target.value)}
                            placeholder="Titre de la leçon"
                            style={{ padding: '8px 12px', border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12, color: COLORS.dark, outline: 'none', background: '#fff' }}
                            onFocus={e => (e.target.style.borderColor = COLORS.orange)}
                            onBlur={e => (e.target.style.borderColor = COLORS.border)}
                          />
                          <select
                            value={lesson.type}
                            onChange={e => updateLesson(mi, li, 'type', e.target.value)}
                            style={{ padding: '8px 10px', border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12, color: COLORS.dark, outline: 'none', background: '#fff', cursor: 'pointer' }}
                          >
                            <option value="VIDEO">🎬 Vidéo</option>
                            <option value="PDF">📄 PDF</option>
                            <option value="TEXT">📝 Texte</option>
                          </select>
                          {(lesson.type === 'VIDEO' || lesson.type === 'PDF') && (
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: '#EEF2FF', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600, color: COLORS.blue, whiteSpace: 'nowrap' }}>
                              <Upload size={13} />
                              {lesson.file ? lesson.file.name.slice(0, 12) + '...' : 'Fichier'}
                              <input type="file" accept={lesson.type === 'VIDEO' ? 'video/*' : 'application/pdf'} style={{ display: 'none' }}
                                onChange={e => updateLesson(mi, li, 'file', e.target.files?.[0])} />
                            </label>
                          )}
                          <input
                            value={lesson.duration || ''}
                            onChange={e => updateLesson(mi, li, 'duration', e.target.value)}
                            placeholder="Durée"
                            style={{ width: 70, padding: '8px 10px', border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12, color: COLORS.dark, outline: 'none', background: '#fff' }}
                          />
                          <button onClick={() => removeLesson(mi, li)} style={{ padding: 7, background: '#FEE2E2', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', color: '#EF4444' }}>
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => addLesson(mi)} style={{
                        display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                        padding: '9px 14px', border: `1.5px dashed ${COLORS.border}`,
                        borderRadius: 10, background: 'transparent', cursor: 'pointer',
                        fontSize: 12, fontWeight: 600, color: COLORS.text, justifyContent: 'center',
                      }}>
                        <Plus size={13} /> Ajouter une leçon
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={onSuccess} style={{ padding: '11px 22px', background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: 12, cursor: 'pointer', fontSize: 13, color: COLORS.text, fontWeight: 600 }}>
                  Terminer sans leçons
                </button>
                <button onClick={handleStep3} disabled={submitting} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: submitting ? COLORS.muted : '#10B981',
                  color: '#fff', border: 'none', borderRadius: 12,
                  padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                }}>
                  {submitting ? <><Loader2 size={16} /> Upload en cours...</> : '✓ Finaliser la formation'}
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}