import { Eye, EyeOff } from 'lucide-react';

const AnswerToggle = ({ showAnswer, onToggle, questionId }) => {
  return (
    <button
      onClick={() => onToggle(questionId)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        showAnswer 
          ? 'bg-red-100 text-red-700 border border-red-300' 
          : 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200'
      }`}
      title={showAnswer ? "Cacher la réponse" : "Voir la réponse"}
    >
      {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      {showAnswer ? 'Cacher' : 'Réponse'}
    </button>
  );
};
export default AnswerToggle;