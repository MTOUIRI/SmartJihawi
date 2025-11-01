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
  platformName = "SmartBac",
  platformSubtitle = "Littérature Française • 1 Bac"
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Fully Responsive */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-3.5 md:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo/Title - Responsive sizing */}
            <button
              onClick={onHeaderClick}
              className="flex items-center gap-2 sm:gap-2.5 md:gap-3 hover:bg-gray-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 pr-3 sm:pr-4 transition-all group flex-shrink-0"
            >
              {/* Logo with badge */}
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                  <span className="text-white text-[8px] sm:text-[9px] md:text-[10px] font-bold leading-none">✓</span>
                </div>
              </div>
              
              {/* Platform Name - Hide on very small screens */}
              <div className="text-left">
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                  {platformName}
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-600 font-medium leading-tight">
                  {platformSubtitle}
                </p>
              </div>
            </button>

            {/* User Authentication Area - Responsive */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {user ? (
  // User is logged in - Responsive layout
  <div className="flex items-center gap-2 sm:gap-3">
    {/* User Info - Always show name */}
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-md flex-shrink-0">
        {user.role === 'admin' ? (
          <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
        ) : (
          <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
        )}
      </div>
      {/* Always show user name */}
      <div className="text-left">
        <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight truncate max-w-[70px] sm:max-w-[100px] md:max-w-[150px]">
          {user.name}
        </p>
        <p className="text-[10px] sm:text-xs text-gray-500 capitalize flex items-center gap-1 leading-tight">
          {user.role === 'admin' && <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full"></span>}
          <span className="truncate">{user.role}</span>
        </p>
      </div>
    </div>

                  {/* Logout Button - Icon only on small screens */}
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-200 font-medium text-xs sm:text-sm"
                  >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </button>
                </div>
              ) : (
                // User is not logged in - Compact button on mobile
                <button
                  onClick={onShowStudentLogin}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 rounded-lg transition-all shadow-md hover:shadow-lg font-semibold group text-xs sm:text-sm md:text-base"
                >
                  <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="hidden xs:inline">Se connecter</span>
                  <span className="xs:hidden">Connexion</span>
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