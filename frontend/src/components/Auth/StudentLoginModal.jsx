import React, { useState } from 'react';
import { X, Mail, Lock, AlertCircle, LogIn, Loader2, UserPlus } from 'lucide-react';
import RegistrationModal from '../Registration/RegistrationModal';
import authService from './AuthService';

const StudentLoginModal = ({ isOpen, onClose, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors.general) {
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!formData.email || !formData.password) {
      setErrors({ general: 'Veuillez remplir tous les champs' });
      return;
    }

    setIsLoading(true);

    try {
      // Use universal login - it will store in student context if role is 'student'
      const response = await authService.login(formData.email, formData.password);
      
      // Verify it's a student account
      if (response.user.role !== 'student') {
        throw new Error('Ce compte n\'est pas un compte étudiant');
      }
      
      onLogin(response.user);
      onClose();
      setFormData({ email: '', password: '' });
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.message || 'Email ou mot de passe incorrect' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowRegistration = () => {
    setShowRegistration(true);
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
  };

  const handleRegister = (registerData) => {
    console.log('Registration data:', registerData);
    alert('Inscription réussie ! Votre compte sera activé après vérification du paiement.');
    setShowRegistration(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Connexion Étudiant
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Accédez à votre espace étudiant
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-5">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 animate-in slide-in-from-top duration-200">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="votre.email@exemple.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Se connecter</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                Pas encore de compte ?{' '}
                <button
                  onClick={handleShowRegistration}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <UserPlus className="w-4 h-4" />
                  S'inscrire
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <RegistrationModal
        isOpen={showRegistration}
        onClose={handleCloseRegistration}
        onRegister={handleRegister}
      />
    </>
  );
};

export default StudentLoginModal;