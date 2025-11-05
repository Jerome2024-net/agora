'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Calendar, MapPin, Users, Euro, Clock, User, ArrowLeft, CheckCircle, Ticket, UserPlus, CreditCard, Loader2 } from 'lucide-react';
import { getEventById, addReservation, getUserById } from '@/lib/data';
import { Reservation } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import ShareButtons from '@/components/ShareButtons';
import { getStripe } from '@/lib/stripe';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const eventId = params.id as string;
  const event = getEventById(eventId);
  const referrerId = searchParams.get('ref'); // ID de l'ami qui a partagé

  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [formData, setFormData] = useState({
    userName: user?.name || '',
    userEmail: user?.email || '',
    numberOfTickets: 1
  });

  // Mettre à jour le formulaire si l'utilisateur se connecte
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        userName: user.name,
        userEmail: user.email
      }));
    }
  }, [user]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Événement non trouvé</h1>
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  const availableSpots = event.capacity - event.registered;
  const percentFull = (event.registered / event.capacity) * 100;
  
  // Calculer le prix en fonction du type de billet sélectionné
  const getTicketPrice = () => {
    if (event.ticketTypes && event.ticketTypes.length > 0 && selectedTicketType) {
      const ticketType = event.ticketTypes.find(t => t.id === selectedTicketType);
      return ticketType?.price || 0;
    }
    return event.price;
  };

  // Calculer les frais de service (5% si événement payant et organisateur a Stripe Connect)
  const getServiceFee = () => {
    const ticketPrice = getTicketPrice();
    if (ticketPrice === 0) return 0;
    
    const organizer = getUserById(event.organizerId);
    if (!organizer?.stripeAccountId) return 0;
    
    const commissionRate = 0.05; // 5%
    return ticketPrice * formData.numberOfTickets * commissionRate;
  };

  // Calculer le total que le participant va payer
  const getTotalPrice = () => {
    const ticketPrice = getTicketPrice() * formData.numberOfTickets;
    const serviceFee = getServiceFee();
    return ticketPrice + serviceFee;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Si l'événement est gratuit, procéder comme avant
    if (getTicketPrice() === 0) {
      const reservation: Reservation = {
        id: Date.now().toString(),
        eventId: event.id,
        userId: user.id,
        userName: formData.userName,
        userEmail: formData.userEmail,
        numberOfTickets: formData.numberOfTickets,
        totalPrice: 0,
        reservationDate: new Date().toISOString(),
        status: 'confirmed',
        ticketCode: `TKT-${Date.now()}`
      };

      addReservation(reservation);
      setReservationSuccess(true);
      
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 200]);
      }
      
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKzn77RgGgU7k9r0yoErBSF1xe3ejzwIExu18NGpVBELTKXh7bllHAU2jdXvwoUqBSh+zPLaizsIHGy98OSbTQ');
      audio.volume = 0.3;
      audio.play().catch(() => {});
      
      setTimeout(() => {
        router.push('/tickets');
      }, 2000);
      return;
    }

    // Pour les événements payants, rediriger vers Stripe
    setIsProcessingPayment(true);

    try {
      // Préparer les données des billets
      const ticketType = event.ticketTypes?.find(t => t.id === selectedTicketType);
      const ticketsData = [{
        type: ticketType?.name || 'Standard',
        price: getTicketPrice(),
        quantity: formData.numberOfTickets,
        description: ticketType?.description || ''
      }];

      // Récupérer le compte Stripe de l'organisateur
      const organizer = getUserById(event.organizerId);
      const organizerStripeAccountId = organizer?.stripeAccountId || null;

      // Créer la session de paiement Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          eventImage: event.imageUrl,
          tickets: ticketsData,
          totalPrice: getTicketPrice() * formData.numberOfTickets,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          organizerStripeAccountId, // Ajout du compte Stripe Connect
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Rediriger vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      alert('Une erreur est survenue lors du paiement. Veuillez réessayer.');
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux événements
        </button>

        {/* Bandeau d'invitation */}
        {referrerId && referrerId !== user?.id && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <UserPlus className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">🎉 Invitation d'un ami !</h3>
                <p className="text-indigo-100">
                  Un de vos amis vous a invité à cet événement. Rejoignez-le et profitez ensemble !
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-96">
                <img 
                  src={event.imageUrl} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full text-sm font-semibold text-indigo-600">
                  {event.category}
                </div>
                {event.price === 0 && (
                  <div className="absolute top-6 left-6 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    GRATUIT
                  </div>
                )}
              </div>

              <div className="p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {event.title}
                  </h1>
                  <ShareButtons
                    title={event.title}
                    description={event.description}
                    url={`/events/${event.id}`}
                    imageUrl={event.imageUrl}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">
                        {new Date(event.date).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Heure</p>
                      <p className="font-semibold">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lieu</p>
                      <p className="font-semibold">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-3">
                      {event.organizerImage ? (
                        <img 
                          src={event.organizerImage} 
                          alt={event.organizer}
                          className="w-12 h-12 rounded-full object-cover border-3 border-indigo-300 shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center border-3 border-indigo-300 shadow-md">
                          <span className="text-xl font-bold text-white">
                            {event.organizer.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Organisateur</p>
                        <p className="font-semibold text-lg">{event.organizer}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    À propos de cet événement
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              {/* Types de billets personnalisés */}
              {event.ticketTypes && event.ticketTypes.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-indigo-600" />
                    Types de billets
                  </h3>
                  <div className="space-y-3">
                    {event.ticketTypes.map(ticketType => (
                      <div
                        key={ticketType.id}
                        onClick={() => setSelectedTicketType(ticketType.id)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedTicketType === ticketType.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{ticketType.name}</h4>
                            {ticketType.description && (
                              <p className="text-sm text-gray-600 mt-1">{ticketType.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-gray-500">
                                {ticketType.available} / {ticketType.quantity} disponibles
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="text-2xl font-bold text-indigo-600 flex items-center">
                              {ticketType.price}
                              <Euro className="w-5 h-5 ml-1" />
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{ width: `${(ticketType.available / ticketType.quantity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Prix unique si pas de types de billets */
                event.price > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">Prix par personne</p>
                    <p className="text-4xl font-bold text-indigo-600 flex items-center">
                      {event.price}
                      <Euro className="w-8 h-8 ml-1" />
                    </p>
                  </div>
                )
              )}

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Participants</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {event.registered} / {event.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      percentFull >= 90 ? 'bg-red-500' : 
                      percentFull >= 70 ? 'bg-orange-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${percentFull}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {availableSpots > 0 ? 
                    `${availableSpots} place${availableSpots > 1 ? 's' : ''} restante${availableSpots > 1 ? 's' : ''}` : 
                    'Événement complet'}
                </p>
              </div>

              {availableSpots > 0 && !showReservationForm && (
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      router.push('/auth');
                    } else {
                      setShowReservationForm(true);
                    }
                  }}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  {isAuthenticated ? 'Réserver maintenant' : 'Se connecter pour réserver'}
                </button>
              )}

              {showReservationForm && !reservationSuccess && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Sélection du type de billet si applicable */}
                  {event.ticketTypes && event.ticketTypes.length > 0 && !selectedTicketType && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-yellow-800 font-medium">
                        ⚠️ Veuillez sélectionner un type de billet ci-dessus
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      required
                      readOnly={isAuthenticated}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        isAuthenticated ? 'bg-gray-100' : ''
                      }`}
                      value={formData.userName}
                      onChange={(e) => setFormData({...formData, userName: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      readOnly={isAuthenticated}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        isAuthenticated ? 'bg-gray-100' : ''
                      }`}
                      value={formData.userEmail}
                      onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de billets
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={Math.min(availableSpots, selectedTicketType && event.ticketTypes ? 
                        event.ticketTypes.find(t => t.id === selectedTicketType)?.available || availableSpots : 
                        availableSpots)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formData.numberOfTickets}
                      onChange={(e) => setFormData({...formData, numberOfTickets: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-2 mb-4">
                      {/* Prix des billets */}
                      <div className="flex justify-between items-center text-gray-700">
                        <span>
                          {formData.numberOfTickets} billet{formData.numberOfTickets > 1 ? 's' : ''} × {getTicketPrice()}€
                        </span>
                        <span className="font-semibold">
                          {(getTicketPrice() * formData.numberOfTickets).toFixed(2)}€
                        </span>
                      </div>

                      {/* Frais de service (si applicable) */}
                      {getServiceFee() > 0 && (
                        <div className="flex justify-between items-center text-gray-600 text-sm">
                          <span className="flex items-center gap-1">
                            💼 Frais de service (5%)
                            <span className="inline-flex items-center justify-center w-4 h-4 text-xs bg-gray-200 rounded-full cursor-help" title="Frais de plateforme permettant le paiement sécurisé et les services Agora">
                              ?
                            </span>
                          </span>
                          <span className="font-medium">
                            +{getServiceFee().toFixed(2)}€
                          </span>
                        </div>
                      )}

                      {/* Ligne de séparation */}
                      <div className="border-t border-gray-200 pt-2"></div>

                      {/* Total */}
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-lg">Total</span>
                        <span className="text-3xl font-bold text-indigo-600 flex items-center">
                          {getTotalPrice().toFixed(2)}
                          <Euro className="w-7 h-7 ml-1" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={(event.ticketTypes && event.ticketTypes.length > 0 && !selectedTicketType) || isProcessingPayment}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Redirection vers le paiement...</span>
                      </>
                    ) : getTicketPrice() === 0 ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Confirmer la réservation gratuite</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>Procéder au paiement sécurisé</span>
                      </>
                    )}
                  </button>

                  {getTicketPrice() > 0 && (
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                      <img src="https://stripe.com/img/v3/home/social.png" alt="Stripe" className="h-6" />
                      <span>Paiement sécurisé par Stripe</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowReservationForm(false)}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                </form>
              )}

              {reservationSuccess && (
                <div className="space-y-4">
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center animate-pulse">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      🎉 Réservation confirmée !
                    </h3>
                    <p className="text-green-700 mb-4">
                      Votre réservation a été enregistrée avec succès.
                    </p>
                    
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-300 mb-4">
                      <div className="flex items-center justify-center gap-2 text-indigo-700 mb-2">
                        <Ticket className="w-5 h-5 animate-pulse" />
                        <span className="font-semibold">Vos billets sont prêts !</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Vous allez être redirigé vers vos billets dans quelques secondes...
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      <span>Redirection en cours...</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => router.push('/tickets')}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-5 h-5" />
                    Voir mes billets
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}