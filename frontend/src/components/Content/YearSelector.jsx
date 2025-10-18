import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, FileText, ChevronRight, GraduationCap, MapPin, Loader2 } from 'lucide-react';
import { getYearsByBook } from './ExamData';

const YearSelector = ({ book, onYearSelect, onBack }) => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadYears = async () => {
      try {
        setLoading(true);
        setError(null);
        const yearsData = await getYearsByBook(book.id);
        setYears(yearsData || []);
      } catch (err) {
        console.error('Error loading years:', err);
        setError('Erreur lors du chargement des années');
        setYears([]);
      } finally {
        setLoading(false);
      }
    };

    loadYears();
  }, [book.id]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour au livre
            </button>
            
            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${book.color} rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Choisissez une année</h1>
              <p className="text-lg text-gray-600">Examens pour "{book.title}"</p>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>

          {/* Years Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Chargement des années...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <Calendar className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  Erreur de chargement
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          ) : years.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucun examen disponible
              </h3>
              <p className="text-gray-500">
                Les examens pour ce livre seront bientôt disponibles.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {years.map((yearData) => (
                <div
                  key={yearData.id}
                  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group ${
                    yearData.examCount > 0 ? 'cursor-pointer' : 'opacity-60'
                  }`}
                  onClick={() => yearData.examCount > 0 && onYearSelect(yearData)}
                >
                  <div className={`h-2 bg-gradient-to-r ${yearData.color}`}></div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`text-2xl font-bold text-gray-800 mb-2 leading-tight ${
                          yearData.examCount > 0 ? 'group-hover:text-blue-600' : ''
                        } transition-colors`}>
                          {yearData.year}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          {yearData.description}
                        </p>
                        <p className="text-xs text-gray-500 mb-3" dir="rtl">
                          {yearData.descriptionArabic}
                        </p>
                      </div>
                      {yearData.examCount > 0 && (
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {yearData.examCount} examen{yearData.examCount !== 1 ? 's' : ''} disponible{yearData.examCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {yearData.regions.length > 0 && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div className="flex gap-1 flex-wrap">
                            <span className="text-sm">
                              {yearData.regions.join(', ')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {yearData.examCount > 0 ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Disponible
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            Bientôt disponible
                          </span>
                        )}
                      </div>
                      
                      {yearData.examCount > 0 && (
                        <button
                          className={`px-4 py-2 bg-gradient-to-r ${yearData.color} text-white rounded-lg font-medium text-sm transition-all hover:shadow-lg group-hover:scale-105`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onYearSelect(yearData);
                          }}
                        >
                          Voir examens
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info box */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">À propos des examens par année</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Les examens sont organisés par année académique. Chaque année peut contenir des examens nationaux 
                  du Baccalauréat ainsi que des examens régionaux de différentes Académies Régionales d'Éducation et de Formation (AREF).
                  Sélectionnez une année pour voir tous les examens disponibles pour cette période.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearSelector;