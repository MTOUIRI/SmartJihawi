import { FileText, PenTool, Target } from 'lucide-react';

export const questionTypes = [
  { value: 'text', label: 'Question ouverte', icon: PenTool },
  { value: 'multiple_choice', label: 'QCM (Vrai/Faux)', icon: Target },
  { value: 'multiple_choice_single', label: 'Choix unique', icon: Target },
  { value: 'table', label: 'Tableau à compléter', icon: FileText },
  { value: 'matching', label: 'Correspondance', icon: Target },
  { value: 'word_placement', label: 'Placement de mots', icon: PenTool }
];

export const books = [
  { id: 'dernier-jour', title: 'Le Dernier Jour d\'un Condamné' },
  { id: 'antigone', title: 'Antigone' },
  { id: 'boite-merveilles', title: 'La Boîte à Merveilles' }
];