const regions = [
  'Tanger-Tétouan-Al Hoceïma',
  'Oriental',
  'Fès-Meknès',
  'Rabat-Salé-Kénitra',
  'Béni Mellal-Khénifra',
  'Casablanca-Settat',
  'Marrakech-Safi',
  'Drâa-Tafilalet',
  'Souss-Massa',
  'Guelmim-Oued Noun',
  'Laâyoune-Sakia El Hamra',
  'Dakhla-Oued Ed-Dahab'
];

const BasicInfoForm = ({ formData, setFormData }) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titre de l'examen *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          placeholder="Examen du Baccalauréat..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titre en arabe
        </label>
        <input
          type="text"
          value={formData.titleArabic}
          onChange={(e) => setFormData({...formData, titleArabic: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
          dir="rtl"
          placeholder="امتحان نيل شهادة البكالوريا..."
        />
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Année *
        </label>
        <input
          type="number"
          min="2010"
          max="2030"
          value={formData.year}
          onChange={(e) => setFormData({...formData, year: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          placeholder="2024"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Région *
        </label>
        <select
          value={formData.region}
          onChange={(e) => setFormData({...formData, region: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Choisir une région</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Durée *
        </label>
        <input
          type="text"
          value={formData.duration}
          onChange={(e) => setFormData({...formData, duration: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          placeholder="2 heures"
        />
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Matière
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({...formData, subject: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ÉTUDE DE TEXTE"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Points total
        </label>
        <input
          type="number"
          min="1"
          value={formData.points}
          onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="10"
        />
      </div>
    </div>
  </div>
);

export default BasicInfoForm;