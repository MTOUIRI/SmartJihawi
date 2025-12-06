import React from 'react';
import { Lock, LogIn, UserPlus } from 'lucide-react';

/**
 * FreemiumWrapper - Controls access to premium content
 * Shows content if user is logged in or if item is within free limit
 */
const FreemiumWrapper = ({ 
  children, 
  isLocked, 
  user, 
  onShowLogin,
  type = 'content' // 'chapter', 'exam', 'qcm', 'essay', 'content'
}) => {
  if (!isLocked || user) {
    return children;
  }

  const typeLabels = {
    chapter: { fr: 'ce chapitre', ar: 'هذا الفصل' },
    exam: { fr: 'cet examen', ar: 'هذا الامتحان' },
    qcm: { fr: 'ce QCM', ar: 'هذا الاختبار' },
    essay: { fr: 'cet exercice', ar: 'هذا التمرين' },
    content: { fr: 'ce contenu', ar: 'هذا المحتوى' }
  };

  const label = typeLabels[type] || typeLabels.content;

  return (
    <div className="relative">
      {/* Blurred Preview */}
      <div className="pointer-events-none select-none blur-sm opacity-50">
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/80 to-white">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-8 max-w-md mx-4 text-center">
          {/* Lock Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Contenu Premium
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Connectez-vous ou créez un compte gratuit pour accéder à {label.fr} et débloquer tous nos contenus d'apprentissage.
          </p>

          {/* Benefits List */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <p className="font-semibold text-blue-900 mb-2 text-sm">
              ✨ Accès gratuit à :
            </p>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Tous les chapitres et résumés</li>
              <li>• QCM interactifs illimités</li>
              <li>• Exercices de production écrite</li>
              <li>• Examens officiels complets</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onShowLogin}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
            >
              <LogIn className="w-5 h-5" />
              Se connecter
            </button>
            
            <button
              onClick={onShowLogin}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Créer un compte gratuit
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 mt-4">
            100% gratuit • Aucune carte bancaire requise
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper function to determine if an item should be locked
 * Returns true if item should be locked (not accessible)
 */
export const isItemLocked = (index, user, freeLimit = 1) => {
  // If user is logged in, nothing is locked
  if (user) return false;
  
  // For non-logged-in users, lock items beyond the free limit
  return index >= freeLimit;
};

/**
 * LockedCard - Shows a locked card preview
 */
export const LockedCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color,
  onShowLogin,
  index 
}) => {
  return (
    <div className="relative bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Gradient top bar */}
      <div className={`h-2 bg-gradient-to-r ${color}`} />
      
      {/* Blurred content */}
      <div className="p-6 blur-sm opacity-50 pointer-events-none select-none">
        <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-full flex items-center justify-center mb-4`}>
          {Icon && <Icon className="w-8 h-8 text-white" />}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-700 font-semibold mb-4">
            Connectez-vous pour débloquer
          </p>
          <button
            onClick={onShowLogin}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Se connecter
          </button>
        </div>
      </div>

      {/* Position badge */}
      <div className="absolute top-4 right-4 bg-gray-900/80 text-white px-3 py-1 rounded-full text-xs font-bold">
        #{index + 1}
      </div>
    </div>
  );
};

export default FreemiumWrapper;