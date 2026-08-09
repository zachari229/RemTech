// Formater un prix
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(price);
};

// Formater une date
export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

// Formater le niveau
export const formatLevel = (level: string): string => {
  const levels: Record<string, string> = {
    DEBUTANT: 'Débutant',
    INTERMEDIAIRE: 'Intermédiaire',
    AVANCE: 'Avancé',
  };
  return levels[level] || level;
};

// Formater le statut d'une commande
export const formatOrderStatus = (status: string): string => {
  const statuses: Record<string, string> = {
    EN_ATTENTE: 'En attente',
    PAYE: 'Payé',
    ECHOUE: 'Échoué',
    REMBOURSE: 'Remboursé',
  };
  return statuses[status] || status;
};

// Obtenir la couleur du statut
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    EN_ATTENTE: 'text-yellow-600 bg-yellow-50',
    PAYE: 'text-green-600 bg-green-50',
    ECHOUE: 'text-red-600 bg-red-50',
    REMBOURSE: 'text-gray-600 bg-gray-50',
    BROUILLON: 'text-gray-600 bg-gray-50',
    PUBLIE: 'text-green-600 bg-green-50',
    ARCHIVE: 'text-red-600 bg-red-50',
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
};

// Tronquer un texte
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Obtenir l'image principale d'un cours
export const getCourseImage = (media: any[]): string => {
  if (!media || media.length === 0) return '/placeholder-course.jpg';
  const primary = media.find((m) => m.isPrimary && m.type === 'IMAGE');
  return primary ? primary.url : media[0]?.url || '/placeholder-course.jpg';
};