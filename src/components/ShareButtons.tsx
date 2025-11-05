'use client';

import { useState } from 'react';
import { Share2, Facebook, Linkedin, Mail, MessageCircle, Link2, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}

export default function ShareButtons({ title, description, url, imageUrl }: ShareButtonsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + url : url;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    window.open(link, '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: shareUrl
        });
        setShowMenu(false);
      } catch (error) {
        console.error('Erreur lors du partage:', error);
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md"
      >
        <Share2 className="w-5 h-5" />
        Partager
      </button>

      {showMenu && !navigator.share && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Partager sur</h3>
            <button
              onClick={() => setShowMenu(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            {/* Facebook */}
            <button
              onClick={() => handleShare('facebook')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Facebook className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="font-semibold text-gray-700">Facebook</span>
            </button>

            {/* X (Twitter) */}
            <button
              onClick={() => handleShare('x')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <span className="font-semibold text-gray-700">X (Twitter)</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => handleShare('linkedin')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Linkedin className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="font-semibold text-gray-700">LinkedIn</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="font-semibold text-gray-700">WhatsApp</span>
            </button>

            {/* Email */}
            <button
              onClick={() => handleShare('email')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-700">Email</span>
            </button>

            {/* Copier le lien */}
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={handleCopyLink}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left group ${
                  copied ? 'bg-green-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${
                  copied ? 'bg-green-500' : 'bg-indigo-600'
                }`}>
                  {copied ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Link2 className="w-5 h-5 text-white" />
                  )}
                </div>
                <span className={`font-semibold ${copied ? 'text-green-700' : 'text-gray-700'}`}>
                  {copied ? 'Lien copié !' : 'Copier le lien'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
