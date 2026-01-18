import React, { useState } from 'react';
import { Task, TaskStatus, TaskFilters as ITaskFilters } from '@shared/types/task';
import { Button, Spinner, Layout } from '@shared/components';
import { TaskItem, TaskForm, TaskFilters } from '../components';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '@shared/hooks/useTasks';

const TasksPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Build filters
  const filters: ITaskFilters = {};
  if (statusFilter !== 'ALL') {
    filters.status = statusFilter;
  }
  if (dateFrom) {
    filters.from = dateFrom;
  }
  if (dateTo) {
    filters.to = dateTo;
  }

  // React Query hooks
  const { data: tasks = [], isLoading, error } = useTasks(filters);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingTask) {
        await updateTask.mutateAsync({ id: editingTask.id, data });
      } else {
        await createTask.mutateAsync(data);
      }
      handleCloseForm();
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      await updateTask.mutateAsync({ id, data: { status } });
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleDateRangeChange = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
  };

  // Group tasks by status for better organization
  const groupedTasks = tasks.reduce(
    (acc, task) => {
      const status = task.status || TaskStatus.TODO;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    },
    {} as Record<TaskStatus, Task[]>
  );

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your daily tasks and goals
              </p>
            </div>
            <Button onClick={handleCreateTask}>+ New Task</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <TaskFilters
          status={statusFilter}
          onStatusChange={setStatusFilter}
          from={dateFrom}
          to={dateTo}
          onDateRangeChange={handleDateRangeChange}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Failed to load tasks. Please try again.
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && tasks.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-4">
              {statusFilter !== 'ALL' || dateFrom || dateTo
                ? 'No tasks match your filters. Try adjusting them.'
                : 'Get started by creating your first task!'}
            </p>
            <Button onClick={handleCreateTask}>Create Your First Task</Button>
          </div>
        )}

        {/* Task List */}
        {!isLoading && !error && tasks.length > 0 && (
          <div className="space-y-6">
            {statusFilter === 'ALL' ? (
              // Grouped by status
              <>
                {Object.entries(groupedTasks).map(([status, statusTasks]) => (
                  <div key={status}>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      {status.replace('_', ' ')} ({statusTasks.length})
                    </h2>
                    <div className="space-y-3">
                      {statusTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Flat list
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        task={editingTask}
        isLoading={createTask.isPending || updateTask.isPending}
      />
    </Layout>
  );
};

export default TasksPage;
