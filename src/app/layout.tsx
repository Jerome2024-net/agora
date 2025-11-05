import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Home, Calendar, PlusCircle } from 'lucide-react';
import { AuthProvider } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Agora - Plateforme d\'événements',
  description: 'Créez et réservez des événements facilement',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <NavBar />
          <main>{children}</main>
          <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Agora</h3>
                <p className="text-gray-400">
                  La plateforme de référence pour créer et découvrir des événements.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Navigation</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/" className="hover:text-white">Accueil</Link></li>
                  <li><Link href="/create" className="hover:text-white">Créer un événement</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <p className="text-gray-400">
                  contact@agora-platform.com
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Agora. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  );
}