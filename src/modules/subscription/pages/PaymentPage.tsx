import React, { useState, useEffect } from 'react';
import { Layout, Button, Spinner } from '@shared/components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@shared/hooks/useAuth';
import { paymentApi, RazorpayOptions, RazorpayResponse } from '@shared/api/paymentApi';
import { useModulePlans } from '@shared/hooks/useSubscription';

// Razorpay key - in production, this should come from environment variable
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SMIf3JVfjpNoZ6';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planId = searchParams.get('planId');
  const moduleId = searchParams.get('moduleId');
  const subscriptionId = searchParams.get('subscriptionId');

  const { data: plans = [] } = useModulePlans(moduleId || '');
  const selectedPlan = plans.find(p => p.id === planId);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!user || !selectedPlan) {
      setError('User or plan information is missing');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Create order in backend
      const orderResponse = await paymentApi.createOrder({
        userId: user.id,
        subscriptionId: subscriptionId || undefined,
        amount: selectedPlan.effectivePrice,
        currency: 'INR',
      });

      // Step 2: Open Razorpay checkout
      const options: RazorpayOptions = {
        key: RAZORPAY_KEY_ID,
        amount: orderResponse.amount * 100, // Razorpay expects amount in paise
        currency: orderResponse.currency,
        name: 'MyWorld',
        description: `${selectedPlan.moduleName} - ${selectedPlan.duration}`,
        order_id: orderResponse.providerOrderId,
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#2563eb', // blue-600
        },
        handler: async (response: RazorpayResponse) => {
          // Payment successful
          console.log('Payment successful:', response);
          
          // Navigate to subscriptions page
          navigate('/subscriptions?payment=success');
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setError('Payment was cancelled. Please try again.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!planId || !moduleId) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Invalid payment request. Please select a plan from the pricing page.</p>
            <Button className="mt-4" onClick={() => navigate('/pricing')}>
              Go to Pricing
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!selectedPlan) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-600 mt-2">Review your order and proceed with payment</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Module:</span>
              <span className="font-medium text-gray-900">{selectedPlan.moduleName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium text-gray-900">{selectedPlan.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quota Limit:</span>
              <span className="font-medium text-gray-900">{selectedPlan.quotaLimit}</span>
            </div>
            
            {selectedPlan.discountPercent > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base Price:</span>
                  <span className="line-through text-gray-500">₹{selectedPlan.basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount ({selectedPlan.discountPercent}%):</span>
                  <span className="text-green-600">
                    -₹{(selectedPlan.basePrice - selectedPlan.effectivePrice).toFixed(2)}
                  </span>
                </div>
              </>
            )}
            
            <div className="border-t pt-3 flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600">₹{selectedPlan.effectivePrice.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={handlePayment}
              isLoading={isProcessing}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </Button>
            
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate('/pricing')}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              <svg className="inline-block w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Payment Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Payments are processed securely through Razorpay</li>
            <li>• Your subscription will be activated immediately after successful payment</li>
            <li>• You will receive a confirmation email</li>
            <li>• Refunds are available within 7 days of purchase</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
