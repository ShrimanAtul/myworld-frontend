import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Spinner } from '@shared/components';
import { useAiAnalyze, useCachedResponses, useDeleteCache, useClearCache } from '@shared/hooks/useAi';
import { useCreateCollection, useCreateTimetable } from '@shared/hooks/useTimetables';
import { AiAnalysisType } from '@shared/types/ai';

const AiAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [analysisType, setAnalysisType] = useState<AiAnalysisType>(AiAnalysisType.RECOMMENDATION);
  const [result, setResult] = useState<any>(null);
  const [expandedCache, setExpandedCache] = useState<Set<string>>(new Set());

  const analyze = useAiAnalyze();
  const { data: cachedResponses = [], isLoading: cacheLoading } = useCachedResponses(analysisType);
  const deleteCache = useDeleteCache();
  const clearCache = useClearCache();
  const createCollection = useCreateCollection();
  const createTimetable = useCreateTimetable();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await analyze.mutateAsync({ type: analysisType, input: '' });
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
      case AiAnalysisType.GENERATE_TIMETABLE:
        return 'Generate Goal-Based Timetable';
      default:
        return type;
    }
  };

  const getTypeTip = (type: AiAnalysisType) => {
    switch (type) {
      case AiAnalysisType.GENERATE_TIMETABLE:
        return 'Add details in your Goals\' Description field (suitable time, duration, preferences) to help AI create a better timetable. Avoid conflicting time preferences across multiple goals.';
      default:
        return null;
    }
  };

  const handleAddToTimetables = async (content: string) => {
    try {
      // Parse JSON from AI response (may be wrapped in markdown code block)
      let jsonStr = content.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\s*/, '').replace(/```\s*$/, '').trim();
      }
      
      const entries = JSON.parse(jsonStr);
      
      if (!Array.isArray(entries) || entries.length === 0) {
        alert('No timetable entries found in the response');
        return;
      }

      // Create AI-generated collection
      const now = new Date();
      const istTime = now.toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const collection = await createCollection.mutateAsync({
        name: `AI Generated - ${istTime}`,
        description: 'Generated from goals by AI',
        isDefault: false,
        isAiGenerated: true,
      });

      // Create timetable entries
      for (const entry of entries) {
        await createTimetable.mutateAsync({
          collectionId: collection.id,
          title: entry.title,
          description: entry.description,
          type: entry.type,
          daysOfWeek: entry.daysOfWeek,
          startTime: entry.startTime,
          endTime: entry.endTime,
        });
      }

      alert(`Successfully added ${entries.length} timetable entries!`);
      navigate('/workspace?tab=timetable');
    } catch (err) {
      console.error('Failed to add timetables:', err);
      alert('Failed to parse or add timetables. Please check the format.');
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
                {getTypeTip(analysisType) && (
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>💡 Tip:</strong> {getTypeTip(analysisType)}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Input <span className="text-xs text-orange-600">(Deprecated - Auto-fetches from TODO/Goals/Timetable)</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  disabled
                  rows={6}
                  placeholder="This field will be removed soon. Analysis now automatically fetches data from your TODO list, Goals, and Timetable."
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
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex gap-4 text-xs text-gray-600">
                    <span>Input tokens: {result.inputTokens}</span>
                    <span>Output tokens: {result.outputTokens}</span>
                  </div>
                  {analysisType === AiAnalysisType.GENERATE_TIMETABLE && (
                    <Button
                      size="sm"
                      onClick={() => handleAddToTimetables(result.content)}
                      isLoading={createCollection.isPending || createTimetable.isPending}
                    >
                      Add to Timetables
                    </Button>
                  )}
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
                    {cache.responseContent ? (
                      <>
                        <p className={`text-sm text-gray-800 whitespace-pre-wrap ${!expandedCache.has(cache.id) ? 'line-clamp-3' : ''}`}>
                          {cache.responseContent}
                        </p>
                        <button
                          onClick={() => {
                            const newExpanded = new Set(expandedCache);
                            if (expandedCache.has(cache.id)) {
                              newExpanded.delete(cache.id);
                            } else {
                              newExpanded.add(cache.id);
                            }
                            setExpandedCache(newExpanded);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                        >
                          {expandedCache.has(cache.id) ? '▲ Collapse' : '▼ Expand'}
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No content available</p>
                    )}
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex gap-3 text-xs text-gray-600">
                        <span>Tokens: {cache.inputTokens + cache.outputTokens}</span>
                        <span>Cost: ${cache.estimatedCost.toFixed(4)}</span>
                      </div>
                      {cache.type === AiAnalysisType.GENERATE_TIMETABLE && (
                        <Button
                          size="sm"
                          onClick={() => handleAddToTimetables(cache.responseContent)}
                          isLoading={createCollection.isPending || createTimetable.isPending}
                        >
                          Add to Timetables
                        </Button>
                      )}
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
