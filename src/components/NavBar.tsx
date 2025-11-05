'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Calendar, PlusCircle, LogIn, LogOut, User, Search, Ticket, BarChart3, Users, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function NavBar() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              {/* Structure sphérique 3D en rotation */}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12" style={{ perspective: '1000px' }}>
                <div 
                  className="absolute inset-0"
                  style={{
                    transformStyle: 'preserve-3d',
                    animation: 'rotateSphere 8s linear infinite'
                  }}
                >
                  {/* Anneaux circulaires concentriques pour créer effet sphérique */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-90 shadow-2xl"
                       style={{ transform: 'rotateX(0deg)' }}></div>
                  <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-purple-600 to-pink-500 opacity-80 shadow-xl"
                       style={{ transform: 'rotateX(30deg)' }}></div>
                  <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 opacity-70 shadow-lg"
                       style={{ transform: 'rotateX(60deg)' }}></div>
                  <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 opacity-60"
                       style={{ transform: 'rotateX(90deg)' }}></div>
                  
                  {/* Anneaux verticaux pour plus de profondeur */}
                  <div className="absolute inset-0 rounded-full border-4 border-pink-500/30"
                       style={{ transform: 'rotateY(30deg)' }}></div>
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30"
                       style={{ transform: 'rotateY(60deg)' }}></div>
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/30"
                       style={{ transform: 'rotateY(90deg)' }}></div>
                </div>
              </div>
              
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-black text-xl sm:text-2xl">
                Agora
              </span>
            </Link>
          </div>
          
          {/* Animation CSS pour la rotation sphérique */}
          <style jsx>{`
            @keyframes rotateSphere {
              0% {
                transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
              }
              100% {
                transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
              }
            }
          `}</style>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                {user?.type === 'organizer' ? (
                  <>
                    <Link 
                      href="/wallet"
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Wallet className="w-5 h-5" />
                      <span className="hidden sm:inline">Wallet</span>
                    </Link>
                    <Link 
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <Link 
                      href="/create"
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors font-semibold"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span className="hidden sm:inline">Créer</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/tickets"
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Ticket className="w-5 h-5" />
                      <span className="hidden sm:inline">Mes Billets</span>
                    </Link>
                    <Link 
                      href="/invite"
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-colors font-semibold"
                    >
                      <Users className="w-5 h-5" />
                      <span className="hidden sm:inline">Inviter</span>
                    </Link>
                  </>
                )}
                
                <Link 
                  href="/profile"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Photo de profil" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-indigo-600"
                    />
                  ) : (
                    <User className="w-5 h-5 text-indigo-600" />
                  )}
                  <span className="hidden lg:inline text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </>
            ) : (
              <Link 
                href="/auth"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors font-semibold"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden sm:inline">Connexion</span>
              </Link>
            )}
          </div>
        </div>
        
        {/* Barre de recherche mobile */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
    </nav>
  );
}
