import React, { useState } from 'react';
import { BookOpen, BarChart3, Users, FileText, Settings, LogOut, Menu, X, User, Book, HelpCircle, PenTool, Target } from 'lucide-react';
import DashboardHome from './DashboardHome';
import ChapterManagement from './ChapterManagement';
import ExamManagement from './ExamManagement';
import QuestionManagement from './QuestionManagement';
import EssayManagement from './EssayManagement';
import QCMManagement from './QCMManagement';
import UserManagement from './UserManagement';

const DashboardLayout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const navigation = [
    { 
      name: 'Tableau de bord', 
      id: 'dashboard', 
      icon: BarChart3,
      current: currentPage === 'dashboard' 
    },
    { 
      name: 'Chapitres', 
      id: 'chapters', 
      icon: Book,
      current: currentPage === 'chapters' 
    },
    { 
      name: 'Examens', 
      id: 'exams', 
      icon: FileText,
      current: currentPage === 'exams' 
    },
    { 
      name: 'Questions', 
      id: 'questions', 
      icon: HelpCircle,
      current: currentPage === 'questions' 
    },
    { 
      name: 'Questions d\'Expression', 
      id: 'essays', 
      icon: PenTool,
      current: currentPage === 'essays' 
    },
    { 
      name: 'QCM par Chapitre', 
      id: 'qcm', 
      icon: Target,
      current: currentPage === 'qcm' 
    },
    { 
      name: 'Utilisateurs', 
      id: 'users', 
      icon: Users,
      current: currentPage === 'users' 
    },
    { 
      name: 'Paramètres', 
      id: 'settings', 
      icon: Settings,
      current: currentPage === 'settings' 
    },
  ];

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'chapters':
        return <ChapterManagement />;
      case 'exams':
        return <ExamManagement />;
      case 'questions':
        return <QuestionManagement />;
      case 'essays':
        return <EssayManagement />;
      case 'qcm':
        return <QCMManagement />;
      case 'dashboard':
        return <DashboardHome currentPage={currentPage} />;
      case 'users':
        return <UserManagement />;
      default:
        return <DashboardHome currentPage={currentPage} />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          
          {/* Mobile sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">Dashboard</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.id)}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full text-left ${
                        item.current
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`mr-4 h-6 w-6 ${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">Dashboard</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.id)}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${
                        item.current
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            {/* User info and logout */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="ml-auto p-1 text-gray-400 hover:text-gray-600"
                  title="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          {children || renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;