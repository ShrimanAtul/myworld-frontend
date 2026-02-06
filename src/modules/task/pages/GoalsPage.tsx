import React, { useState } from 'react';
import { Button, Spinner } from '@shared/components';
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from '@shared/hooks/useGoals';
import { Goal, GoalStatus, GoalType } from '@shared/types/goal';

const GoalsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();

  const { data: goals = [], isLoading, error } = useGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as GoalType,
      status: formData.get('status') as GoalStatus,
      targetDate: formData.get('targetDate') as string,
      progressPercentage: parseInt(formData.get('progressPercentage') as string) || 0,
    };

    try {
      if (editingGoal) {
        await updateGoal.mutateAsync({ id: editingGoal.id, data });
      } else {
        await createGoal.mutateAsync(data);
      }
      setIsFormOpen(false);
      setEditingGoal(undefined);
    } catch (err) {
      console.error('Failed to save goal:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete goal:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Failed to load goals. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">Track your long-term goals</p>
        <Button onClick={() => { setEditingGoal(undefined); setIsFormOpen(true); }}>
          + New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-4">Start by creating your first goal!</p>
          <Button onClick={() => setIsFormOpen(true)}>Create Your First Goal</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-500">Type: {goal.type}</span>
                    <span className="text-gray-500">Status: {goal.status}</span>
                    {goal.targetDate && (
                      <span className="text-gray-500">Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${goal.progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {goal.progressPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => { setEditingGoal(goal); setIsFormOpen(true); }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingGoal ? 'Edit Goal' : 'New Goal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingGoal?.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingGoal?.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  required
                  defaultValue={editingGoal?.type || GoalType.OTHER}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Object.values(GoalType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  required
                  defaultValue={editingGoal?.status || GoalStatus.NOT_STARTED}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Object.values(GoalStatus).map((status) => (
                    <option key={status} value={status}>{status.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  name="targetDate"
                  defaultValue={editingGoal?.targetDate?.split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress ({editingGoal?.progressPercentage || 0}%)
                </label>
                <input
                  type="range"
                  name="progressPercentage"
                  min="0"
                  max="100"
                  defaultValue={editingGoal?.progressPercentage || 0}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1" isLoading={createGoal.isPending || updateGoal.isPending}>
                  {editingGoal ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => { setIsFormOpen(false); setEditingGoal(undefined); }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
