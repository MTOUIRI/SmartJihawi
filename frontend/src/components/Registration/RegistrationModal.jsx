import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, School, ArrowRight, ArrowLeft, CheckCircle, Send, AlertCircle } from 'lucide-react';

const RegistrationModal = ({ isOpen, onClose, onRegister }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    school: '',
    level: 'jihawi-2026'
  });
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^(0|\+212)[5-7]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numéro de téléphone marocain invalide';
    }
    
    if (!formData.school.trim()) {
      newErrors.school = 'L\'établissement est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!agreed) {
      setErrors({ terms: 'Vous devez accepter les conditions' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Échec de l\'inscription');
      }

      // Registration successful, show step 4 (payment instructions)
      setStep(4);
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: error.message || 'Une erreur est survenue lors de l\'inscription' });
    } finally {
      setIsLoading(false);
    }
  };

  const sendWhatsAppReceipt = () => {
    const message = encodeURIComponent(
      `Bonjour, je viens de m'inscrire à l'offre Jihawi 2026.\n\n` +
      `Nom: ${formData.fullName}\n` +
      `Email: ${formData.email}\n` +
      `Téléphone: ${formData.phone}\n\n` +
      `Je vous envoie mon reçu de paiement.`
    );
    const whatsappNumber = '212690002573';
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    
    // Close modal and notify parent
    setTimeout(() => {
      onRegister(formData);
      onClose();
    }, 1000);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nom complet *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.fullName ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Votre nom complet"
          />
        </div>
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.fullName}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="votre.email@exemple.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Mot de passe *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.password ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Minimum 6 caractères"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Confirmer le mot de passe *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Retapez votre mot de passe"
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.confirmPassword}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Numéro de téléphone *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.phone ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="06 12 34 56 78"
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Établissement scolaire *
        </label>
        <div className="relative">
          <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="school"
            value={formData.school}
            onChange={handleInputChange}
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.school ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Nom de votre lycée"
          />
        </div>
        {errors.school && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.school}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Niveau
        </label>
        <div className="relative">
          <select
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          >
            <option value="jihawi-2026">Jihawi 2026 (1ère Bac)</option>
            <option value="jihawi-2027">Jihawi 2027 (2ème Bac)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-1">
              Dernière étape !
            </h3>
            <p className="text-blue-700 text-sm">
              Confirmez votre inscription et suivez les instructions de paiement.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Récapitulatif de votre inscription
        </h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Nom complet :</span>
            <span className="font-semibold text-gray-900">{formData.fullName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Email :</span>
            <span className="font-semibold text-gray-900">{formData.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Téléphone :</span>
            <span className="font-semibold text-gray-900">{formData.phone}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">École :</span>
            <span className="font-semibold text-gray-900">{formData.school}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Niveau :</span>
            <span className="font-semibold text-gray-900">
              {formData.level === 'jihawi-2026' ? 'Jihawi 2026 (1ère Bac)' : 'Jihawi 2027 (2ème Bac)'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <input
          type="checkbox"
          id="terms"
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
          }}
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          J'accepte les{' '}
          <a href="#" className="text-blue-600 hover:underline font-semibold">
            conditions d'utilisation
          </a>{' '}
          et je comprends que mon compte sera activé après vérification du paiement de 200 DH.
        </label>
      </div>
      
      {errors.terms && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors.terms}
        </p>
      )}
      
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{errors.general}</p>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-900 mb-1">
              Inscription réussie !
            </h3>
            <p className="text-green-700 text-sm">
              Votre compte a été créé. Suivez les étapes ci-dessous pour l'activer.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
          Effectuez le paiement
        </h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-blue-900 mb-3">
            Montant : <span className="text-2xl font-bold">200 DH</span>
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">💡 Conseil :</span> Conservez bien votre reçu de paiement, vous en aurez besoin pour l'étape suivante.
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
          Envoyez votre reçu
        </h3>
        
        <p className="text-gray-600 text-sm mb-4">
          Cliquez sur le bouton ci-dessous pour nous envoyer votre reçu de paiement via WhatsApp. 
          Votre compte sera activé dans les 24 heures suivant la vérification.
        </p>
        
        <button
          onClick={sendWhatsAppReceipt}
          className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
        >
          <Send className="w-5 h-5" />
          Envoyer le reçu sur WhatsApp
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">ℹ️ Important :</span> Vous pourrez vous connecter une fois que nous aurons vérifié votre paiement. Vous recevrez une confirmation par email.
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Inscription Jihawi 2026
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {step < 4 ? `Étape ${step} sur 3` : 'Instructions de paiement'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Progress bar */}
        {step < 4 && (
          <div className="bg-gray-100 h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Footer */}
        {step < 4 && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
            {step > 1 && (
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            )}
            
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="ml-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!agreed || isLoading}
                className="ml-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Inscription...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirmer l'inscription
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal