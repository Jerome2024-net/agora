import { Event, Reservation, Ticket, TicketType, User, WalletTransaction, WithdrawalRequest } from '@/types';

// 🚀 Plateforme prête pour le lancement !
// Les événements seront créés par les organisateurs via le formulaire de création
export const events: Event[] = [];

// Stockage en mémoire des réservations et tickets
export let reservations: Reservation[] = [];
export let tickets: Ticket[] = [];

// Gestion des utilisateurs
let users: User[] = [];

// Fonction pour ajouter un événement créé par un organisateur
export function addEvent(event: Event): Event {
  events.push(event);
  return event;
}

// Fonction pour générer un code de ticket unique
function generateTicketCode(): string {
  return 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Fonction pour générer un QR code (simulé)
function generateQRCode(ticketId: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
}

export function getEvents(): Event[] {
  return events;
}

export function getEventById(id: string): Event | undefined {
  return events.find(event => event.id === id);
}

export function getEventsByCategory(category: string): Event[] {
  return events.filter(event => event.category === category);
}

export function addReservation(reservation: Reservation): Ticket[] {
  reservations.push(reservation);
  
  // Mettre à jour le nombre d'inscrits
  const eventToUpdate = events.find(e => e.id === reservation.eventId);
  if (eventToUpdate) {
    eventToUpdate.registered += reservation.numberOfTickets;
  }

  // Créer des tickets individuels pour chaque billet
  const newTickets: Ticket[] = [];
  
  for (let i = 0; i < reservation.numberOfTickets; i++) {
    const ticketId = `${reservation.id}-${i + 1}`;
    const ticket: Ticket = {
      id: ticketId,
      reservationId: reservation.id,
      eventId: reservation.eventId,
      userId: reservation.userId,
      userName: reservation.userName,
      userEmail: reservation.userEmail,
      ticketNumber: i + 1,
      ticketType: 'Standard', // Sera mis à jour dans la page de réservation
      ticketPrice: eventToUpdate?.price || 0,
      qrCode: generateQRCode(ticketId),
      status: 'valid',
      purchaseDate: reservation.reservationDate
    };
    tickets.push(ticket);
    newTickets.push(ticket);
  }

  return newTickets;
}

export function getReservations(): Reservation[] {
  return reservations;
}

export function getReservationsByUserId(userId: string): Reservation[] {
  return reservations.filter(r => r.userId === userId);
}

export function getReservationsByEventId(eventId: string): Reservation[] {
  return reservations.filter(r => r.eventId === eventId);
}

export function getTicketsByUserId(userId: string): Ticket[] {
  return tickets.filter(t => t.userId === userId);
}

export function getTicketsByEventId(eventId: string): Ticket[] {
  if (eventId === 'all') {
    return tickets; // Retourner tous les tickets pour la recherche globale
  }
  return tickets.filter(t => t.eventId === eventId);
}

export function validateTicket(ticketId: string): boolean {
  const ticket = tickets.find(t => t.id === ticketId);
  if (ticket && ticket.status === 'valid') {
    ticket.status = 'used';
    ticket.usedDate = new Date().toISOString();
    return true;
  }
  return false;
}

export function cancelReservation(reservationId: string): boolean {
  const reservation = reservations.find(r => r.id === reservationId);
  if (reservation) {
    reservation.status = 'cancelled';
    
    // Annuler tous les tickets associés
    tickets.filter(t => t.reservationId === reservationId).forEach(t => {
      t.status = 'cancelled';
    });
    
    // Mettre à jour le nombre d'inscrits
    const event = events.find(e => e.id === reservation.eventId);
    if (event) {
      event.registered -= reservation.numberOfTickets;
    }
    
    return true;
  }
  return false;
}

// Gestion des utilisateurs
export function addUser(user: User): User {
  users.push(user);
  return user;
}

export function getUserById(userId: string): User | undefined {
  return users.find(u => u.id === userId);
}

export function updateUserStripeAccount(
  userId: string, 
  stripeData: {
    stripeAccountId: string;
    stripeOnboardingComplete: boolean;
    stripeAccountStatus: 'pending' | 'active' | 'restricted';
    stripeDetailsSubmitted?: boolean;
    stripeChargesEnabled?: boolean;
    stripePayoutsEnabled?: boolean;
  }
): boolean {
  const user = users.find(u => u.id === userId);
  if (user) {
    Object.assign(user, stripeData);
    return true;
  }
  return false;
}

export function getAllUsers(): User[] {
  return users;
}

// Gestion du Wallet
export const walletTransactions: WalletTransaction[] = [];
export const withdrawalRequests: WithdrawalRequest[] = [];

export function addWalletTransaction(transaction: WalletTransaction): WalletTransaction {
  walletTransactions.push(transaction);
  
  // Mettre à jour le solde de l'utilisateur
  const user = users.find(u => u.id === transaction.userId);
  if (user) {
    if (transaction.status === 'completed') {
      if (transaction.type === 'sale') {
        user.walletBalance = (user.walletBalance || 0) + transaction.netAmount;
        user.walletTotal = (user.walletTotal || 0) + transaction.netAmount;
      } else if (transaction.type === 'withdrawal') {
        user.walletBalance = (user.walletBalance || 0) - transaction.amount;
      } else if (transaction.type === 'refund') {
        user.walletBalance = (user.walletBalance || 0) - transaction.amount;
      }
    } else if (transaction.status === 'pending' && transaction.type === 'sale') {
      user.walletPending = (user.walletPending || 0) + transaction.netAmount;
    }
  }
  
  return transaction;
}

export function getWalletTransactions(userId: string): WalletTransaction[] {
  return walletTransactions.filter(t => t.userId === userId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getWalletBalance(userId: string): { balance: number; pending: number; total: number } {
  const user = users.find(u => u.id === userId);
  return {
    balance: user?.walletBalance || 0,
    pending: user?.walletPending || 0,
    total: user?.walletTotal || 0,
  };
}

export function createWithdrawalRequest(request: WithdrawalRequest): WithdrawalRequest {
  withdrawalRequests.push(request);
  return request;
}

export function getWithdrawalRequests(userId: string): WithdrawalRequest[] {
  return withdrawalRequests.filter(w => w.userId === userId).sort((a, b) => 
    new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
  );
}

export function updateWithdrawalStatus(
  requestId: string, 
  status: 'processing' | 'completed' | 'rejected',
  stripeTransferId?: string
): boolean {
  const request = withdrawalRequests.find(w => w.id === requestId);
  if (request) {
    request.status = status;
    request.processedAt = new Date().toISOString();
    if (stripeTransferId) {
      request.stripeTransferId = stripeTransferId;
    }
    
    // Si complété, créer une transaction de retrait
    if (status === 'completed') {
      addWalletTransaction({
        id: `wt-${Date.now()}`,
        userId: request.userId,
        eventId: '',
        eventTitle: 'Retrait',
        type: 'withdrawal',
        amount: request.amount,
        netAmount: -request.amount,
        status: 'completed',
        date: new Date().toISOString(),
        description: `Retrait de ${request.amount}€ vers votre compte bancaire`,
        stripePaymentId: stripeTransferId,
      });
    }
    
    return true;
  }
  return false;
}