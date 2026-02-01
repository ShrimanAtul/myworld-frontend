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
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrenceFreq, setRecurrenceFreq] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('DAILY');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceCount, setRecurrenceCount] = useState<number | ''>('');
  const [recurrenceUntil, setRecurrenceUntil] = useState('');
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [tags, setTags] = useState('');

  // Parse iCal recurrence rule into dropdown values
  const parseRecurrenceRule = (rule: string) => {
    if (!rule) return;

    const parts = rule.split(';');
    const params: Record<string, string> = {};
    
    parts.forEach(part => {
      const [key, value] = part.split('=');
      if (key && value) {
        params[key] = value;
      }
    });

    // Parse frequency
    if (params.FREQ) {
      setRecurrenceFreq(params.FREQ as any);
    }

    // Parse interval
    if (params.INTERVAL) {
      setRecurrenceInterval(parseInt(params.INTERVAL) || 1);
    } else {
      setRecurrenceInterval(1);
    }

    // Parse weekdays for weekly recurrence
    if (params.BYDAY) {
      setWeekDays(params.BYDAY.split(','));
    } else {
      setWeekDays([]);
    }

    // Parse end condition
    if (params.COUNT) {
      setRecurrenceCount(parseInt(params.COUNT) || '');
      setRecurrenceUntil('');
    } else if (params.UNTIL) {
      // Parse UNTIL format: YYYYMMDDTHHMMSSZ -> YYYY-MM-DD
      const until = params.UNTIL;
      if (until.length >= 8) {
        const year = until.substring(0, 4);
        const month = until.substring(4, 6);
        const day = until.substring(6, 8);
        setRecurrenceUntil(`${year}-${month}-${day}`);
      }
      setRecurrenceCount('');
    } else {
      setRecurrenceCount('');
      setRecurrenceUntil('');
    }
  };

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority || '');
      setStatus(task.status || '');
      setDueDate(task.dueDate || '');
      setShowRecurrence(!!task.recurrenceRule);
      
      // Parse recurrence rule into dropdowns
      if (task.recurrenceRule) {
        parseRecurrenceRule(task.recurrenceRule);
      }
      
      setTags(task.tags?.join(', ') || '');
    } else {
      // Reset for new task
      setTitle('');
      setDescription('');
      setPriority(TaskPriority.MEDIUM);
      setStatus(TaskStatus.TODO);
      setDueDate('');
      setShowRecurrence(false);
      setRecurrenceFreq('DAILY');
      setRecurrenceInterval(1);
      setRecurrenceCount('');
      setRecurrenceUntil('');
      setWeekDays([]);
      setTags('');
    }
  }, [task, isOpen]);

  const buildRecurrenceRule = (): string | undefined => {
    if (!showRecurrence) return undefined;
    
    let rule = `FREQ=${recurrenceFreq}`;
    
    if (recurrenceInterval > 1) {
      rule += `;INTERVAL=${recurrenceInterval}`;
    }
    
    if (recurrenceFreq === 'WEEKLY' && weekDays.length > 0) {
      rule += `;BYDAY=${weekDays.join(',')}`;
    }
    
    if (recurrenceCount && recurrenceCount > 0) {
      rule += `;COUNT=${recurrenceCount}`;
    } else if (recurrenceUntil) {
      const until = recurrenceUntil.replace(/-/g, '') + 'T235959Z';
      rule += `;UNTIL=${until}`;
    }
    
    return rule;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: any = {
      title,
      description: description || undefined,
      priority: priority || undefined,
      dueDate: dueDate || undefined,
      recurrenceRule: buildRecurrenceRule(),
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

        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="recurrence-toggle"
              checked={showRecurrence}
              onChange={(e) => setShowRecurrence(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="recurrence-toggle" className="text-sm font-medium text-gray-700">
              Make this a recurring task
            </label>
          </div>

          {showRecurrence && (
            <div className="space-y-3 pl-6 border-l-2 border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repeats
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={recurrenceFreq}
                    onChange={(e) => setRecurrenceFreq(e.target.value as any)}
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Every
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={recurrenceInterval}
                    onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              {recurrenceFreq === 'WEEKLY' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repeat on
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map((day, idx) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setWeekDays(prev => 
                            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                          );
                        }}
                        className={`px-3 py-1 rounded text-sm ${
                          weekDays.includes(day)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ends
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="never"
                      name="end"
                      checked={!recurrenceCount && !recurrenceUntil}
                      onChange={() => {
                        setRecurrenceCount('');
                        setRecurrenceUntil('');
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="never" className="text-sm text-gray-700">Never</label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="after"
                      name="end"
                      checked={!!recurrenceCount}
                      onChange={() => {
                        setRecurrenceCount(10);
                        setRecurrenceUntil('');
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="after" className="text-sm text-gray-700">After</label>
                    <input
                      type="number"
                      min="1"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      value={recurrenceCount}
                      onChange={(e) => {
                        setRecurrenceCount(parseInt(e.target.value) || '');
                        setRecurrenceUntil('');
                      }}
                      disabled={!recurrenceCount}
                    />
                    <span className="text-sm text-gray-700">occurrences</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="on"
                      name="end"
                      checked={!!recurrenceUntil}
                      onChange={() => {
                        setRecurrenceUntil(new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]);
                        setRecurrenceCount('');
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="on" className="text-sm text-gray-700">On</label>
                    <input
                      type="date"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      value={recurrenceUntil}
                      onChange={(e) => {
                        setRecurrenceUntil(e.target.value);
                        setRecurrenceCount('');
                      }}
                      disabled={!recurrenceUntil}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              {buildRecurrenceRule() && (
                <div className="text-xs text-gray-500 mt-2">
                  Rule: {buildRecurrenceRule()}
                </div>
              )}
            </div>
          )}
        </div>

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
