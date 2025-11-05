'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTicketsByUserId, getEventById } from '@/lib/data';
import { Ticket } from '@/types';
import { Ticket as TicketIcon, Calendar, MapPin, QrCode, Download, X, Users } from 'lucide-react';

export default function MyTicketsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (user) {
      const userTickets = getTicketsByUserId(user.id);
      setTickets(userTickets);
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      valid: 'bg-green-100 text-green-800 border-green-300',
      used: 'bg-gray-100 text-gray-800 border-gray-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    const labels = {
      valid: '✓ Valide',
      used: '✓ Utilisé',
      cancelled: '✗ Annulé'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Billets</h1>
            <p className="text-gray-600">
              Vous avez <span className="font-semibold text-indigo-600">{tickets.length}</span> billet{tickets.length > 1 ? 's' : ''}
            </p>
          </div>
          {tickets.length > 0 && (
            <button
              onClick={() => router.push('/invite')}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Users className="w-5 h-5" />
              Inviter des amis
            </button>
          )}
        </div>

        {tickets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => {
              const event = getEventById(ticket.eventId);
              if (!event) return null;

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="relative h-40">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {event.title}
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span>
                          {new Date(event.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} à {event.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <TicketIcon className="w-4 h-4 text-indigo-600" />
                        <span>Billet #{ticket.ticketNumber}</span>
                      </div>
                    </div>

                    <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                      <QrCode className="w-5 h-5" />
                      Afficher le QR Code
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl">
            <TicketIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Aucun billet
            </h3>
            <p className="text-gray-500 mb-6">
              Vous n'avez pas encore réservé d'événements
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Découvrir les événements
            </button>
          </div>
        )}
      </div>

      {/* Modal QR Code */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Votre Billet
            </h2>

            <div className="text-center space-y-4">
              {/* QR Code */}
              <div className="bg-gray-100 p-6 rounded-xl">
                <img
                  src={selectedTicket.qrCode}
                  alt="QR Code"
                  className="w-full max-w-xs mx-auto"
                />
              </div>

              {/* Infos du billet */}
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-mono font-semibold text-lg text-indigo-600">
                  {selectedTicket.id}
                </p>
                <p>Billet #{selectedTicket.ticketNumber}</p>
                <p>{selectedTicket.userName}</p>
                <div className="pt-2">
                  {getStatusBadge(selectedTicket.status)}
                </div>
              </div>

              {selectedTicket.status === 'valid' && (
                <p className="text-xs text-gray-500 mt-4">
                  Présentez ce QR code à l'entrée de l'événement
                </p>
              )}

              {selectedTicket.status === 'used' && selectedTicket.usedDate && (
                <p className="text-xs text-gray-500 mt-4">
                  Utilisé le {new Date(selectedTicket.usedDate).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full mt-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
