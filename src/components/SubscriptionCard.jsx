import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Calendar, CheckCircle, AlertTriangle, Pause, X } from 'lucide-react';

const SubscriptionCard = ({ subscription, onDelete, onMarkAsPaid }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      case 'expired':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getBillingCycleColor = (cycle) => {
    switch (cycle.toLowerCase()) {
      case 'weekly':
        return 'bg-blue-100 text-blue-800';
      case 'monthly':
        return 'bg-purple-100 text-purple-800';
      case 'quarterly':
        return 'bg-indigo-100 text-indigo-800';
      case 'yearly':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isUpcoming = (nextBillingDate) => {
    const today = new Date();
    const billingDate = new Date(nextBillingDate);
    const diffTime = billingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {subscription.platformName}
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
                {getStatusIcon(subscription.status)}
                {subscription.status}
              </span>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getBillingCycleColor(subscription.billingCycle)}`}>
                {subscription.billingCycle}
              </span>
            </div>
          </div>
        </div>

        {/* Price and Category */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(subscription.price.amount, subscription.price.currency)}
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {subscription.category}
            </span>
          </div>
        </div>

        {/* Billing Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Next billing:</span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className={`font-medium ${
                isUpcoming(subscription.nextBillingDate) ? 'text-orange-600' : 'text-gray-900'
              }`}>
                {formatDate(subscription.nextBillingDate)}
              </span>
            </div>
          </div>
          
          {isUpcoming(subscription.nextBillingDate) && (
            <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">Due within 7 days</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <Link
              to={`/edit-subscription/${subscription._id}`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-200"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Link>
            <button
              onClick={() => onDelete(subscription._id)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition duration-200"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
          
          {subscription.status === 'Active' && (
            <button
              onClick={() => onMarkAsPaid(subscription._id)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition duration-200"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark Paid
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;