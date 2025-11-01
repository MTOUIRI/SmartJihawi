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
      <div className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Header - Mobile Responsive */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline text-sm md:text-base">Retour au livre</span>
              <span className="sm:hidden text-sm">Retour</span>
            </button>
            
            <div className="text-center flex-1 mx-4">
              <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${book.color} rounded-full flex items-center justify-center mb-2 md:mb-4 mx-auto shadow-lg`}>
                <Calendar className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-1">Examens</h1>
              <p className="text-sm md:text-lg text-gray-600">{book.title}</p>
            </div>
            
            <div className="w-16 md:w-24"></div>
          </div>

          {/* Years Grid - Mobile Responsive */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-sm md:text-base text-gray-600 font-medium">Chargement des années...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6 max-w-md mx-auto">
                <Calendar className="w-12 h-12 md:w-16 md:h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-red-700 mb-2">
                  Erreur de chargement
                </h3>
                <p className="text-sm md:text-base text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white text-sm md:text-base rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          ) : years.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
                Aucun examen disponible
              </h3>
              <p className="text-sm md:text-base text-gray-500">
                Les examens pour ce livre seront bientôt disponibles.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {years.map((yearData) => (
                <div
                  key={yearData.id}
                  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group ${
                    yearData.examCount > 0 ? 'cursor-pointer' : 'opacity-60'
                  }`}
                  onClick={() => yearData.examCount > 0 && onYearSelect(yearData)}
                >
                  <div className={`h-2 bg-gradient-to-r ${yearData.color}`}></div>
                  
                  <div className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-3 md:mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-2xl md:text-3xl font-bold text-gray-800 mb-2 leading-tight ${
                          yearData.examCount > 0 ? 'group-hover:text-blue-600' : ''
                        } transition-colors`}>
                          {yearData.year}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
                          {yearData.description}
                        </p>
                        <p className="text-xs text-gray-500 mb-2 md:mb-3" dir="rtl">
                          {yearData.descriptionArabic}
                        </p>
                      </div>
                      {yearData.examCount > 0 && (
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                      )}
                    </div>
                    
                    <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                      <div className="flex items-center gap-2 md:gap-3 text-gray-600">
                        <FileText className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-xs md:text-sm">
                          {yearData.examCount} examen{yearData.examCount !== 1 ? 's' : ''} disponible{yearData.examCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {yearData.regions.length > 0 && (
                        <div className="flex items-start gap-2 md:gap-3 text-gray-600">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex gap-1 flex-wrap flex-1 min-w-0">
                            <span className="text-xs md:text-sm line-clamp-2">
                              {yearData.regions.join(', ')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-0">
                      <div className="flex items-center gap-2">
                        {yearData.examCount > 0 ? (
                          <span className="px-2 md:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Disponible
                          </span>
                        ) : (
                          <span className="px-2 md:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            Bientôt disponible
                          </span>
                        )}
                      </div>
                      
                      {yearData.examCount > 0 && (
                        <button
                          className={`w-full sm:w-auto px-4 py-2 bg-gradient-to-r ${yearData.color} text-white rounded-lg font-medium text-xs md:text-sm transition-all hover:shadow-lg group-hover:scale-105`}
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

          {/* Info box - Mobile Responsive */}
          <div className="mt-6 md:mt-8 bg-blue-50 rounded-lg p-4 md:p-6 border border-blue-200">
            <div className="flex items-start gap-2 md:gap-3">
              <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-blue-800 mb-1 md:mb-2 text-sm md:text-base">À propos des examens par année</h3>
                <p className="text-blue-700 text-xs md:text-sm leading-relaxed">
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