'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTicketsByUserId } from '@/lib/data';
import { Ticket } from '@/types';
import { Share2, Copy, Check, Users, Mail, MessageCircle, Facebook, Linkedin } from 'lucide-react';

export default function InviteFriendsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [copied, setCopied] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (user) {
      const tickets = getTicketsByUserId(user.id);
      setMyTickets(tickets.filter(t => t.status === 'valid'));
      if (tickets.length > 0) {
        setSelectedTicket(tickets[0]);
      }
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (myTickets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Aucun billet à partager
            </h1>
            <p className="text-gray-600 mb-8">
              Vous devez d'abord acheter un billet pour inviter vos amis à un événement.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Découvrir les événements
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inviteUrl = selectedTicket 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/events/${selectedTicket.eventId}?ref=${user?.id}`
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Je viens d'acheter mon billet ! Rejoins-moi à cet événement 🎉\n${inviteUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Je vais à cet événement ! Rejoins-moi 🎉`)}&url=${encodeURIComponent(inviteUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteUrl)}`,
    email: `mailto:?subject=${encodeURIComponent('Invitation à un événement')}&body=${encodeURIComponent(`Salut !\n\nJe viens d'acheter mon billet pour un événement génial et je pense que ça pourrait te plaire aussi !\n\nClique ici pour voir les détails et réserver ta place :\n${inviteUrl}\n\nÀ bientôt !`)}`
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  // Grouper les billets par événement
  const ticketsByEvent = myTickets.reduce((acc, ticket) => {
    if (!acc[ticket.eventId]) {
      acc[ticket.eventId] = [];
    }
    acc[ticket.eventId].push(ticket);
    return acc;
  }, {} as Record<string, Ticket[]>);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
            <Users className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Invitez vos amis !
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Vous avez acheté un billet ? Partagez l'événement avec vos amis et créez des souvenirs ensemble !
          </p>
        </div>

        {/* Sélection de l'événement */}
        {Object.keys(ticketsByEvent).length > 1 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Choisissez l'événement à partager
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(ticketsByEvent).map(([eventId, tickets]) => (
                <button
                  key={eventId}
                  onClick={() => setSelectedTicket(tickets[0])}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTicket?.eventId === eventId
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">
                    {tickets.length} billet{tickets.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-600">Événement ID: {eventId}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Lien d'invitation */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Share2 className="w-6 h-6 text-indigo-600" />
              Votre lien d'invitation
            </h2>
            <p className="text-gray-600 mb-6">
              Partagez ce lien unique avec vos amis. Ils verront que vous participez à l'événement !
            </p>

            {/* Lien à copier */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="flex-1 bg-white px-4 py-3 rounded-lg border border-gray-300 text-sm font-mono text-gray-700"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copier
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Boutons de partage rapide */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Partager sur :</h3>
              
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors border border-green-200 group"
              >
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-600">Envoyer à vos contacts</p>
                </div>
              </button>

              <button
                onClick={() => handleShare('email')}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 group"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">Envoyer par email</p>
                </div>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200 group"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Facebook className="w-6 h-6 text-white fill-current" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">Facebook</p>
                  <p className="text-sm text-gray-600">Partager sur Facebook</p>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleShare('x')}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="font-semibold text-gray-900 text-sm">X</span>
                </button>

                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <Linkedin className="w-5 h-5 text-blue-700 fill-current" />
                  <span className="font-semibold text-gray-900 text-sm">LinkedIn</span>
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques et conseils */}
          <div className="space-y-8">
            {/* Avantages */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">
                Pourquoi inviter vos amis ?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    🎉
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Plus de fun ensemble</p>
                    <p className="text-sm text-indigo-100">
                      Profitez de l'événement avec vos amis et créez des souvenirs inoubliables
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    👥
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Aidez l'organisateur</p>
                    <p className="text-sm text-indigo-100">
                      En partageant, vous aidez à remplir l'événement et à le rendre encore meilleur
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    ⚡
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Places limitées</p>
                    <p className="text-sm text-indigo-100">
                      Les places partent vite ! Assurez-vous que vos amis réservent avant le sold out
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                💡 Conseils de partage
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>Personnalisez votre message pour chaque ami</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>Créez un groupe WhatsApp pour organiser le transport</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>Partagez vos stories sur Instagram avec le lien</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>Mentionnez pourquoi vous êtes excité par cet événement</span>
                </li>
              </ul>
            </div>

            {/* Mes billets */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📋 Mes billets
              </h2>
              <div className="space-y-3">
                {myTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{ticket.ticketType}</p>
                      <p className="text-sm text-gray-600">Billet #{ticket.ticketNumber}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                      Valide
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push('/tickets')}
                className="w-full mt-4 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors"
              >
                Voir tous mes billets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
