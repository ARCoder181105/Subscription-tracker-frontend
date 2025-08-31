import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Calendar, DollarSign, Bell, Filter } from 'lucide-react';
import { useToast } from '../contexts/ToastContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import SubscriptionCard from '../components/SubscriptionCard.jsx';
import StatsCards from '../components/StatsCards.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import UserProfileCard from '../components/userProfileCard.jsx';

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { addToast } = useToast();
  const { authenticatedFetch } = useAuth();
    const API_BASE = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    console.log("Fetching subscriptions...");
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await authenticatedFetch(`/api/v1/user/home`);

      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.data || []);
      } else {
        addToast('Failed to fetch subscriptions', 'error');
      }
    } catch (error) {
      addToast('Network error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscription = async (id) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;

    try {
      const response = await authenticatedFetch(`/api/v1/user/subs/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSubscriptions(prev => prev.filter(sub => sub._id !== id));
        addToast('Subscription deleted successfully', 'success');
      } else {
        addToast('Failed to delete subscription', 'error');
      }
    } catch (error) {
      addToast('Network error occurred', 'error');
    }
  };

  const markAsPaid = async (id, paidDate = null) => {
    try {
      const response = await authenticatedFetch(`/api/v1/user/subs/${id}/done`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paidDate: paidDate || new Date().toISOString() })
      });

      if (response.ok) {
        fetchSubscriptions(); // Refresh the list
        addToast('Subscription marked as paid', 'success');
      } else {
        addToast('Failed to update subscription', 'error');
      }
    } catch (error) {
      addToast('Network error occurred', 'error');
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filter === 'all') return true;
    return sub.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <UserProfileCard/>


        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your subscriptions</p>
          </div>
          <Link
            to="/add-subscription"
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Subscription
          </Link>
        </div>

        {/* Stats Cards */}
        <StatsCards subscriptions={subscriptions} />

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 w-fit">
          {[
            { key: 'all', label: 'All' },
            { key: 'active', label: 'Active' },
            { key: 'paused', label: 'Paused' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${filter === key
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Subscriptions Grid */}
        {filteredSubscriptions.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No subscriptions yet' : `No ${filter} subscriptions`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? 'Start by adding your first subscription to track your expenses.'
                : `You don't have any ${filter} subscriptions at the moment.`
              }
            </p>
            {filter === 'all' && (
              <Link
                to="/add-subscription"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Subscription
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription._id}
                subscription={subscription}
                onDelete={deleteSubscription}
                onMarkAsPaid={markAsPaid}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;