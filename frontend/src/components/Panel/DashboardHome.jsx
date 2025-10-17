import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Users, BarChart3 } from 'lucide-react';
import authService from '../Auth/AuthService';

const DashboardHome = ({ currentPage }) => {
  const [dashboardStats, setDashboardStats] = useState({
    totalExams: 0,
    totalUsers: 0,
    successRate: 0,
    totalBooks: 0,
    recentActivity: [],
    monthlyStats: {
      examsTaken: 0,
      averageSuccessRate: 0,
      averageTime: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentPage === 'dashboard') {
      fetchDashboardData();
    }
  }, [currentPage]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // First fetch books and users using authService
      const [usersRes, booksRes] = await Promise.all([
        authService.authenticatedAdminRequest('/users', { method: 'GET' }),
        authService.authenticatedAdminRequest('/books', { method: 'GET' })
      ]);

      const users = usersRes.ok ? await usersRes.json() : [];
      const books = booksRes.ok ? await booksRes.json() : [];
      
      // Then fetch exams for all books
      let allExams = [];
      if (Array.isArray(books) && books.length > 0) {
        const examPromises = books.map(book => 
          authService.authenticatedAdminRequest(`/exams/book/${book.id}`, { method: 'GET' })
            .then(res => res.ok ? res.json() : [])
            .catch(() => [])
        );
        const examsArrays = await Promise.all(examPromises);
        allExams = examsArrays.flat();
      }

      // Calculate statistics
      setDashboardStats({
        totalExams: allExams.length,
        totalUsers: Array.isArray(users) ? users.length : 0,
        successRate: 89, // Replace with actual calculation from results API
        totalBooks: Array.isArray(books) ? books.length : 0,
        recentActivity: [
          { type: 'success', text: 'Nouvel examen ajouté: "Candide - Chapitre 1"' },
          { type: 'info', text: `${Array.isArray(users) ? users.slice(-15).length : 0} nouveaux utilisateurs inscrits` },
          { type: 'update', text: 'Mise à jour du contenu "Le Dernier Jour"' }
        ],
        monthlyStats: {
          examsTaken: 2847, // Replace with actual API data
          averageSuccessRate: 87.3, // Replace with actual API data
          averageTime: 24 // Replace with actual API data
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // If authentication error, the authService will handle logout
      if (error.message.includes('session expired')) {
        console.error('User needs to log in again');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de bord</h1>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalExams}</p>
                        <p className="text-gray-600">Examens</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalUsers.toLocaleString()}</p>
                        <p className="text-gray-600">Utilisateurs</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-semibold text-gray-900">{dashboardStats.successRate}%</p>
                        <p className="text-gray-600">Taux de réussite</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalBooks}</p>
                        <p className="text-gray-600">Livres</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
                    <div className="space-y-3">
                      {dashboardStats.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'success' ? 'bg-green-500' : 
                            activity.type === 'info' ? 'bg-blue-500' : 
                            'bg-purple-500'
                          }`}></div>
                          <p className="text-sm text-gray-600">{activity.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques du mois</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Examens passés</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {dashboardStats.monthlyStats.examsTaken.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taux de réussite moyen</span>
                        <span className="text-sm font-semibold text-green-600">
                          {dashboardStats.monthlyStats.averageSuccessRate}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Temps moyen par examen</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {dashboardStats.monthlyStats.averageTime} min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      
      case 'exams':
        return (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Examens</h1>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                + Nouvel Examen
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun examen</h3>
                <p className="mt-1 text-sm text-gray-500">Commencez par créer votre premier examen.</p>
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    <FileText className="-ml-1 mr-2 h-5 w-5" />
                    Créer un examen
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                + Nouvel Utilisateur
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Liste des utilisateurs</h3>
                <p className="mt-1 text-sm text-gray-500">Interface de gestion des utilisateurs à implémenter.</p>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h1>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres généraux</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom de l'application</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="Examens 1 Bac Maroc"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email de contact</label>
                    <input
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="admin@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres d'examen</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Temps limite par défaut</label>
                      <p className="text-sm text-gray-500">Durée maximale pour compléter un examen</p>
                    </div>
                    <input
                      type="number"
                      className="w-24 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="60"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Note minimale de passage</label>
                      <p className="text-sm text-gray-500">Pourcentage minimum pour réussir</p>
                    </div>
                    <input
                      type="number"
                      className="w-24 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="60"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {renderPageContent()}
    </div>
  );
};

export default DashboardHome;