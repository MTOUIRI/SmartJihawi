import React from 'react';
import { BookOpen, LogIn, LogOut, User, Shield } from 'lucide-react';

const ExamPlatformStructure = ({ 
  children, 
  currentBook, 
  books, 
  onBookChange, 
  onHeaderClick,
  user,
  onLogout,
  onShowStudentLogin,
  platformName = "SmartJihawi",
  platformSubtitle = "Littérature Française • 1 Bac"
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title - PrepJihawi Branding */}
            <button
              onClick={onHeaderClick}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 pr-4 transition-all group"
            >
              {/* Logo with badge */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                  <span className="text-white text-[10px] font-bold leading-none">✓</span>
                </div>
              </div>
              
              {/* Platform Name */}
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {platformName}
                </h1>
                <p className="text-xs text-gray-600 font-medium">{platformSubtitle}</p>
              </div>
            </button>

            {/* User Authentication Area */}
            <div className="flex items-center gap-4">
              {user ? (
                // User is logged in
                <div className="flex items-center gap-3">
                  {/* User Info */}
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-md">
                      {user.role === 'admin' ? (
                        <Shield className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                        {user.role === 'admin' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
                        {user.role}
                      </p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-200 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">Déconnexion</span>
                  </button>
                </div>
              ) : (
                // User is not logged in - Show login button
                <button
                  onClick={onShowStudentLogin}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 rounded-lg transition-all shadow-md hover:shadow-lg font-semibold group"
                >
                  <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Se connecter</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
       
      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default ExamPlatformStructure;