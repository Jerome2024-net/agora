'use client';

import { Suspense } from 'react';
import { getEvents } from '@/lib/data';
import EventCard from '@/components/EventCard';
import { useState, useEffect } from 'react';
import { Filter, Calendar, MapPin, TrendingUp, Sparkles, Grid3x3, List, Target, Music, Utensils, Laptop, Trophy, Palette, BookOpen, Users, Ticket, Clock } from 'lucide-react';
import { SearchParamsProvider, useSearchParamsContext } from '@/components/SearchParamsProvider';

function HomeContent() {
  const searchParams = useSearchParamsContext();
  const searchQuery = searchParams.get('search') || '';
  const allEvents = getEvents();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedCount, setAnimatedCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Images du carrousel pour le header - Ultra haute qualité 4K
  const headerImages = [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=3840&q=100&fit=crop&auto=format', // Concert/Musique
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=3840&q=100&fit=crop&auto=format', // Événement/Foule
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=3840&q=100&fit=crop&auto=format', // Festival
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=3840&q=100&fit=crop&auto=format', // Conférence
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=3840&q=100&fit=crop&auto=format', // DJ/Musique
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=3840&q=100&fit=crop&auto=format', // Restaurant
  ];

  // Carrousel automatique d'images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % headerImages.length);
    }, 5000); // Change d'image toutes les 5 secondes
    
    return () => clearInterval(interval);
  }, []);

  // Éviter l'erreur d'hydration avec le temps réel
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation du temps réel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animation du compteur d'événements
  useEffect(() => {
    const target = allEvents.length;
    const duration = 2000; // 2 secondes
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedCount(target);
        clearInterval(counter);
      } else {
        setAnimatedCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(counter);
  }, [allEvents.length]);
  
  const categories = [
    { name: 'Tous', icon: Target, color: 'indigo' },
    { name: 'Musique', icon: Music, color: 'purple' },
    { name: 'Gastronomie', icon: Utensils, color: 'orange' },
    { name: 'Technologie', icon: Laptop, color: 'blue' },
    { name: 'Sport', icon: Trophy, color: 'green' },
    { name: 'Art', icon: Palette, color: 'pink' },
    { name: 'Culture', icon: BookOpen, color: 'yellow' }
  ];
  
  // Filtrer les événements
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Événements à venir (triés par date)
  const upcomingEvents = filteredEvents
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Calculer les statistiques en temps réel
  const totalTickets = allEvents.reduce((sum, event) => sum + event.capacity, 0);
  const soldTickets = allEvents.reduce((sum, event) => sum + event.registered, 0);
  const nextEventDate = upcomingEvents[0] ? new Date(upcomingEvents[0].date) : null;
  const timeUntilNextEvent = nextEventDate ? Math.floor((nextEventDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section avec carrousel d'images */}
      <div className="relative text-white py-12 px-4 mb-8 overflow-hidden">
        {/* Carrousel d'images de fond avec transition smooth */}
        <div className="absolute inset-0 overflow-hidden">
          {headerImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Event ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient pour lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-pink-900/80"></div>
            </div>
          ))}
          
          {/* Indicateurs de carrousel */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {headerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Image ${index + 1}`}
              />
            ))}
          </div>
          
        </div>

        <div className="max-w-[1800px] mx-auto relative z-10">
          {/* Heure en temps réel */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30">
              <Clock className="w-5 h-5 animate-pulse" />
              <div className="flex items-baseline gap-2">
                {isMounted ? (
                  <>
                    <span className="text-3xl font-bold tabular-nums">
                      {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className="text-sm opacity-80">
                      {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold tabular-nums">--:--:--</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Filtres par catégorie - Version améliorée */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-bold text-gray-900">Catégories</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map(category => {
              const isSelected = selectedCategory === category.name;
              
              // Classes de gradient selon la couleur
              let gradientClass = '';
              if (isSelected) {
                switch(category.color) {
                  case 'indigo': gradientClass = 'bg-gradient-to-br from-indigo-500 to-indigo-600'; break;
                  case 'purple': gradientClass = 'bg-gradient-to-br from-purple-500 to-purple-600'; break;
                  case 'orange': gradientClass = 'bg-gradient-to-br from-orange-500 to-orange-600'; break;
                  case 'blue': gradientClass = 'bg-gradient-to-br from-blue-500 to-blue-600'; break;
                  case 'green': gradientClass = 'bg-gradient-to-br from-green-500 to-green-600'; break;
                  case 'pink': gradientClass = 'bg-gradient-to-br from-pink-500 to-pink-600'; break;
                  case 'yellow': gradientClass = 'bg-gradient-to-br from-yellow-500 to-yellow-600'; break;
                }
              }
              
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                    isSelected
                      ? `${gradientClass} text-white shadow-lg scale-105`
                      : 'bg-white text-gray-700 hover:shadow-md hover:scale-102 border-2 border-gray-100'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <category.icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="text-sm font-semibold">{category.name}</div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-white/30 backdrop-blur-sm rounded-full p-1">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Compteur de résultats - Version améliorée */}
        {searchQuery && (
          <div className="mb-6 bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
            <p className="text-gray-700">
              <span className="font-bold text-indigo-600 text-lg">{filteredEvents.length}</span> 
              {' '}résultat{filteredEvents.length > 1 ? 's' : ''} pour 
              <span className="font-semibold text-gray-900"> "{searchQuery}"</span>
            </p>
          </div>
        )}

        {/* Section événements à venir */}
        {!searchQuery && upcomingEvents.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">Événements à venir</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-1">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid/List d'événements */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery ? 'Résultats de recherche' : 'Tous les événements'}
          </h2>
          
          {/* Toggle Grid/List */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-md border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Vue grille"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Vue liste"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <>
            {/* Vue GRID */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} viewMode="grid" />
                ))}
              </div>
            )}

            {/* Vue LIST */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} viewMode="list" />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="relative overflow-hidden">
            {/* Fond dégradé moderne */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2RjEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItMnptMCAwdjItMnptMCAwdjItMnptMCAwdjItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
            
            <div className="relative text-center py-20 px-6">
              {/* Badge supérieur */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-indigo-200 mb-8">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">Plateforme prête • 0 événement publié</span>
              </div>

              {/* Titre principal avec gradient moderne */}
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
                <span className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Lancez votre
                </span>
                <br/>
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  premier événement
                </span>
              </h2>

              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Soyez pionnier et créez l'événement qui va lancer cette communauté.<br/>
                <strong className="text-gray-900">Visibilité maximale garantie.</strong>
              </p>

              {/* Cartes d'avantages avec icônes réalistes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
                {/* Carte 1 - Revenus */}
                <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">100% des revenus</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Recevez la totalité du prix des billets. Les frais (5%) sont à la charge des participants.
                    </p>
                  </div>
                </div>

                {/* Carte 2 - Paiements */}
                <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Paiements instantanés</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Recevez l'argent immédiatement après chaque vente via Stripe Connect.
                    </p>
                  </div>
                </div>

                {/* Carte 3 - Visibilité */}
                <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Visibilité maximale</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Première page garantie et mise en avant dès le lancement de la plateforme.
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to action principal */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <button
                  onClick={() => window.location.href = '/auth'}
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:shadow-indigo-500/50 transform hover:scale-105"
                >
                  <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Créer mon événement</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => window.location.href = '/auth'}
                  className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-5 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-gray-300 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>En savoir plus</span>
                </button>
              </div>

              {/* Stats en bas */}
              <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 pt-12 border-t border-gray-200">
                <div>
                  <div className="text-4xl font-black text-indigo-600 mb-2">0</div>
                  <div className="text-sm font-medium text-gray-600">Événements publiés</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-purple-600 mb-2">∞</div>
                  <div className="text-sm font-medium text-gray-600">Potentiel de croissance</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-pink-600 mb-2">1er</div>
                  <div className="text-sm font-medium text-gray-600">Soyez le pionnier</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <SearchParamsProvider>
        <HomeContent />
      </SearchParamsProvider>
    </Suspense>
  );
}