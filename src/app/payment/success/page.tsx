'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Ticket, Home, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [showConfetti, setShowConfetti] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Vibration de succès
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }

    // Son de succès
    const audio = new Audio('data:audio/wav;base64,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');
    audio.play().catch(() => {});

    // Arrêter les confettis après 5 secondes
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);

    // Compte à rebours pour la redirection
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          router.push('/tickets');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(confettiTimer);
      clearInterval(countdownInterval);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 0}
          height={typeof window !== 'undefined' ? window.innerHeight : 0}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Décoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>
          
          {/* Icône de succès animée */}
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto relative animate-bounce" />
          </div>

          {/* Titre */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            Paiement réussi ! <Sparkles className="w-8 h-8 text-yellow-500" />
          </h1>

          {/* Message de confirmation */}
          <p className="text-xl text-gray-600 mb-8">
            Votre réservation a été confirmée avec succès
          </p>

          {/* Info session */}
          {sessionId && (
            <div className="bg-gray-50 rounded-xl p-4 mb-8 border-2 border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
              <p className="font-mono text-xs text-gray-700 break-all">{sessionId}</p>
            </div>
          )}

          {/* Informations */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4 text-left">
              <Ticket className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Vos billets sont prêts !</h3>
                <p className="text-gray-600 text-sm">
                  Vous allez être automatiquement redirigé vers votre page de billets dans <span className="font-bold text-indigo-600">{countdown} secondes</span>. 
                  Vous pourrez y retrouver vos QR codes à présenter le jour de l'événement.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/tickets')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Ticket className="w-5 h-5" />
              Voir mes billets maintenant
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </button>
          </div>

          {/* Footer message */}
          <p className="mt-8 text-sm text-gray-500">
            💌 Un email de confirmation vous sera également envoyé
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
