export interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  available: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  registered: number;
  imageUrl: string;
  videoUrl?: string; // URL de la vidéo si uploadée
  organizer: string;
  organizerId: string;
  organizerImage?: string;
  price: number;
  ticketTypes?: TicketType[];
}

export interface Reservation {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  numberOfTickets: number;
  totalPrice: number;
  reservationDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  ticketCode: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentMethod?: 'stripe' | 'free';
  stripeSessionId?: string;
}

export interface Ticket {
  id: string;
  reservationId: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  ticketNumber: number;
  ticketType: string;
  ticketPrice: number;
  qrCode: string;
  status: 'valid' | 'used' | 'cancelled';
  purchaseDate: string;
  usedDate?: string;
}

export type UserType = 'organizer' | 'participant';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  createdAt: string;
  profileImage?: string;
  // Stripe Connect (pour les organisateurs)
  stripeAccountId?: string;
  stripeOnboardingComplete?: boolean;
  stripeAccountStatus?: 'pending' | 'active' | 'restricted';
  stripeDetailsSubmitted?: boolean;
  stripeChargesEnabled?: boolean;
  stripePayoutsEnabled?: boolean;
  needsStripeOnboarding?: boolean; // Flag pour redirection automatique vers onboarding
  // Wallet (pour les organisateurs)
  walletBalance?: number; // Solde disponible pour retrait
  walletPending?: number; // Revenus en attente de validation
  walletTotal?: number; // Total cumulé des revenus
}

export interface WalletTransaction {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  type: 'sale' | 'refund' | 'withdrawal' | 'service_fee';
  amount: number;
  serviceFee?: number;
  netAmount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  description: string;
  stripePaymentId?: string;
  participantName?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  stripeTransferId?: string;
  method: 'bank_transfer' | 'stripe_payout';
  notes?: string;
}