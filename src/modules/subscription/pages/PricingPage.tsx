import React, { useState } from 'react';
import { Layout, Button, Spinner } from '@shared/components';
import { useModules, useModulePlans, useCreateSubscription } from '@shared/hooks/useSubscription';
import { PlanDuration } from '@shared/types/subscription';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: modules = [], isLoading: modulesLoading } = useModules();
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const { data: plans = [], isLoading: plansLoading } = useModulePlans(selectedModuleId);
  const createSubscription = useCreateSubscription();

  React.useEffect(() => {
    if (modules.length > 0 && !selectedModuleId) {
      setSelectedModuleId(modules[0].id);
    }
  }, [modules, selectedModuleId]);

  const handleSubscribe = async (planId: string) => {
    try {
      await createSubscription.mutateAsync({
        planIdRaw: planId,
        moduleIdRaw: selectedModuleId,
      });
      navigate('/subscriptions');
    } catch (err) {
      console.error('Failed to create subscription:', err);
    }
  };

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case PlanDuration.MONTHLY:
        return 'Monthly';
      case PlanDuration.QUARTERLY:
        return 'Quarterly';
      case PlanDuration.YEARLY:
        return 'Yearly';
      default:
        return duration;
    }
  };

  if (modulesLoading) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">Select the perfect plan for your needs</p>
        </div>

        {modules.length === 0 ? (
          <div className="text-center text-gray-600">No modules available</div>
        ) : (
          <>
            {/* Module Selector */}
            {modules.length > 1 && (
              <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-lg border border-gray-300 p-1">
                  {modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModuleId(module.id)}
                      className={`px-6 py-2 rounded-md font-medium transition-colors ${
                        selectedModuleId === module.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {module.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Module Description */}
            {selectedModuleId && (
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  {modules.find((m) => m.id === selectedModuleId)?.description}
                </p>
              </div>
            )}

            {/* Plans */}
            {plansLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center text-gray-600">No plans available for this module</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200 hover:border-blue-500 transition-colors"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {getDurationLabel(plan.duration)}
                    </h3>
                    <div className="mb-6">
                      {plan.discountPercent > 0 && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{plan.basePrice.toFixed(2)}
                        </div>
                      )}
                      <div className="text-4xl font-bold text-gray-900">
                        ₹{plan.effectivePrice.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        per {plan.duration.toLowerCase().replace('ly', '')}
                      </div>
                      {plan.discountPercent > 0 && (
                        <div className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          Save {plan.discountPercent}%
                        </div>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {plan.quotaLimit} quota limit
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Full access to {plan.moduleName}
                      </li>
                    </ul>
                    <Button
                      className="w-full"
                      onClick={() => handleSubscribe(plan.id)}
                      isLoading={createSubscription.isPending}
                    >
                      Subscribe Now
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default PricingPage;
