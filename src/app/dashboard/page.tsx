'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getEvents, getReservationsByEventId, getTicketsByEventId, validateTicket } from '@/lib/data';
import { Event, Ticket } from '@/types';
import { BarChart3, Users, Euro, CheckCircle, X, QrCode, Search, Filter, Download, Camera, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventTickets, setEventTickets] = useState<Ticket[]>([]);
  const [scanMode, setScanMode] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'used' | 'cancelled'>('all');
  const [validationResult, setValidationResult] = useState<{ success: boolean; message: string; ticket?: Ticket } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (user?.type !== 'organizer') {
      router.push('/');
      return;
    }

    // Charger les événements de l'organisateur
    const allEvents = getEvents();
    const organizerEvents = allEvents.filter(e => e.organizerId === user.id);
    setMyEvents(organizerEvents);
  }, [isAuthenticated, user, router]);

  const loadEventTickets = (event: Event) => {
    setSelectedEvent(event);
    const tickets = getTicketsByEventId(event.id);
    setEventTickets(tickets);
  };

  const handleValidateTicket = () => {
    if (ticketCode.trim()) {
      const tickets = getTicketsByEventId('all'); // Récupérer tous les tickets
      const ticket = tickets.find(t => t.id === ticketCode.trim());
      
      if (!ticket) {
        setValidationResult({
          success: false,
          message: '❌ Billet introuvable dans le système'
        });
        // Vibration d'erreur
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      } else if (ticket.status === 'cancelled') {
        setValidationResult({
          success: false,
          message: '❌ Ce billet a été annulé',
          ticket
        });
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      } else if (ticket.status === 'used') {
        setValidationResult({
          success: false,
          message: `⚠️ Billet déjà utilisé le ${new Date(ticket.usedDate!).toLocaleString('fr-FR')}`,
          ticket
        });
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      } else {
        const success = validateTicket(ticketCode.trim());
        if (success) {
          setValidationResult({
            success: true,
            message: '✅ Billet validé avec succès !',
            ticket
          });
          // Vibration de succès
          if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100, 50, 300]);
          }
          // Son de succès
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKzn77RgGgU7k9r0yoErBSF1xe3ejzwIExu18NGpVBELTKXh7bllHAU2jdXvwoUqBSh+zPLaizsIHGy98OSbTQ');
          audio.volume = 0.3;
          audio.play().catch(() => {});
          
          if (selectedEvent) {
            loadEventTickets(selectedEvent);
          }
        }
      }
      
      setTicketCode('');
      
      // Auto-clear après 5 secondes
      setTimeout(() => {
        setValidationResult(null);
      }, 5000);
    }
  };

  const filteredTickets = eventTickets.filter(ticket => {
    const matchesSearch = ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const exportTickets = () => {
    if (!selectedEvent) return;
    
    const csv = [
      ['ID Billet', 'Nom', 'Email', 'Type', 'Prix', 'Statut', 'Date Achat', 'Date Utilisation'].join(','),
      ...eventTickets.map(t => [
        t.id,
        t.userName,
        t.userEmail,
        t.ticketType,
        t.ticketPrice,
        t.status,
        new Date(t.purchaseDate).toLocaleString('fr-FR'),
        t.usedDate ? new Date(t.usedDate).toLocaleString('fr-FR') : ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billets-${selectedEvent.title.replace(/\s+/g, '-')}-${Date.now()}.csv`;
    a.click();
  };

  if (!isAuthenticated || user?.type !== 'organizer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const totalRevenue = myEvents.reduce((sum, event) => sum + (event.registered * event.price), 0);
  const totalParticipants = myEvents.reduce((sum, event) => sum + event.registered, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Organisateur</h1>
          <p className="text-gray-600">Gérez vos événements et validez les billets</p>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-4 rounded-lg">
                <BarChart3 className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Événements</p>
                <p className="text-3xl font-bold text-gray-900">{myEvents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-lg">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Participants</p>
                <p className="text-3xl font-bold text-gray-900">{totalParticipants}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-lg">
                <Euro className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Revenus</p>
                <p className="text-3xl font-bold text-gray-900">{totalRevenue} €</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scanner de billets */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <QrCode className="w-6 h-6 text-indigo-600" />
            Scanner de Billets
          </h2>
          
          {validationResult && (
            <div className={`mb-4 p-4 rounded-lg border-2 ${
              validationResult.success 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            } animate-pulse`}>
              <div className="flex items-start gap-3">
                {validationResult.success ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-bold text-lg ${
                    validationResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {validationResult.message}
                  </p>
                  {validationResult.ticket && (
                    <div className="mt-2 text-sm">
                      <p className="text-gray-700">
                        <strong>Participant :</strong> {validationResult.ticket.userName}
                      </p>
                      <p className="text-gray-700">
                        <strong>Email :</strong> {validationResult.ticket.userEmail}
                      </p>
                      <p className="text-gray-700">
                        <strong>Type :</strong> {validationResult.ticket.ticketType} ({validationResult.ticket.ticketPrice}€)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Entrez ou scannez le code du billet (ex: 1730554876123-1)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-mono"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleValidateTicket()}
              autoFocus
            />
            <button
              onClick={handleValidateTicket}
              disabled={!ticketCode.trim()}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Valider
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Camera className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">💡 Astuce : Utilisez un scanner QR code</p>
                <p>Les scanners QR code USB/Bluetooth fonctionnent comme un clavier et saisissent automatiquement le code du billet dans le champ ci-dessus.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des événements */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes Événements</h2>
          
          {myEvents.length > 0 ? (
            <div className="space-y-4">
              {myEvents.map((event) => {
                const reservations = getReservationsByEventId(event.id);
                const tickets = getTicketsByEventId(event.id);
                const validTickets = tickets.filter(t => t.status === 'valid').length;
                const usedTickets = tickets.filter(t => t.status === 'used').length;
                const percentFull = (event.registered / event.capacity) * 100;

                return (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{event.location}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-gray-600">
                            📅 {new Date(event.date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="text-gray-600">
                            👥 {event.registered}/{event.capacity}
                          </span>
                          <span className="text-gray-600">
                            💰 {event.registered * event.price} €
                          </span>
                        </div>

                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              percentFull >= 90 ? 'bg-red-500' :
                              percentFull >= 70 ? 'bg-orange-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${percentFull}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="text-center bg-green-50 px-4 py-2 rounded-lg">
                          <p className="text-xs text-gray-600">Billets valides</p>
                          <p className="text-2xl font-bold text-green-600">{validTickets}</p>
                        </div>
                        <div className="text-center bg-gray-50 px-4 py-2 rounded-lg">
                          <p className="text-xs text-gray-600">Billets utilisés</p>
                          <p className="text-2xl font-bold text-gray-600">{usedTickets}</p>
                        </div>
                        <button
                          onClick={() => loadEventTickets(event)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm"
                        >
                          Voir les billets
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Vous n'avez pas encore créé d'événements</p>
              <button
                onClick={() => router.push('/create')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Créer un événement
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal liste des billets */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Billets - {selectedEvent.title}
                </h2>
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Statistiques rapides */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{eventTickets.length}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {eventTickets.filter(t => t.status === 'valid').length}
                  </p>
                  <p className="text-xs text-gray-600">Valides</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {eventTickets.filter(t => t.status === 'used').length}
                  </p>
                  <p className="text-xs text-gray-600">Utilisés</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {eventTickets.filter(t => t.status === 'cancelled').length}
                  </p>
                  <p className="text-xs text-gray-600">Annulés</p>
                </div>
              </div>

              {/* Filtres et recherche */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou code..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="valid">Valides</option>
                    <option value="used">Utilisés</option>
                    <option value="cancelled">Annulés</option>
                  </select>
                  <button
                    onClick={exportTickets}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-3">
                {filteredTickets.length} billet{filteredTickets.length > 1 ? 's' : ''} affiché{filteredTickets.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="overflow-y-auto p-6">
              {filteredTickets.length > 0 ? (
                <div className="space-y-3">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`border-2 rounded-lg p-4 transition-all ${
                        ticket.status === 'valid' ? 'border-green-200 bg-green-50 hover:border-green-400' :
                        ticket.status === 'used' ? 'border-gray-200 bg-gray-50 hover:border-gray-400' :
                        'border-red-200 bg-red-50 hover:border-red-400'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <img 
                            src={ticket.qrCode}
                            alt={`QR ${ticket.id}`}
                            className="w-20 h-20 rounded-lg border-2 border-gray-300"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-lg">
                              {ticket.userName}
                            </p>
                            <p className="text-sm text-gray-600">{ticket.userEmail}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs bg-white px-2 py-1 rounded border border-gray-300">
                                {ticket.ticketType}
                              </span>
                              <span className="text-xs bg-white px-2 py-1 rounded border border-gray-300 font-semibold text-indigo-600">
                                {ticket.ticketPrice}€
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-mono mt-2">
                              ID: {ticket.id}
                            </p>
                            <p className="text-xs text-gray-500">
                              Acheté le {new Date(ticket.purchaseDate).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                            ticket.status === 'valid' ? 'bg-green-500 text-white' :
                            ticket.status === 'used' ? 'bg-gray-400 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {ticket.status === 'valid' ? '✓ VALIDE' :
                             ticket.status === 'used' ? '✓ UTILISÉ' :
                             '✗ ANNULÉ'}
                          </span>
                          {ticket.usedDate && (
                            <p className="text-xs text-gray-600 mt-2">
                              Validé le<br/>{new Date(ticket.usedDate).toLocaleString('fr-FR')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Aucun billet ne correspond aux critères'
                      : 'Aucun billet pour cet événement'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
