'use client';

import { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';

export default function EmailConfigPage() {
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<'loading' | 'success' | 'error' | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testConfiguration = async () => {
    setTestResult('loading');
    
    // Simuler un test (en production, faire un vrai appel API)
    setTimeout(() => {
      // Vérifier si l'env var existe côté client (note: elle est côté serveur)
      setTestResult('success'); // ou 'error' si échec
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-full mb-6">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Configuration Email
          </h1>
          <p className="text-xl text-gray-600">
            Activez l'envoi automatique des billets par email
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Status</h2>
            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              Configuration requise
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-2">
                  Service Email : Resend
                </p>
                <p className="text-blue-700 text-sm">
                  Gratuit jusqu'à 100 emails/jour • Temps de configuration : 5 minutes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full font-bold text-xl">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Créer un compte Resend</h3>
            </div>
            
            <div className="pl-16 space-y-4">
              <p className="text-gray-600">
                Resend est un service d'envoi d'emails moderne et gratuit (jusqu'à 100 emails/jour).
              </p>
              
              <a
                href="https://resend.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Créer un compte Resend
                <ExternalLink className="w-5 h-5" />
              </a>

              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-600 mb-2">💡 Astuce :</p>
                <p className="text-sm text-gray-700">
                  Connectez-vous avec votre compte GitHub ou Google pour gagner du temps
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full font-bold text-xl">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Obtenir l'API Key</h3>
            </div>
            
            <div className="pl-16 space-y-4">
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Une fois connecté, cliquez sur <strong>"API Keys"</strong> dans le menu</li>
                <li>Cliquez sur <strong>"Create API Key"</strong></li>
                <li>Nom : <code className="bg-gray-100 px-2 py-1 rounded">Agora Development</code></li>
                <li>Permission : <strong>Full Access</strong></li>
                <li>Cliquez sur <strong>"Add"</strong></li>
                <li>Copiez la clé (commence par <code className="bg-gray-100 px-2 py-1 rounded">re_</code>)</li>
              </ol>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full font-bold text-xl">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Configurer .env.local</h3>
            </div>
            
            <div className="pl-16 space-y-4">
              <p className="text-gray-600">
                Ouvrez le fichier <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">.env.local</code> à la racine du projet et ajoutez :
              </p>

              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto font-mono text-sm">
{`RESEND_API_KEY=re_votre_vraie_cle_ici
RESEND_FROM_EMAIL=onboarding@resend.dev`}
                </pre>
                <button
                  onClick={() => copyToClipboard('RESEND_API_KEY=re_votre_vraie_cle_ici\nRESEND_FROM_EMAIL=onboarding@resend.dev')}
                  className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                  title="Copier"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                <p className="text-sm text-amber-900">
                  <strong>Important :</strong> Remplacez <code>re_votre_vraie_cle_ici</code> par votre clé API Resend
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full font-bold text-xl">
                4
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Redémarrer le serveur</h3>
            </div>
            
            <div className="pl-16 space-y-4">
              <p className="text-gray-600">
                Après avoir modifié <code>.env.local</code>, redémarrez le serveur de développement :
              </p>

              <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
                <div>Ctrl+C <span className="text-gray-500">(arrêter le serveur)</span></div>
                <div className="mt-2">npm run dev <span className="text-gray-500">(redémarrer)</span></div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full font-bold text-xl">
                5
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Tester !</h3>
            </div>
            
            <div className="pl-16 space-y-4">
              <p className="text-gray-600 mb-4">
                Vérifiez que tout fonctionne :
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-900">Créez un compte Participant</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-900">Réservez un événement</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-900">Vérifiez votre boîte email (et les spams !)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Documentation Links */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">📚 Documentation</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://resend.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Documentation Resend</span>
            </a>
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
              <Mail className="w-5 h-5" />
              <span>QUICK_START_EMAIL.md</span>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">🆘 Besoin d'aide ?</p>
          <p className="text-sm">
            Consultez <code className="bg-gray-100 px-2 py-1 rounded">CONFIGURATION_EMAIL.md</code> pour le dépannage
          </p>
        </div>

      </div>
    </div>
  );
}
