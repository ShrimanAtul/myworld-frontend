import React from 'react';
import { useAuthStore } from '@shared/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button, Layout } from '@shared/components';
import { useTasks } from '@shared/hooks/useTasks';
import { TaskStatus } from '@shared/types/task';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: tasks = [] } = useTasks();

  // Calculate task statistics
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === TaskStatus.TODO).length,
    inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
    completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
    overdue: tasks.filter(
      (t) =>
        t.dueDate &&
        t.status !== TaskStatus.COMPLETED &&
        new Date(t.dueDate) < new Date()
    ).length,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
          <p className="text-gray-600 mt-2">Here's what's happening with your tasks today.</p>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total Tasks</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">To Do</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{stats.todo}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">In Progress</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{stats.inProgress}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Completed</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Overdue</div>
            <div className="text-3xl font-bold text-red-600 mt-2">{stats.overdue}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/tasks">
                <Button className="w-full">View All Tasks</Button>
              </Link>
              <Link to="/tasks">
                <Button variant="secondary" className="w-full">
                  Create New Task
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
              <p>
                <strong>Email Verified:</strong>{' '}
                <span className={user?.emailVerified ? 'text-green-600' : 'text-red-600'}>
                  {user?.emailVerified ? '✓ Yes' : '✗ No'}
                </span>
              </p>
              <p>
                <strong>Phone Verified:</strong>{' '}
                <span className={user?.phoneVerified ? 'text-green-600' : 'text-red-600'}>
                  {user?.phoneVerified ? '✓ Yes' : '✗ No'}
                </span>
              </p>
            </div>
          </div>
        </div>
    </div>
    </Layout>
  );
};

export default DashboardPage;
