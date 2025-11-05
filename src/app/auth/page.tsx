'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, Users, Mail, Lock, UserCircle, Camera } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'organizer' | 'participant'>('participant');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null as string | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password, userType);
      } else {
        await signup(formData.name, formData.email, formData.password, userType, formData.profileImage);
      }
      router.push('/');
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        setFormData({
          ...formData,
          profileImage: imageUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Bon retour sur Agora !' : 'Rejoignez la communauté Agora'}
          </p>
        </div>

        {/* Type d'utilisateur */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Je suis un :
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setUserType('participant')}
              className={`p-4 border-2 rounded-lg transition-all ${
                userType === 'participant'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <User className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Participant</div>
              <div className="text-xs text-gray-500 mt-1">Réserver des événements</div>
            </button>
            <button
              type="button"
              onClick={() => setUserType('organizer')}
              className={`p-4 border-2 rounded-lg transition-all ${
                userType === 'organizer'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Organisateur</div>
              <div className="text-xs text-gray-500 mt-1">Créer des événements</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Photo de profil */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                      <UserCircle className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <label 
                    htmlFor="auth-profile-image" 
                    className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      id="auth-profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <UserCircle className="w-5 h-5 text-indigo-600" />
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="exemple@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg"
          >
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            {isLogin
              ? "Pas encore de compte ? S'inscrire"
              : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
}
