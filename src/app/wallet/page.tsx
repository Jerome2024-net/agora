'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  DollarSign,
  CreditCard,
  Receipt,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Euro
} from 'lucide-react';
import { WalletTransaction, WithdrawalRequest } from '@/types';
import { getWalletTransactions, getWalletBalance, createWithdrawalRequest, getWithdrawalRequests } from '@/lib/data';

export default function WalletPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [balance, setBalance] = useState({ balance: 0, pending: 0, total: 0 });
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'withdrawal' | 'refund'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'organizer') {
      router.push('/');
      return;
    }

    // Charger les données du wallet
    loadWalletData();
  }, [isAuthenticated, user, router]);

  const loadWalletData = () => {
    if (!user) return;
    
    const walletBalance = getWalletBalance(user.id);
    setBalance(walletBalance);
    
    const walletTransactions = getWalletTransactions(user.id);
    setTransactions(walletTransactions);
    
    const walletWithdrawals = getWithdrawalRequests(user.id);
    setWithdrawals(walletWithdrawals);
  };

  const handleWithdraw = async () => {
    if (!user || !withdrawAmount) return;
    
    const amount = parseFloat(withdrawAmount);
    
    if (amount <= 0) {
      alert('Le montant doit être supérieur à 0€');
      return;
    }
    
    if (amount > balance.balance) {
      alert('Solde insuffisant');
      return;
    }

    // Vérifier que l'utilisateur a un compte Stripe Connect
    if (!user.stripeAccountId) {
      alert('Vous devez connecter un compte Stripe avant de pouvoir retirer des fonds. Allez dans votre profil pour configurer Stripe Connect.');
      router.push('/profile');
      return;
    }
    
    try {
      // Appeler l'API de retrait
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: amount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setWithdrawAmount('');
        setShowWithdrawModal(false);
        loadWalletData();
        
        const arrivalDate = new Date(data.withdrawal.arrivalDate).toLocaleDateString('fr-FR');
        alert(`✅ Retrait de ${amount.toFixed(2)}€ effectué avec succès !\n\nLes fonds arriveront sur votre compte bancaire le ${arrivalDate}.`);
      } else {
        alert(`❌ Erreur: ${data.error || 'Une erreur est survenue'}\n${data.details || ''}`);
      }
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      alert('❌ Erreur lors du retrait. Veuillez réessayer.');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (searchQuery && !t.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale': return <ArrowDownRight className="w-5 h-5 text-green-600" />;
      case 'withdrawal': return <ArrowUpRight className="w-5 h-5 text-blue-600" />;
      case 'refund': return <ArrowUpRight className="w-5 h-5 text-red-600" />;
      default: return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="flex items-center gap-1 text-green-600 text-sm font-medium"><CheckCircle className="w-4 h-4" /> Complété</span>;
      case 'pending':
        return <span className="flex items-center gap-1 text-orange-600 text-sm font-medium"><Clock className="w-4 h-4" /> En attente</span>;
      case 'processing':
        return <span className="flex items-center gap-1 text-blue-600 text-sm font-medium"><Clock className="w-4 h-4" /> En cours</span>;
      case 'failed':
      case 'rejected':
        return <span className="flex items-center gap-1 text-red-600 text-sm font-medium"><XCircle className="w-4 h-4" /> Échoué</span>;
      default:
        return <span className="text-gray-600 text-sm">{status}</span>;
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Wallet className="w-10 h-10 text-indigo-600" />
            Mon Portefeuille
          </h1>
          <p className="text-gray-600">Gérez vos revenus et retraits en toute simplicité</p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Solde disponible */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Wallet className="w-6 h-6" />
              </div>
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={balance.balance <= 0}
                className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Retirer
              </button>
            </div>
            <p className="text-green-100 text-sm mb-1">Solde disponible</p>
            <p className="text-4xl font-bold flex items-center">
              {balance.balance.toFixed(2)}
              <Euro className="w-8 h-8 ml-1" />
            </p>
          </div>

          {/* Revenus en attente */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <p className="text-orange-100 text-sm mb-1">En attente</p>
            <p className="text-4xl font-bold flex items-center">
              {balance.pending.toFixed(2)}
              <Euro className="w-8 h-8 ml-1" />
            </p>
            <p className="text-orange-100 text-xs mt-2">Disponible sous 2-3 jours</p>
          </div>

          {/* Total des revenus */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <p className="text-indigo-100 text-sm mb-1">Total des revenus</p>
            <p className="text-4xl font-bold flex items-center">
              {balance.total.toFixed(2)}
              <Euro className="w-8 h-8 ml-1" />
            </p>
          </div>
        </div>

        {/* Alerte Stripe Connect */}
        {!user.stripeAccountId && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-yellow-900 mb-2">Connectez Stripe pour recevoir vos paiements</h3>
              <p className="text-yellow-700 mb-4">
                Vous devez connecter un compte Stripe Connect pour recevoir automatiquement vos revenus.
              </p>
              <button
                onClick={() => router.push('/profile')}
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
              >
                Configurer maintenant
              </button>
            </div>
          </div>
        )}

        {/* Demandes de retrait récentes */}
        {withdrawals.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Download className="w-6 h-6 text-indigo-600" />
              Demandes de retrait récentes
            </h2>
            <div className="space-y-3">
              {withdrawals.slice(0, 3).map((withdrawal) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <ArrowUpRight className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{withdrawal.amount.toFixed(2)}€</p>
                      <p className="text-sm text-gray-500">
                        {new Date(withdrawal.requestedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(withdrawal.status)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="w-6 h-6 text-indigo-600" />
                Historique des transactions
              </h2>
              
              <div className="flex gap-3">
                {/* Filtre par type */}
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="appearance-none bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Tous</option>
                    <option value="sale">Ventes</option>
                    <option value="withdrawal">Retraits</option>
                    <option value="refund">Remboursements</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                {/* Recherche */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Liste des transactions */}
          <div className="divide-y divide-gray-200">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium mb-2">Aucune transaction</p>
                <p className="text-gray-400">Vos transactions apparaîtront ici</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${
                        transaction.type === 'sale' ? 'bg-green-100' :
                        transaction.type === 'withdrawal' ? 'bg-blue-100' :
                        'bg-red-100'
                      }`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-gray-900">{transaction.eventTitle}</p>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                        {transaction.participantName && (
                          <p className="text-xs text-gray-400 mt-1">Acheteur: {transaction.participantName}</p>
                        )}
                        {transaction.serviceFee && (
                          <p className="text-xs text-gray-400 mt-1">
                            Frais de service: {transaction.serviceFee.toFixed(2)}€
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        transaction.type === 'sale' ? 'text-green-600' :
                        transaction.type === 'withdrawal' ? 'text-blue-600' :
                        'text-red-600'
                      }`}>
                        {transaction.type === 'sale' ? '+' : '-'}{transaction.netAmount.toFixed(2)}€
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(transaction.date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de retrait */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Download className="w-6 h-6 text-indigo-600" />
              Demande de retrait
            </h3>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Solde disponible: <span className="font-bold text-green-600">{balance.balance.toFixed(2)}€</span>
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant à retirer (€)
              </label>
              <input
                type="number"
                min="0"
                max={balance.balance}
                step="0.01"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                placeholder="0.00"
              />
              
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Les retraits sont traités sous 1-2 jours ouvrés via Stripe Connect vers votre compte bancaire.
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
