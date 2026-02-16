import React, { useState, useMemo } from 'react';
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
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">Track your long-term goals</p>
          <Button onClick={() => { setEditingGoal(undefined); setIsFormOpen(true); }}>
            + New Goal
          </Button>
        </div>
        <div className="space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>💡 Tip:</strong> Add details in the <strong>Description</strong> field like suitable time (morning/evening), 
              expected duration, frequency preferences, or any constraints. This helps AI generate better timetables from your goals!
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-800">
              <strong>📅 Tip:</strong> Click on dates in the calendar below each goal to mark when you performed that activity. 
              This helps track your consistency and build streaks!
            </p>
          </div>
        </div>
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
                      <button
                        onClick={async () => {
                          const newProgress = Math.max(0, goal.progressPercentage - 5);
                          try {
                            await updateGoal.mutateAsync({
                              id: goal.id,
                              data: { ...goal, progressPercentage: newProgress }
                            });
                          } catch (err) {
                            console.error('Failed to update progress:', err);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 font-bold transition-colors"
                        disabled={goal.progressPercentage === 0}
                      >
                        −
                      </button>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${goal.progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                        {goal.progressPercentage}%
                      </span>
                      <button
                        onClick={async () => {
                          const newProgress = Math.min(100, goal.progressPercentage + 5);
                          try {
                            await updateGoal.mutateAsync({
                              id: goal.id,
                              data: { ...goal, progressPercentage: newProgress }
                            });
                          } catch (err) {
                            console.error('Failed to update progress:', err);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-full text-white font-bold transition-colors"
                        disabled={goal.progressPercentage === 100}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <ActivityCalendar goal={goal} updateGoal={updateGoal} />
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

const ActivityCalendar: React.FC<{ goal: Goal; updateGoal: any }> = ({ goal, updateGoal }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const selectedDates = useMemo(() => {
    return new Set(goal.activityDates || []);
  }, [goal.activityDates]);

  const { firstDay, daysInMonth, monthName, year } = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    return { firstDay, daysInMonth, monthName, year };
  }, [currentMonth]);

  const toggleDate = async (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const newSet = new Set(selectedDates);
    if (newSet.has(dateStr)) {
      newSet.delete(dateStr);
    } else {
      newSet.add(dateStr);
    }
    
    try {
      await updateGoal.mutateAsync({
        id: goal.id,
        data: { ...goal, activityDates: Array.from(newSet) }
      });
    } catch (err) {
      console.error('Failed to update activity dates:', err);
    }
  };

  const isDateSelected = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return selectedDates.has(dateStr);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const { currentStreak, longestStreak } = useMemo(() => {
    if (!selectedDates.size) return { currentStreak: 0, longestStreak: 0 };
    
    const sortedDates = Array.from(selectedDates)
      .map(d => new Date(d + 'T00:00:00'))
      .sort((a, b) => a.getTime() - b.getTime());
    
    let currentStreak = 0;
    let longestStreak = 1;
    let tempStreak = 1;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastDate = new Date(sortedDates[sortedDates.length - 1]);
    lastDate.setHours(0, 0, 0, 0);
    
    if (lastDate.getTime() === today.getTime() || lastDate.getTime() === yesterday.getTime()) {
      currentStreak = 1;
      for (let i = sortedDates.length - 2; i >= 0; i--) {
        const curr = new Date(sortedDates[i]);
        const next = new Date(sortedDates[i + 1]);
        curr.setHours(0, 0, 0, 0);
        next.setHours(0, 0, 0, 0);
        const diffDays = Math.round((next.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      prev.setHours(0, 0, 0, 0);
      curr.setHours(0, 0, 0, 0);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { currentStreak, longestStreak };
  }, [selectedDates]);

  return (
    <div className="mt-4 bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
        >
          ‹
        </button>
        <div className="text-center">
          <h4 className="text-sm font-semibold text-gray-800">
            {monthName} {year}
          </h4>
          <div className="flex gap-3 mt-1 text-xs">
            <span className="text-green-600 font-medium">🔥 {currentStreak}d streak</span>
            <span className="text-orange-600 font-medium">🏆 {longestStreak}d best</span>
          </div>
        </div>
        <button
          onClick={nextMonth}
          className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const selected = isDateSelected(day);
          const today = isToday(day);
          return (
            <button
              key={day}
              onClick={() => toggleDate(day)}
              className={`w-8 h-8 text-xs rounded-full transition-colors ${
                selected
                  ? 'bg-green-500 text-white font-semibold hover:bg-green-600'
                  : today
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsPage;
