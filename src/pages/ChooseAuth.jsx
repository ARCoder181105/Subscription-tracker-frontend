import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Shield, Bell, BarChart3 } from 'lucide-react';
import Logo from '../components/Logo.jsx';

const ChooseAuth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex justify-center">
          <Logo size="large" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Take Control of Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}Subscriptions
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Never miss a payment or get surprised by renewal dates again. 
            Manage all your subscriptions in one beautiful, simple dashboard.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Reminders</h3>
            <p className="text-gray-600">Get notified before your subscriptions renew</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Expense Tracking</h3>
            <p className="text-gray-600">Monitor your monthly and yearly spending</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">Your data is encrypted and secure</p>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="max-w-md mx-auto space-y-4">
          <Link
            to="/register"
            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl text-center font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="block w-full bg-white text-gray-700 py-4 px-8 rounded-2xl text-center font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 transition duration-300"
          >
            Sign In to Your Account
          </Link>
        </div>

        {/* Footer
        <div className="text-center mt-16">
          <p className="text-gray-500">
            Join thousands of users managing their subscriptions smarter
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default ChooseAuth;