import { ChevronLeft, ChevronRight, BookOpen, FileText, Clock, CheckCircle, ArrowLeft, Languages } from 'lucide-react';

const ArabicToggle = ({ showArabic, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        showArabic 
          ? 'bg-green-100 text-green-700 border border-green-300' 
          : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
      }`}
      title="Afficher/Masquer la traduction arabe"
    >
      <Languages className="w-4 h-4" />
      {showArabic ? 'عربي' : 'AR'}
    </button>
  );
};
export default ArabicToggle;