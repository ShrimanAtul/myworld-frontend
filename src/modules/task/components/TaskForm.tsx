import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '@shared/types/task';
import { Button, Input, Modal } from '@shared/components';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  task?: Task;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority | ''>(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus | ''>(TaskStatus.TODO);
  const [dueDate, setDueDate] = useState('');
  const [recurrenceRule, setRecurrenceRule] = useState('');
  const [tags, setTags] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority || '');
      setStatus(task.status || '');
      setDueDate(task.dueDate || '');
      setRecurrenceRule(task.recurrenceRule || '');
      setTags(task.tags?.join(', ') || '');
    } else {
      // Reset for new task
      setTitle('');
      setDescription('');
      setPriority(TaskPriority.MEDIUM);
      setStatus(TaskStatus.TODO);
      setDueDate('');
      setRecurrenceRule('');
      setTags('');
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: any = {
      title,
      description: description || undefined,
      priority: priority || undefined,
      dueDate: dueDate || undefined,
      recurrenceRule: recurrenceRule || undefined,
      tags: tags
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t)
        : undefined,
    };

    // Add status only for updates
    if (task) {
      data.status = status || undefined;
    }

    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter task title"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="">None</option>
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
              <option value={TaskPriority.URGENT}>Urgent</option>
            </select>
          </div>

          {task && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value={TaskStatus.TODO}>To Do</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
                <option value={TaskStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
          )}
        </div>

        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />

        <Input
          label="Recurrence Rule (iCal format)"
          value={recurrenceRule}
          onChange={(e) => setRecurrenceRule(e.target.value)}
          placeholder="e.g., FREQ=DAILY;INTERVAL=1"
          helperText="Optional: Use iCalendar RRULE format for recurring tasks"
        />

        <Input
          label="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="work, personal, urgent (comma separated)"
          helperText="Separate tags with commas"
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
