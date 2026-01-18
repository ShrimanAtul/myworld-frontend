import React from 'react';
import { TaskStatus } from '@shared/types/task';

interface TaskFiltersProps {
  status?: TaskStatus | 'ALL';
  onStatusChange: (status: TaskStatus | 'ALL') => void;
  from?: string;
  to?: string;
  onDateRangeChange: (from: string, to: string) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  status = 'ALL',
  onStatusChange,
  from = '',
  to = '',
  onDateRangeChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'ALL')}
          >
            <option value="ALL">All Tasks</option>
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
            <option value={TaskStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>

        {/* From Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={from}
            onChange={(e) => onDateRangeChange(e.target.value, to)}
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={to}
            onChange={(e) => onDateRangeChange(from, e.target.value)}
            min={from}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
