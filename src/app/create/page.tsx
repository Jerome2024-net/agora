'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Euro, Clock, Tag, FileText, Image as ImageIcon, CheckCircle, Ticket, Plus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TicketType, Event } from '@/types';
import { addEvent } from '@/lib/data';

export default function CreateEventPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [success, setSuccess] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    name: '',
    price: '',
    quantity: '',
    description: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Musique',
    capacity: '',
    price: '',
    mediaFile: null as File | null,
    organizer: user?.name || ''
  });

  // Mettre à jour le nom de l'organisateur quand l'utilisateur change
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        organizer: user.name
      }));
    }
  }, [user]);

  // Rediriger si non authentifié ou pas organisateur
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    } else if (user?.type !== 'organizer') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  // Ne rien afficher pendant la vérification
  if (!isAuthenticated || user?.type !== 'organizer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const categories = ['Musique', 'Gastronomie', 'Technologie', 'Sport', 'Art', 'Culture'];

  const handleAddTicketType = () => {
    if (newTicket.name && newTicket.price && newTicket.quantity) {
      const ticket: TicketType = {
        id: Date.now().toString(),
        name: newTicket.name,
        price: parseFloat(newTicket.price),
        quantity: parseInt(newTicket.quantity),
        available: parseInt(newTicket.quantity),
        description: newTicket.description
      };
      setTicketTypes([...ticketTypes, ticket]);
      setNewTicket({ name: '', price: '', quantity: '', description: '' });
      setShowTicketForm(false);
    }
  };

  const handleRemoveTicketType = (id: string) => {
    setTicketTypes(ticketTypes.filter(t => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Créer l'URL du média (utiliser le média uploadé ou une image par défaut)
    const mediaUrl = mediaPreview || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80';
    
    // Créer le nouvel événement avec la photo de profil de l'organisateur
    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      category: formData.category,
      capacity: parseInt(formData.capacity),
      registered: 0,
      imageUrl: mediaUrl,
      videoUrl: mediaType === 'video' ? mediaUrl : undefined,
      organizer: formData.organizer,
      organizerId: user.id,
      organizerImage: user.profileImage, // Photo de profil de l'organisateur
      price: formData.price ? parseFloat(formData.price) : 0,
      ticketTypes: ticketTypes.length > 0 ? ticketTypes : undefined
    };

    // Ajouter l'événement
    addEvent(newEvent);
    
    console.log('Nouvel événement créé:', newEvent);
    
    setSuccess(true);
    
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        alert('Veuillez sélectionner une image ou une vidéo valide');
        return;
      }
      
      setFormData({
        ...formData,
        mediaFile: file
      });
      
      setMediaType(isImage ? 'image' : 'video');
      
      // Créer une preview du média
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-xl p-12 text-center max-w-md">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Événement créé avec succès !
          </h2>
          <p className="text-gray-600 mb-6">
            Votre événement est maintenant visible par tous les utilisateurs.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Créer un événement
          </h1>
          <p className="text-xl text-gray-600">
            Partagez votre passion et rassemblez votre communauté
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Titre de l'événement *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="Ex: Concert Jazz au Clair de Lune"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Décrivez votre événement en détail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Date et Heure */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Heure *
                </label>
                <input
                  type="time"
                  name="time"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Lieu */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Lieu *
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="Ex: Théâtre Municipal, Paris"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Tag className="w-5 h-5 text-indigo-600" />
                Catégorie *
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Capacité et Prix */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Capacité totale *
                </label>
                <input
                  type="number"
                  name="capacity"
                  required
                  min="1"
                  placeholder="Ex: 100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.capacity}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Euro className="w-5 h-5 text-indigo-600" />
                  Prix de base (€)
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  placeholder="0 pour gratuit"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.price}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">Laissez vide si vous créez des types de billets</p>
              </div>
            </div>

            {/* Types de billets */}
            <div className="border-2 border-indigo-200 rounded-lg p-6 bg-indigo-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-indigo-600" />
                    Types de billets personnalisés
                  </h3>
                  <p className="text-sm text-gray-600">Créez différentes catégories de billets avec des tarifs spécifiques</p>
                </div>
                {!showTicketForm && (
                  <button
                    type="button"
                    onClick={() => setShowTicketForm(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                )}
              </div>

              {/* Liste des types de billets créés */}
              {ticketTypes.length > 0 && (
                <div className="space-y-3 mb-4">
                  {ticketTypes.map(ticket => (
                    <div key={ticket.id} className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <Ticket className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{ticket.name}</h4>
                            <p className="text-sm text-gray-600">{ticket.description || 'Aucune description'}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm font-medium text-indigo-600">{ticket.price}€</span>
                              <span className="text-sm text-gray-500">{ticket.quantity} places disponibles</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTicketType(ticket.id)}
                        className="ml-4 text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulaire d'ajout de type de billet */}
              {showTicketForm && (
                <div className="bg-white rounded-lg p-4 space-y-4 shadow-sm">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                      Nom du billet *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: VIP, Standard, Étudiant..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newTicket.name}
                      onChange={(e) => setNewTicket({...newTicket, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">
                        Prix (€) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Ex: 25.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={newTicket.price}
                        onChange={(e) => setNewTicket({...newTicket, price: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">
                        Quantité *
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Ex: 50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={newTicket.quantity}
                        onChange={(e) => setNewTicket({...newTicket, quantity: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                      Description (optionnel)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Accès backstage inclus"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddTicketType}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                    >
                      Ajouter ce billet
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTicketForm(false);
                        setNewTicket({ name: '', price: '', quantity: '', description: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {ticketTypes.length === 0 && !showTicketForm && (
                <p className="text-center text-gray-500 py-4">
                  Aucun type de billet créé. Cliquez sur "Ajouter" pour commencer.
                </p>
              )}
            </div>

            {/* Upload de l'image ou vidéo */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                Image ou Vidéo de l'événement *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                {mediaPreview ? (
                  <div className="space-y-4">
                    {mediaType === 'image' ? (
                      <img 
                        src={mediaPreview} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-lg object-cover shadow-lg"
                      />
                    ) : (
                      <video 
                        src={mediaPreview}
                        controls
                        className="max-h-64 mx-auto rounded-lg shadow-lg"
                      >
                        Votre navigateur ne supporte pas la lecture de vidéos.
                      </video>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                        {mediaType === 'image' ? '📷 Image' : '🎬 Vidéo'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaPreview(null);
                        setMediaType(null);
                        setFormData({ ...formData, mediaFile: null });
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Changer le média
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <ImageIcon className="w-8 h-8 text-indigo-600" />
                      </div>
                      <span className="text-2xl text-gray-400">ou</span>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <label htmlFor="media-upload" className="cursor-pointer">
                      <span className="text-indigo-600 hover:text-indigo-700 font-semibold">
                        Cliquez pour uploader une image ou vidéo
                      </span>
                      <span className="text-gray-600"> ou glissez-déposez</span>
                    </label>
                    <input
                      id="media-upload"
                      type="file"
                      accept="image/*,video/*"
                      required
                      onChange={handleMediaChange}
                      className="hidden"
                    />
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-semibold text-gray-700">
                        📷 Images: PNG, JPG, GIF, WebP (max 10MB)
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        🎬 Vidéos: MP4, WebM, MOV (max 50MB)
                      </p>
                    </div>
                    <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                      <p className="text-xs text-indigo-700">
                        💡 Conseil : Une vidéo capte mieux l'attention et augmente l'engagement !
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Organisateur */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Nom de l'organisateur *
              </label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-300 rounded-lg">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-300"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center border-2 border-indigo-300">
                    <span className="text-xl font-bold text-white">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="text"
                    name="organizer"
                    required
                    placeholder="Ex: Association Culturelle"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.organizer}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {user?.profileImage ? '✓ Votre photo de profil sera visible par les participants' : '⚠️ Ajoutez une photo de profil pour la montrer aux participants'}
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Créer l'événement
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}