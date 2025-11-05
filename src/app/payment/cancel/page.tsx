'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, Home } from 'lucide-react';
import { SearchParamsProvider, useSearchParamsContext } from '@/components/SearchParamsProvider';

function PaymentCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParamsContext();
  const eventId = searchParams.get('eventId');

  useEffect(() => {
    // Vibration d'erreur
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 100, 100]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Icône d'annulation */}
          <div className="mb-8">
            <XCircle className="w-24 h-24 text-orange-500 mx-auto" />
          </div>

          {/* Titre */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Paiement annulé
          </h1>

          {/* Message */}
          <p className="text-xl text-gray-600 mb-8">
            Vous avez annulé le processus de paiement. Aucun montant n'a été débité.
          </p>

          {/* Informations */}
          <div className="bg-orange-50 rounded-2xl p-6 mb-8 border-2 border-orange-200">
            <p className="text-gray-700">
              Pas de souci ! Vous pouvez retourner à l'événement pour réessayer votre réservation quand vous le souhaitez.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {eventId && (
              <button
                onClick={() => router.push(`/events/${eventId}`)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour à l'événement
              </button>
            )}
            
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <SearchParamsProvider>
        <PaymentCancelContent />
      </SearchParamsProvider>
    </Suspense>
  );
}
