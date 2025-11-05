'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Calendar, UserCircle, Camera, CreditCard, CheckCircle, XCircle, AlertCircle, ExternalLink, Loader2, Wallet } from 'lucide-react';
import { SearchParamsProvider, useSearchParamsContext } from '@/components/SearchParamsProvider';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParamsContext();
  const { user, isAuthenticated, updateProfileImage, updateStripeAccount } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<'not_connected' | 'pending' | 'active' | 'restricted'>('not_connected');
  const [showStripeSuccess, setShowStripeSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Images du carrousel pour le header - Ultra haute qualité 4K
  const headerImages = [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=3840&q=100&fit=crop&auto=format', // Concert/Musique
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=3840&q=100&fit=crop&auto=format', // Événement/Foule
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=3840&q=100&fit=crop&auto=format', // Festival
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=3840&q=100&fit=crop&auto=format', // Conférence
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=3840&q=100&fit=crop&auto=format', // DJ/Musique
  ];

  // Carrousel automatique d'images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % headerImages.length);
    }, 5000); // Change d'image toutes les 5 secondes
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    // Vérifier les paramètres de retour de Stripe
    const stripeSuccess = searchParams.get('stripe_success');
    const stripeRefresh = searchParams.get('stripe_refresh');

    if (stripeSuccess && user?.stripeAccountId) {
      setShowStripeSuccess(true);
      setTimeout(() => setShowStripeSuccess(false), 5000);
      // Vérifier le statut du compte
      checkStripeAccountStatus(user.stripeAccountId);
      // Enlever le flag d'onboarding (une seule fois)
      if (user.needsStripeOnboarding) {
        updateStripeAccount({ needsStripeOnboarding: false });
      }
    }

    if (stripeRefresh) {
      alert('Veuillez terminer la configuration de votre compte Stripe.');
    }

    // 🚀 REDIRECTION AUTOMATIQUE VERS ONBOARDING STRIPE (une seule fois)
    if (user?.type === 'organizer' && user.needsStripeOnboarding && user.stripeAccountId && !stripeSuccess && !stripeRefresh) {
      console.log('🔄 Redirection automatique vers onboarding Stripe...');
      launchStripeOnboarding(user.stripeAccountId);
    }

    // Charger le statut Stripe si l'utilisateur a un compte (sans déclencher de mise à jour)
    if (user?.stripeAccountId && user.stripeAccountStatus) {
      setStripeStatus(user.stripeAccountStatus);
    }
  }, [isAuthenticated, router, searchParams.get('stripe_success'), searchParams.get('stripe_refresh'), user?.stripeAccountId, user?.needsStripeOnboarding, user?.type]);

  const checkStripeAccountStatus = async (accountId: string) => {
    try {
      const response = await fetch(`/api/stripe/connect?accountId=${accountId}`);
      const data = await response.json();
      
      if (data.success && data.account) {
        const newStatus = data.account.status;
        
        // Mettre à jour seulement si le statut a changé
        if (newStatus !== stripeStatus) {
          setStripeStatus(newStatus);
          
          // Mettre à jour le contexte utilisateur seulement si nécessaire
          updateStripeAccount({
            stripeAccountStatus: newStatus,
            stripeDetailsSubmitted: data.account.detailsSubmitted,
            stripeChargesEnabled: data.account.chargesEnabled,
            stripePayoutsEnabled: data.account.payoutsEnabled,
          });
        }
      }
    } catch (error) {
      console.error('Erreur vérification compte Stripe:', error);
    }
  };

  const launchStripeOnboarding = async (accountId: string) => {
    if (!user) return;
    
    setStripeLoading(true);
    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          existingAccountId: accountId, // Utiliser le compte déjà créé
        }),
      });

      const data = await response.json();

      if (data.success && data.onboardingUrl) {
        console.log('✅ Lancement onboarding Stripe automatique');
        // Rediriger vers Stripe pour l'onboarding
        window.location.href = data.onboardingUrl;
      } else {
        console.warn('⚠️ Impossible de lancer l\'onboarding Stripe');
        // Enlever le flag pour ne pas boucler
        updateStripeAccount({ needsStripeOnboarding: false });
      }
    } catch (error) {
      console.error('Erreur lancement onboarding:', error);
      // Enlever le flag pour ne pas boucler
      updateStripeAccount({ needsStripeOnboarding: false });
    } finally {
      setStripeLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    if (!user) return;
    
    setStripeLoading(true);
    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
        }),
      });

      const data = await response.json();

      if (data.success && data.onboardingUrl) {
        // Sauvegarder l'accountId dans le contexte avant la redirection
        updateStripeAccount({
          stripeAccountId: data.accountId,
          stripeOnboardingComplete: false,
          stripeAccountStatus: 'pending',
        });
        
        // Rediriger vers Stripe pour l'onboarding
        window.location.href = data.onboardingUrl;
      } else {
        // Message d'erreur plus clair - vérifier data.error ET data.details
        const errorMessage = data.details || data.error || 'Erreur inconnue';
        
        if (errorMessage.includes('platform profile') || errorMessage.includes('responsibilities') || errorMessage.includes('complete your platform')) {
          alert(`⚠️ Configuration Stripe requise\n\n` +
                `Avant de créer des comptes Connect, vous devez compléter votre profil de plateforme Stripe :\n\n` +
                `1. Allez sur : https://dashboard.stripe.com/settings/connect/platform-profile\n` +
                `2. Remplissez TOUTES les informations\n` +
                `3. Acceptez les responsabilités de gestion des pertes ✅\n` +
                `4. Enregistrez\n` +
                `5. Revenez ici et réessayez\n\n` +
                `Erreur Stripe : ${errorMessage}`);
        } else {
          alert(`Erreur lors de la connexion à Stripe.\n\n${errorMessage}\n\nVeuillez réessayer.`);
        }
      }
    } catch (error) {
      console.error('Erreur connexion Stripe:', error);
      alert('Erreur lors de la connexion à Stripe.');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleOpenStripeDashboard = async () => {
    if (!user?.stripeAccountId) return;
    
    setStripeLoading(true);
    try {
      const response = await fetch('/api/stripe/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: user.stripeAccountId,
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.open(data.url, '_blank');
      } else {
        alert('Erreur d\'accès au dashboard Stripe.');
      }
    } catch (error) {
      console.error('Erreur accès dashboard:', error);
      alert('Erreur d\'accès au dashboard Stripe.');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Créer une preview de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        updateProfileImage(imageUrl);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 py-6 sm:py-12 relative overflow-hidden">
      {/* Motif de fond décoratif */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(99 102 241) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
          {/* Header - Design ultra-moderne avec carrousel d'images */}
          <div className="relative bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 px-4 sm:px-8 py-10 sm:py-20 overflow-hidden">
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
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-900/60 to-pink-900/70"></div>
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
            
            <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-10 z-10">
              {/* Photo de profil - Design ultra-moderne avec effets néon */}
              <div className="relative group">
                {/* Cercle lumineux animé derrière la photo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
                
                {user.profileImage || imagePreview ? (
                  <img 
                    src={imagePreview || user.profileImage} 
                    alt="Photo de profil" 
                    className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 sm:border-6 border-white shadow-2xl ring-4 ring-indigo-300/40 transition-all duration-500 group-hover:scale-105 group-hover:ring-8 group-hover:ring-indigo-400/50"
                  />
                ) : (
                  <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center border-4 sm:border-6 border-white shadow-2xl ring-4 ring-indigo-300/40 transition-all duration-500 group-hover:scale-105 group-hover:ring-8 group-hover:ring-indigo-400/50">
                    <UserCircle className="w-24 sm:w-36 h-24 sm:h-36 text-indigo-600" />
                  </div>
                )}
                
                {/* Bouton pour changer la photo - Design amélioré */}
                <label 
                  htmlFor="profile-image-upload" 
                  className="absolute bottom-1 right-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full p-3.5 sm:p-5 shadow-2xl cursor-pointer hover:shadow-indigo-500/50 transition-all group-hover:scale-110 border-4 border-white hover:rotate-12"
                >
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl sm:text-6xl font-black mb-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm leading-tight">
                    {user.name}
                  </h1>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full mx-auto sm:mx-0"></div>
                </div>
                
                <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md rounded-2xl px-5 sm:px-8 py-3 sm:py-4 border-2 border-white/50 shadow-xl hover:shadow-2xl hover:bg-white/80 transition-all group">
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                    <span className="text-2xl sm:text-3xl">
                      {user.type === 'organizer' ? '🎭' : '🎫'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-600 font-medium mb-0.5">Role</p>
                    <p className="text-sm sm:text-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {user.type === 'organizer' ? 'Organisateur d\'événements' : 'Participant'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Body - Grid responsive ultra-moderne */}
          <div className="p-5 sm:p-10 lg:p-12">
            <div className="mb-8 sm:mb-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-pink-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 bg-clip-text">
                  Informations du compte
                </h2>
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full"></div>
            </div>
            
            {/* Grid responsive 2 colonnes avec design ultra-moderne */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7">
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative flex items-center gap-5 p-5 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-indigo-200/50 hover:border-indigo-400 transition-all hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1">
                  <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wide mb-1.5">Nom complet</p>
                    <p className="text-lg sm:text-xl font-black text-gray-900 truncate">{user.name}</p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative flex items-center gap-5 p-5 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-blue-200/50 hover:border-blue-400 transition-all hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wide mb-1.5">Email</p>
                    <p className="text-lg sm:text-xl font-black text-gray-900 truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative flex items-center gap-5 p-5 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-purple-200/50 hover:border-purple-400 transition-all hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <UserCircle className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wide mb-1.5">Type de compte</p>
                    <p className="text-lg sm:text-xl font-black text-gray-900">
                      {user.type === 'organizer' ? 'Organisateur' : 'Participant'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative flex items-center gap-5 p-5 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-green-200/50 hover:border-green-400 transition-all hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
                  <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wide mb-1.5">Membre depuis</p>
                    <p className="text-lg sm:text-xl font-black text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {user.type === 'organizer' && (
              <>
                {/* Bannière de succès Stripe - Responsive */}
                {showStripeSuccess && (
                  <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl flex items-start gap-3 shadow-lg animate-fade-in">
                    <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-green-900 text-sm sm:text-base mb-1">Compte Stripe connecté avec succès !</p>
                      <p className="text-xs sm:text-sm text-green-700">Vous pouvez maintenant recevoir des paiements pour vos événements.</p>
                    </div>
                  </div>
                )}

                {/* Section Stripe Connect - Design moderne et responsive */}
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border-2 border-purple-200 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                    <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-lg">
                      <CreditCard className="w-7 h-7 sm:w-10 sm:h-10 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-900 mb-2 sm:mb-3">
                        💳 Paiements Stripe Connect
                      </h3>
                      <p className="text-purple-700 text-xs sm:text-sm lg:text-base leading-relaxed">
                        Connectez votre compte Stripe pour recevoir les paiements de vos événements directement et automatiquement.
                      </p>
                    </div>
                  </div>

                  {/* Statut de connexion - Card moderne */}
                  <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-white rounded-xl border-2 border-purple-200 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <span className="text-sm sm:text-base font-bold text-gray-800">Statut de connexion :</span>
                      {stripeStatus === 'active' && (
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-bold px-4 py-2 rounded-full text-sm">
                          <CheckCircle className="w-5 h-5" />
                          Actif
                        </span>
                      )}
                      {stripeStatus === 'pending' && (
                        <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 font-bold px-4 py-2 rounded-full text-sm">
                          <AlertCircle className="w-5 h-5" />
                          En attente
                        </span>
                      )}
                      {stripeStatus === 'restricted' && (
                        <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 font-bold px-4 py-2 rounded-full text-sm">
                          <XCircle className="w-5 h-5" />
                          Restreint
                        </span>
                      )}
                      {stripeStatus === 'not_connected' && (
                        <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded-full text-sm">
                          <XCircle className="w-5 h-5" />
                          Non connecté
                        </span>
                      )}
                    </div>

                    {stripeStatus === 'not_connected' && (
                      <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        Vous devez connecter un compte Stripe pour recevoir des paiements.
                      </p>
                    )}

                    {stripeStatus === 'pending' && (
                      <p className="text-xs sm:text-sm text-orange-700 bg-orange-50 p-3 rounded-lg">
                        Votre compte Stripe est en cours de vérification. Cela peut prendre quelques minutes.
                      </p>
                    )}

                    {stripeStatus === 'active' && (
                      <p className="text-xs sm:text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                        Votre compte est actif ! Vous recevez automatiquement vos paiements.
                      </p>
                    )}

                    {stripeStatus === 'restricted' && (
                      <p className="text-xs sm:text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                        Votre compte nécessite des informations supplémentaires. Veuillez le compléter.
                      </p>
                    )}
                  </div>

                  {/* Avantages - Grid responsive */}
                  {stripeStatus === 'not_connected' && (
                    <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-white rounded-xl border-2 border-purple-200 shadow-md">
                      <p className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
                        <span className="text-lg sm:text-xl">✨</span> Avantages :
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Recevez <strong>100%</strong> du prix de vos tickets</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Frais <strong>5%</strong> payés par les participants</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Transferts <strong>automatiques</strong> après vente</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Dashboard détaillé avec exports</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Boutons d'action - Responsive */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">{stripeStatus === 'not_connected' && (
                      <button
                        onClick={handleConnectStripe}
                        disabled={stripeLoading}
                        className="flex-1 flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                      >
                        {stripeLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Connexion...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            <span>Connecter Stripe</span>
                          </>
                        )}
                      </button>
                    )}

                    {(stripeStatus === 'pending' || stripeStatus === 'restricted') && (
                      <button
                        onClick={handleConnectStripe}
                        disabled={stripeLoading}
                        className="flex-1 flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-105"
                      >
                        {stripeLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Chargement...</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5" />
                            <span>Compléter mon compte</span>
                          </>
                        )}
                      </button>
                    )}

                    {stripeStatus === 'active' && (
                      <button
                        onClick={handleOpenStripeDashboard}
                        disabled={stripeLoading}
                        className="flex-1 flex items-center justify-center gap-2 sm:gap-3 bg-white text-purple-600 border-2 border-purple-600 px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-105"
                      >
                        {stripeLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Chargement...</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-5 h-5" />
                            <span>Voir mon dashboard</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Section Wallet - Design moderne et responsive */}
                <div className="mt-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl border-2 border-green-200 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                    <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-lg">
                      <Wallet className="w-7 h-7 sm:w-10 sm:h-10 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-900 mb-2 sm:mb-3">
                        💰 Mon Portefeuille
                      </h3>
                      <p className="text-green-700 text-xs sm:text-sm lg:text-base leading-relaxed">
                        Suivez vos revenus en temps réel et gérez vos retraits en toute simplicité.
                      </p>
                    </div>
                  </div>

                  {/* Stats wallet - Grid moderne responsive */}
                  <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-green-200 shadow-md">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">💵 Disponible</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-600">{(user.walletBalance || 0).toFixed(2)}€</p>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">⏳ En attente</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-orange-600">{(user.walletPending || 0).toFixed(2)}€</p>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">📊 Total</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-indigo-600">{(user.walletTotal || 0).toFixed(2)}€</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/wallet')}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 transform hover:scale-105"
                  >
                    <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Gérer mon portefeuille</span>
                  </button>
                </div>

                {/* Section création d'événement - Design moderne */}
                <div className="mt-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-2xl border-2 border-indigo-200 shadow-xl">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl">🎉</span>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-1">
                        Compte Organisateur
                      </h3>
                      <p className="text-indigo-700 text-xs sm:text-sm lg:text-base">
                        Vous pouvez créer et gérer vos propres événements !
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/create')}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 transform hover:scale-105"
                  >
                    <span className="text-lg sm:text-xl">➕</span>
                    <span>Créer un événement</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <SearchParamsProvider>
        <ProfileContent />
      </SearchParamsProvider>
    </Suspense>
  );
}
