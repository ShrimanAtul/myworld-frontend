import React from 'react';
import { Task, TaskStatus, TaskPriority } from '@shared/types/task';
import { Button } from '@shared/components';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const priorityColors = {
  [TaskPriority.LOW]: 'bg-gray-100 text-gray-800',
  [TaskPriority.MEDIUM]: 'bg-blue-100 text-blue-800',
  [TaskPriority.HIGH]: 'bg-orange-100 text-orange-800',
  [TaskPriority.URGENT]: 'bg-red-100 text-red-800',
};

const statusColors = {
  [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TaskStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [TaskStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const isOverdue =
    task.dueDate &&
    task.status !== TaskStatus.COMPLETED &&
    new Date(task.dueDate) < new Date();

  const handleStatusToggle = () => {
    const newStatus =
      task.status === TaskStatus.COMPLETED
        ? TaskStatus.TODO
        : TaskStatus.COMPLETED;
    onStatusChange(task.id, newStatus);
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleStatusToggle}
          className="mt-1 flex-shrink-0"
          aria-label={
            task.status === TaskStatus.COMPLETED
              ? 'Mark as incomplete'
              : 'Mark as complete'
          }
        >
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              task.status === TaskStatus.COMPLETED
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {task.status === TaskStatus.COMPLETED && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-lg font-medium ${
                task.status === TaskStatus.COMPLETED
                  ? 'line-through text-gray-500'
                  : 'text-gray-900'
              }`}
            >
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* Priority */}
            {task.priority && (
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  priorityColors[task.priority]
                }`}
              >
                {task.priority}
              </span>
            )}

            {/* Status */}
            {task.status && task.status !== TaskStatus.TODO && (
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  statusColors[task.status]
                }`}
              >
                {task.status.replace('_', ' ')}
              </span>
            )}

            {/* Due date */}
            {task.dueDate && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  isOverdue
                    ? 'bg-red-100 text-red-800 font-medium'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {isOverdue ? '⚠️ ' : '📅 '}
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}

            {/* Recurring indicator */}
            {task.recurrenceRule && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                🔁 Recurring
              </span>
            )}

            {/* Tags */}
            {task.tags &&
              task.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800"
                >
                  #{tag}
                </span>
              ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" variant="secondary" onClick={() => onEdit(task)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
