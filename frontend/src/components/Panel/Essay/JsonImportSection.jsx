import React from 'react';
import { Upload } from 'lucide-react';

const JsonImportSection = ({ 
  showJsonImport, 
  jsonInput, 
  jsonError, 
  onToggle, 
  onInputChange, 
  onImport 
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-indigo-800 mb-1 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import rapide JSON
          </h3>
          <p className="text-sm text-indigo-600">
            Collez votre JSON pour remplir automatiquement le formulaire
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          {showJsonImport ? 'Fermer' : 'Importer JSON'}
        </button>
      </div>
      
      {showJsonImport && (
        <div className="mt-4 space-y-3">
          <textarea
            value={jsonInput}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder='{"type": "essay_introduction", "question": "...", "progressivePhrases": [...]}'
            className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
            rows={8}
          />
          {jsonError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {jsonError}
            </div>
          )}
          <button
            type="button"
            onClick={onImport}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ✓ Charger dans le formulaire
          </button>
        </div>
      )}
    </div>
  );
};

export default JsonImportSection;