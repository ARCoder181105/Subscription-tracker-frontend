import React from 'react';
import { DollarSign, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

const StatsCards = ({ subscriptions }) => {
  const calculateStats = () => {
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'Active');
    
    // Calculate monthly total
    const monthlyTotal = activeSubscriptions.reduce((total, sub) => {
      let monthlyAmount = sub.price.amount;
      
      switch (sub.billingCycle) {
        case 'Weekly':
          monthlyAmount = sub.price.amount * 4.33; // Average weeks per month
          break;
        case 'Quarterly':
          monthlyAmount = sub.price.amount / 3;
          break;
        case 'Yearly':
          monthlyAmount = sub.price.amount / 12;
          break;
        default: // Monthly
          monthlyAmount = sub.price.amount;
      }
      
      return total + monthlyAmount;
    }, 0);

    // Calculate yearly total
    const yearlyTotal = monthlyTotal * 12;

    // Count upcoming renewals (within next 7 days)
    const today = new Date();
    const upcomingRenewals = activeSubscriptions.filter(sub => {
      const billingDate = new Date(sub.nextBillingDate);
      const diffTime = billingDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    }).length;

    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      monthlyTotal: monthlyTotal,
      yearlyTotal: yearlyTotal,
      upcomingRenewals
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR' // Default currency from your backend
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Subscriptions',
      value: stats.totalSubscriptions,
      subtitle: `${stats.activeSubscriptions} active`,
      icon: Calendar,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'Monthly Spending',
      value: formatCurrency(stats.monthlyTotal),
      subtitle: 'Estimated monthly cost',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'Yearly Spending',
      value: formatCurrency(stats.yearlyTotal),
      subtitle: 'Total annual cost',
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'Upcoming Renewals',
      value: stats.upcomingRenewals,
      subtitle: 'Due within 7 days',
      icon: AlertTriangle,
      color: stats.upcomingRenewals > 0 ? 'orange' : 'gray',
      bgColor: stats.upcomingRenewals > 0 ? 'bg-orange-50' : 'bg-gray-50',
      iconColor: stats.upcomingRenewals > 0 ? 'text-orange-600' : 'text-gray-600',
      textColor: stats.upcomingRenewals > 0 ? 'text-orange-600' : 'text-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {card.value}
            </p>
            <p className={`text-sm ${card.textColor}`}>
              {card.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;