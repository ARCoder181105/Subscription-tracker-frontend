import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, DollarSign, Calendar, Tag, Bell } from 'lucide-react';
import { useToast } from '../contexts/ToastContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const EditSubscription = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    platformName: '',
    price: {
      amount: '',
      currency: 'INR'
    },
    billingCycle: 'Monthly',
    startDate: '',
    status: 'Active',
    category: 'Entertainment',
    reminderDaysBefore: 3
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { authenticatedFetch } = useAuth();
  const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
  const billingCycles = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];
  const statuses = ['Active', 'Paused', 'Cancelled'];
  const categories = [
    'Entertainment', 'Productivity', 'Finance', 'Health & Fitness', 
    'Education', 'News', 'Music', 'Cloud Storage', 'Software', 'Other'
  ];

  useEffect(() => {
    fetchSubscription();
  }, [id]);

  const fetchSubscription = async () => {
    try {
      const response = await authenticatedFetch(`/api/v1/user/subs/${id}`);

      if (response.ok) {
        const data = await response.json();
        const subscription = data.data.subscription;
        
        setFormData({
          platformName: subscription.platformName,
          price: {
            amount: subscription.price.amount.toString(),
            currency: subscription.price.currency
          },
          billingCycle: subscription.billingCycle,
          startDate: new Date(subscription.startDate).toISOString().split('T')[0],
          status: subscription.status,
          category: subscription.category,
          reminderDaysBefore: subscription.reminderDaysBefore
        });
      } else {
        addToast('Failed to fetch subscription', 'error');
        navigate('/dashboard');
      }
    } catch (error) {
      addToast('Network error occurred', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await authenticatedFetch(`${API_BASE}/api/v1/user/subs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: {
            amount: parseFloat(formData.price.amount),
            currency: formData.price.currency
          },
          reminderDaysBefore: parseInt(formData.reminderDaysBefore)
        })
      });

      const data = await response.json();

      if (response.ok) {
        addToast('Subscription updated successfully!', 'success');
        navigate('/dashboard');
      } else {
        addToast(data.message || 'Failed to update subscription', 'error');
      }
    } catch (error) {
      addToast('Network error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'amount') {
      setFormData({
        ...formData,
        price: { ...formData.price, amount: value }
      });
    } else if (field === 'currency') {
      setFormData({
        ...formData,
        price: { ...formData.price, currency: value }
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/dashboard"
            className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Subscription</h1>
            <p className="text-gray-600 mt-1">Update subscription details</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Platform Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Platform Name *
              </label>
              <input
                type="text"
                value={formData.platformName}
                onChange={(e) => handleInputChange('platformName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                placeholder="e.g., Netflix, Spotify, Adobe Creative Cloud"
                required
              />
            </div>

            {/* Price and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.price.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Billing Cycle and Start Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Cycle *
                </label>
                <select
                  value={formData.billingCycle}
                  onChange={(e) => handleInputChange('billingCycle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                >
                  {billingCycles.map(cycle => (
                    <option key={cycle} value={cycle}>{cycle}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                  required
                />
              </div>
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reminder Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bell className="w-4 h-4 inline mr-2" />
                Reminder (days before billing)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={formData.reminderDaysBefore}
                onChange={(e) => handleInputChange('reminderDaysBefore', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                placeholder="3"
              />
              <p className="mt-1 text-sm text-gray-500">
                Get notified this many days before the subscription renews
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                to="/dashboard"
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Update Subscription
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSubscription;