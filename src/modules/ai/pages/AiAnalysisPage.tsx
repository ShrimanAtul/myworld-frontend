import React, { useState } from 'react';
import { Layout, Button, Spinner } from '@shared/components';
import { useAiAnalyze, useCachedResponses, useDeleteCache, useClearCache } from '@shared/hooks/useAi';
import { AiAnalysisType } from '@shared/types/ai';

const AiAnalysisPage: React.FC = () => {
  const [analysisType, setAnalysisType] = useState<AiAnalysisType>(AiAnalysisType.RECOMMENDATION);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);

  const analyze = useAiAnalyze();
  const { data: cachedResponses = [], isLoading: cacheLoading } = useCachedResponses(analysisType);
  const deleteCache = useDeleteCache();
  const clearCache = useClearCache();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await analyze.mutateAsync({ type: analysisType, input });
      setResult(response);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const handleDeleteCache = async (id: string) => {
    if (window.confirm('Delete this cached response?')) {
      try {
        await deleteCache.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete cache:', err);
      }
    }
  };

  const handleClearCache = async () => {
    if (window.confirm(`Clear all ${analysisType} cached responses?`)) {
      try {
        await clearCache.mutateAsync(analysisType);
      } catch (err) {
        console.error('Failed to clear cache:', err);
      }
    }
  };

  const getTypeLabel = (type: AiAnalysisType) => {
    switch (type) {
      case AiAnalysisType.DISCIPLINE:
        return 'Discipline Analysis';
      case AiAnalysisType.PROGRESS:
        return 'Progress Tracking';
      case AiAnalysisType.RECOMMENDATION:
        return 'Recommendations';
      case AiAnalysisType.SUMMARY:
        return 'Summary';
      default:
        return type;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Analysis</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Analysis Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">New Analysis</h2>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Analysis Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value as AiAnalysisType)}
                >
                  {Object.values(AiAnalysisType).map((type) => (
                    <option key={type} value={type}>
                      {getTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Input
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  required
                  rows={6}
                  placeholder="Enter task data or context for analysis..."
                />
              </div>
              <Button type="submit" className="w-full" isLoading={analyze.isPending}>
                Analyze
              </Button>
            </form>

            {/* Result */}
            {result && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">Result</h3>
                  {result.fromCache && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      From Cache
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{result.content}</p>
                <div className="mt-3 flex gap-4 text-xs text-gray-600">
                  <span>Input tokens: {result.inputTokens}</span>
                  <span>Output tokens: {result.outputTokens}</span>
                </div>
              </div>
            )}
          </div>

          {/* Cached Responses */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Cached Responses ({cachedResponses.length})
              </h2>
              {cachedResponses.length > 0 && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleClearCache}
                  isLoading={clearCache.isPending}
                >
                  Clear All
                </Button>
              )}
            </div>

            {cacheLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : cachedResponses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No cached responses for {getTypeLabel(analysisType)}
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {cachedResponses.map((cache) => (
                  <div key={cache.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs text-gray-500">
                        {new Date(cache.generatedAt).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        {cache.isRegenerated && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                            Regenerated
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteCache(cache.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-3">
                      {cache.responseContent}
                    </p>
                    <div className="mt-2 flex gap-3 text-xs text-gray-600">
                      <span>Tokens: {cache.inputTokens + cache.outputTokens}</span>
                      <span>Cost: ${cache.estimatedCost.toFixed(4)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AiAnalysisPage;
