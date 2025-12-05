import React, { useState } from 'react';
import { Star, CheckCircle, Award, FileText } from 'lucide-react';

const CompleteEssayDisplay = ({ essayQuestions, userAnswers }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Find introduction, development, and conclusion questions
  const introduction = essayQuestions.find(q => q.type === 'essay_introduction');
  const development = essayQuestions.find(q => q.type === 'essay_development');
  const conclusion = essayQuestions.find(q => q.type === 'essay_conclusion');

  // Generate complete text for a progressive phrases question
  const generateCompleteText = (question, answer) => {
    if (!answer) return '';
    
    // Handle progressive phrases
    if (question.progressivePhrases && Array.isArray(question.progressivePhrases)) {
      return question.progressivePhrases.map((phrase, index) => {
        let completedPhrase = phrase.template;
        const userPhraseAnswer = answer[index] || {};
        
        // Replace all slots with user's words
        completedPhrase = completedPhrase.replace(/\[(\d+)\]/g, (match, slotNumber) => {
          const word = userPhraseAnswer[parseInt(slotNumber)];
          return word || match;
        });
        
        return completedPhrase;
      }).filter(phrase => phrase && !phrase.includes('[')).join(' ');
    }
    
    // Handle single drag-drop words (SingleWordPlacement)
    if (question.dragDropWords && question.dragDropWords.template) {
      let completedText = question.dragDropWords.template;
      
      // Replace all slots with user's words
      completedText = completedText.replace(/\[(\d+)\]/g, (match, slotNumber) => {
        const word = answer[parseInt(slotNumber)];
        return word || match;
      });
      
      return completedText.includes('[') ? '' : completedText;
    }
    
    // Handle plain text answers
    if (typeof answer === 'string') {
      return answer;
    }
    
    return '';
  };

  // Get text for each section (French only)
  const getIntroText = () => {
    if (!introduction) return '';
    if (introduction.progressivePhrases) {
      return generateCompleteText(introduction, userAnswers[introduction.id]);
    }
    return userAnswers[introduction.id] || '';
  };

  const getDevText = () => {
    if (!development) return '';
    if (development.progressivePhrases) {
      return generateCompleteText(development, userAnswers[development.id]);
    }
    return userAnswers[development.id] || '';
  };

  const getConcText = () => {
    if (!conclusion) return '';
    if (conclusion.progressivePhrases) {
      return generateCompleteText(conclusion, userAnswers[conclusion.id]);
    }
    return userAnswers[conclusion.id] || '';
  };

  const introText = getIntroText();
  const devText = getDevText();
  const concText = getConcText();

  if (!introText && !devText && !concText) return null;

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-300 rounded-xl shadow-lg animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-600" />
          <div>
            <h2 className="text-2xl font-bold text-amber-800">
              🎉 Votre Essai Complet
            </h2>
            <p className="text-sm text-amber-600">
              Félicitations ! Vous avez complété toutes les sections
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium shadow-md"
        >
          {isVisible ? 'Masquer' : 'Afficher'}
        </button>
      </div>

      {isVisible && (
        <div className="space-y-6">
          {/* Complete Essay in One Block - French Only */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-300 shadow-md">
            <h3 className="font-bold text-indigo-800 text-xl mb-4 flex items-center gap-2">
              <Award className="w-6 h-6" />
              Essai Complet
            </h3>
            <div className="bg-white p-6 rounded-lg border border-indigo-200 shadow-sm">
              <p className="text-gray-800 leading-relaxed text-justify whitespace-pre-line text-lg">
                {[introText, devText, concText].filter(Boolean).join('\n\n')}
              </p>
            </div>
          </div>

          {/* Individual Sections - Collapsible */}
          <details className="group">
            <summary className="cursor-pointer list-none">
              <div className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-medium transition-colors">
                <span className="group-open:rotate-90 transition-transform">▶</span>
                <span>Voir les sections individuelles</span>
              </div>
            </summary>
            
            <div className="mt-4 space-y-4 pl-6">
              {/* Introduction */}
              {introText && (
                <div className="bg-white rounded-lg p-5 border-l-4 border-yellow-500 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-bold text-yellow-800">
                      Introduction
                    </h4>
                  </div>
                  <p className="text-gray-800 leading-relaxed text-justify">
                    {introText}
                  </p>
                </div>
              )}

              {/* Development */}
              {devText && (
                <div className="bg-white rounded-lg p-5 border-l-4 border-blue-500 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-blue-800">
                      Développement
                    </h4>
                  </div>
                  <p className="text-gray-800 leading-relaxed text-justify">
                    {devText}
                  </p>
                </div>
              )}

              {/* Conclusion */}
              {concText && (
                <div className="bg-white rounded-lg p-5 border-l-4 border-green-500 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-bold text-green-800">
                      Conclusion
                    </h4>
                  </div>
                  <p className="text-gray-800 leading-relaxed text-justify">
                    {concText}
                  </p>
                </div>
              )}
            </div>
          </details>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CompleteEssayDisplay;