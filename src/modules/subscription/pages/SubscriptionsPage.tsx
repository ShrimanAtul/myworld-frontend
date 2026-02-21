import React, { useState, useEffect } from 'react';
import { Layout, Button, Spinner } from '@shared/components';
import { useUserSubscriptions, useCancelSubscription } from '@shared/hooks/useSubscription';
import { SubscriptionStatus } from '@shared/types/subscription';
import { Link, useSearchParams } from 'react-router-dom';

const SubscriptionsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const { data: subscriptions = [], isLoading } = useUserSubscriptions();
  const cancelSubscription = useCancelSubscription();

  useEffect(() => {
    // Check if redirected from successful payment
    if (searchParams.get('payment') === 'success') {
      setShowSuccessBanner(true);
      // Remove the query parameter
      setSearchParams({});
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessBanner(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [searchParams, setSearchParams]);

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      try {
        await cancelSubscription.mutateAsync(id);
      } catch (err) {
        console.error('Failed to cancel subscription:', err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case SubscriptionStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case SubscriptionStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case SubscriptionStatus.EXPIRED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSuccessBanner && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-green-900 font-medium">Payment Successful!</h3>
              <p className="text-green-800 text-sm mt-1">
                Your subscription has been activated. You now have full access to all features.
              </p>
            </div>
            <button
              onClick={() => setShowSuccessBanner(false)}
              className="text-green-600 hover:text-green-800 ml-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
            <p className="text-gray-600 mt-2">Manage your active subscriptions</p>
          </div>
          <Link to="/pricing">
            <Button>Browse Plans</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions yet</h3>
            <p className="text-gray-600 mb-4">Subscribe to a plan to get started!</p>
            <Link to="/pricing">
              <Button>View Pricing Plans</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {subscription.moduleName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Plan:</strong> {subscription.planName}
                      </p>
                      <p>
                        <strong>Start Date:</strong> {new Date(subscription.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>End Date:</strong> {new Date(subscription.endDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Quota Remaining:</strong> {subscription.quotaRemaining}
                      </p>
                      <p>
                        <strong>Auto Renew:</strong> {subscription.autoRenew ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                  {subscription.status === SubscriptionStatus.ACTIVE && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancel(subscription.id)}
                      isLoading={cancelSubscription.isPending}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubscriptionsPage;
