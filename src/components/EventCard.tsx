import Link from 'next/link';
import { Calendar, MapPin, Users, Euro, Clock, Ticket } from 'lucide-react';
import { Event } from '@/types';
import ShareButtons from './ShareButtons';

interface EventCardProps {
  event: Event;
  viewMode?: 'grid' | 'list' | 'map';
}

export default function EventCard({ event, viewMode = 'grid' }: EventCardProps) {
  const date = new Date(event.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const time = new Date(event.date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const availableSpots = event.capacity - event.registered;
  const percentFull = (event.registered / event.capacity) * 100;

  // Prix le plus bas parmi les tickets
  const ticketTypes = event.ticketTypes || [];
  const minPrice = ticketTypes.length > 0 
    ? Math.min(...ticketTypes.map((t: { price: number }) => t.price))
    : event.price;
  const maxPrice = ticketTypes.length > 0 
    ? Math.max(...ticketTypes.map((t: { price: number }) => t.price))
    : event.price;

  const getPriceRange = () => {
    if (minPrice === 0 && maxPrice === 0) return 'Gratuit';
    if (minPrice === maxPrice) return `${minPrice}€`;
    return `${minPrice}€ - ${maxPrice}€`;
  };

  // Icône par catégorie
  const getCategoryIcon = () => {
    switch(event.category) {
      case 'Musique': return '🎵';
      case 'Gastronomie': return '🍽️';
      case 'Technologie': return '💻';
      case 'Sport': return '⚽';
      case 'Art': return '🎨';
      case 'Culture': return '📚';
      default: return '🎯';
    }
  };

  // Mode MAP - Carte circulaire
  if (viewMode === 'map') {
    return (
      <Link href={`/events/${event.id}`} className="group block">
        <div className="relative">
          {/* Cercle principal avec image */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl relative group-hover:scale-110 transition-transform duration-300">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
            
            {/* Prix en bas */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-center">
              <p className="text-white font-bold text-sm">{getPriceRange()}</p>
            </div>
          </div>

          {/* Badge de titre sous le cercle */}
          <div className="mt-2 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-indigo-200 max-w-[200px] mx-auto">
            <h3 className="text-sm font-bold text-gray-900 text-center truncate group-hover:text-indigo-600 transition-colors">
              {event.title}
            </h3>
          </div>

          {/* Badge de date */}
          <div className="mt-1 bg-indigo-50 rounded-full px-3 py-1 max-w-[180px] mx-auto">
            <p className="text-xs text-indigo-600 text-center font-medium flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </p>
          </div>

          {/* Badge de localisation */}
          <div className="mt-1 bg-purple-50 rounded-full px-3 py-1 max-w-[180px] mx-auto">
            <p className="text-xs text-purple-600 text-center font-medium flex items-center justify-center gap-1 truncate">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{event.location.split(',')[0]}</span>
            </p>
          </div>

          {/* Indicateur de places */}
          <div className="mt-1 flex items-center justify-center">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              availableSpots === 0 ? 'bg-red-100 text-red-600' :
              availableSpots < 10 ? 'bg-orange-100 text-orange-600' :
              'bg-green-100 text-green-600'
            }`}>
              {availableSpots > 0 ? `${availableSpots} places` : 'Complet'}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Mode Liste - Layout horizontal
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
        <Link href={`/events/${event.id}`} className="group flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative md:w-80 h-48 md:h-auto flex-shrink-0">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-indigo-600 shadow-lg">
              {event.category}
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 flex-1">
                {event.title}
              </h3>
              <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-xl ml-4">
                <Euro className="w-5 h-5" />
                <span>{getPriceRange()}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {event.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                {event.organizerImage && (
                  <img src={event.organizerImage} alt={event.organizer} className="w-5 h-5 rounded-full" />
                )}
                <span>{event.organizer}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{event.registered} / {event.capacity}</span>
              </div>
              <div className="w-48">
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      percentFull >= 90 ? 'bg-red-500' : 
                      percentFull >= 70 ? 'bg-orange-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${percentFull}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Mode Grille - Layout vertical (défaut)
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col h-full relative">
      <Link href={`/events/${event.id}`} className="flex-1 flex flex-col">
        {/* Image ou Vidéo avec overlay */}
        <div className="relative h-56 overflow-hidden">
          {event.videoUrl ? (
            <>
              <video
                src={event.videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              {/* Badge vidéo */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 animate-pulse">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                VIDÉO
              </div>
            </>
          ) : (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Badge catégorie */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-indigo-600 shadow-lg flex items-center gap-1.5">
            <span>{getCategoryIcon()}</span>
            <span>{event.category}</span>
          </div>

          {/* Badge gratuit */}
          {minPrice === 0 && maxPrice === 0 && !event.videoUrl && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
              ✨ GRATUIT
            </div>
          )}

          {/* Badge plusieurs tarifs */}
          {ticketTypes.length > 1 && minPrice !== maxPrice && !event.videoUrl && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
              <Ticket className="w-3 h-3" />
              <span>Plusieurs tarifs</span>
            </div>
          )}

          {/* Prix sur l'image */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
            <div className="flex items-center gap-1.5">
              <Euro className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-lg text-gray-900">{getPriceRange()}</span>
            </div>
          </div>
        </div>

        {/* Contenu de la carte */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {event.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="truncate">{date} • {time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              {event.organizerImage && (
                <img 
                  src={event.organizerImage} 
                  alt={event.organizer} 
                  className="w-5 h-5 rounded-full flex-shrink-0"
                />
              )}
              <span className="truncate">{event.organizer}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>{event.registered} / {event.capacity} participants</span>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-auto">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  percentFull >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                  percentFull >= 70 ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 
                  'bg-gradient-to-r from-green-500 to-green-600'
                }`}
                style={{ width: `${percentFull}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {availableSpots > 0 
                ? `🎫 ${availableSpots} place${availableSpots > 1 ? 's' : ''} disponible${availableSpots > 1 ? 's' : ''}`
                : '❌ Complet'
              }
            </p>
          </div>
        </div>
      </Link>

      {/* Bouton de partage (apparaît au hover) */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ShareButtons 
          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/events/${event.id}`}
          title={event.title}
          description={event.description}
        />
      </div>
    </div>
  );
}
